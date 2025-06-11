
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Loader2, Lightbulb, Plus, Wand2, AlertCircle } from 'lucide-react';
import { Table, Field, Schema } from '@/types/schema';
import { GeminiService, GeminiSuggestion } from '@/services/GeminiService';
import { useToast } from '@/hooks/use-toast';

interface GeminiIntegrationProps {
  schema: Schema;
  activeTable?: Table;
  onSchemaUpdate: (schema: Schema) => void;
  onTableUpdate: (table: Table) => void;
}

export const GeminiIntegration: React.FC<GeminiIntegrationProps> = ({
  schema,
  activeTable,
  onSchemaUpdate,
  onTableUpdate
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GeminiSuggestion[]>([]);
  const [context, setContext] = useState('');
  const { toast } = useToast();

  const geminiService = apiKey ? new GeminiService({ apiKey }) : null;

  const analyzeSchema = async () => {
    if (!geminiService) {
      toast({
        title: "Clé API manquante",
        description: "Veuillez saisir votre clé API Gemini.",
        variant: "destructive"
      });
      return;
    }

    if (schema.tables.length === 0) {
      toast({
        title: "Aucune table",
        description: "Ajoutez au moins une table pour analyser le schéma.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const newSuggestions = await geminiService.analyzeSchema(schema);
      setSuggestions(newSuggestions);
      
      toast({
        title: "Analyse terminée",
        description: `${newSuggestions.length} suggestions générées par Gemini.`,
      });
    } catch (error) {
      console.error('Error analyzing schema:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser le schéma. Vérifiez votre clé API.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const improveTable = async () => {
    if (!geminiService || !activeTable) {
      toast({
        title: "Prérequis manquants",
        description: "Clé API et table active requises.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const improvedTable = await geminiService.improveTable(activeTable);
      onTableUpdate(improvedTable);
      
      toast({
        title: "Table améliorée",
        description: `La table "${activeTable.name}" a été optimisée par Gemini.`,
      });
    } catch (error) {
      console.error('Error improving table:', error);
      toast({
        title: "Erreur d'amélioration",
        description: "Impossible d'améliorer la table.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateFields = async () => {
    if (!geminiService || !activeTable || !context.trim()) {
      toast({
        title: "Prérequis manquants",
        description: "Clé API, table active et contexte requis.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const newFields = await geminiService.generateMissingFields(activeTable, context);
      
      if (newFields.length > 0) {
        const updatedTable = {
          ...activeTable,
          fields: [...activeTable.fields, ...newFields]
        };
        onTableUpdate(updatedTable);
        
        toast({
          title: "Champs générés",
          description: `${newFields.length} nouveaux champs ajoutés par Gemini.`,
        });
      } else {
        toast({
          title: "Aucun champ généré",
          description: "Gemini n'a pas trouvé de champs à ajouter.",
        });
      }
    } catch (error) {
      console.error('Error generating fields:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer les champs.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (suggestion: GeminiSuggestion) => {
    try {
      switch (suggestion.type) {
        case 'field':
          if (activeTable && suggestion.implementation?.field) {
            const newField: Field = {
              name: suggestion.implementation.field.name || 'nouveau_champ',
              type_general: suggestion.implementation.field.type_general || 'string',
              type_sql: suggestion.implementation.field.type_sql || 'VARCHAR(255)',
              required: Boolean(suggestion.implementation.field.required),
              unique: Boolean(suggestion.implementation.field.unique),
              primary_key: Boolean(suggestion.implementation.field.primary_key),
              description: suggestion.implementation.field.description || suggestion.description,
              example_value: suggestion.implementation.field.example_value || '',
              slug_compatible: Boolean(suggestion.implementation.field.slug_compatible),
              acf_field_type: suggestion.implementation.field.acf_field_type || 'text',
              ui_component: suggestion.implementation.field.ui_component || 'input'
            };
            
            const updatedTable = {
              ...activeTable,
              fields: [...activeTable.fields, newField]
            };
            onTableUpdate(updatedTable);
          }
          break;
          
        case 'optimization':
          // Apply optimization suggestions (index, constraints, etc.)
          if (activeTable) {
            toast({
              title: "Optimisation appliquée",
              description: "Les optimisations seront visibles dans le code généré.",
            });
          }
          break;
          
        case 'table':
          // Create new table from suggestion
          if (suggestion.implementation?.table) {
            const newTable: Table = {
              id: crypto.randomUUID(),
              name: suggestion.implementation.table.name || 'nouvelle_table',
              description: suggestion.implementation.table.description || suggestion.description,
              category: suggestion.implementation.table.category || 'Général',
              fields: suggestion.implementation.table.fields || []
            };
            
            const updatedSchema = {
              ...schema,
              tables: [...schema.tables, newTable]
            };
            onSchemaUpdate(updatedSchema);
          }
          break;
          
        case 'relationship':
          // Handle relationship suggestions
          toast({
            title: "Relation suggérée",
            description: "Consultez la documentation pour implémenter cette relation.",
          });
          break;
          
        default:
          toast({
            title: "Type non supporté",
            description: "Ce type de suggestion n'est pas encore supporté.",
          });
      }

      // Remove applied suggestion
      setSuggestions(prev => prev.filter(s => s !== suggestion));
      
      toast({
        title: "Suggestion appliquée",
        description: suggestion.title,
      });
    } catch (error) {
      console.error('Error applying suggestion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer cette suggestion.",
        variant: "destructive"
      });
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'field': return Plus;
      case 'optimization': return Wand2;
      case 'relationship': return Sparkles;
      default: return Lightbulb;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Assistant IA Gemini Flash 2.0
        </CardTitle>
        <p className="text-sm text-slate-600">
          Améliorez automatiquement vos structures de données avec l'IA
        </p>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Configuration API */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="gemini-api-key">Clé API Gemini *</Label>
            <Input
              id="gemini-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Saisissez votre clé API Gemini..."
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              Obtenez votre clé API sur{' '}
              <a 
                href="https://makersuite.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          {!apiKey && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Une clé API Gemini est requise pour utiliser l'assistant IA.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Actions IA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={analyzeSchema}
            disabled={!apiKey || isLoading || schema.tables.length === 0}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Lightbulb className="h-4 w-4 mr-2" />
            )}
            Analyser le schéma
          </Button>

          <Button
            onClick={improveTable}
            disabled={!apiKey || !activeTable || isLoading}
            variant="outline"
            className="border-purple-200 hover:bg-purple-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Améliorer la table
          </Button>

          <div className="space-y-2">
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Contexte pour génération (ex: blog, e-commerce...)"
              rows={1}
              className="text-sm"
            />
            <Button
              onClick={generateFields}
              disabled={!apiKey || !activeTable || !context.trim() || isLoading}
              variant="outline"
              size="sm"
              className="w-full border-green-200 hover:bg-green-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Générer champs
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggestions d'amélioration ({suggestions.length})
            </h3>
            
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => {
                const IconComponent = getSuggestionIcon(suggestion.type);
                return (
                  <Card key={index} className="border-slate-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <IconComponent className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-slate-800">
                                {suggestion.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.type}
                              </Badge>
                              <Badge 
                                className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                              >
                                {Math.round(suggestion.confidence * 100)}%
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">
                              {suggestion.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => applySuggestion(suggestion)}
                          size="sm"
                          variant="outline"
                          className="ml-3"
                        >
                          Appliquer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">
              {schema.tables.length}
            </div>
            <div className="text-xs text-slate-600">Tables</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">
              {schema.tables.reduce((acc, table) => acc + table.fields.length, 0)}
            </div>
            <div className="text-xs text-slate-600">Champs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">
              {suggestions.length}
            </div>
            <div className="text-xs text-slate-600">Suggestions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {suggestions.filter(s => s.confidence >= 0.8).length}
            </div>
            <div className="text-xs text-slate-600">Haute confiance</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
