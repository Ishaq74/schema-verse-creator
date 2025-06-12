
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sparkles, Loader2, Lightbulb, Plus, Wand2, AlertCircle, 
  Save, Trash2, FileText, Database, SearchCheck, 
  BarChart3, Download, Eye, Settings, BookOpen 
} from 'lucide-react';
import { Table, Field, Schema } from '@/types/schema';
import { GeminiService, GeminiSuggestion, ContentGenerationRequest, ContentGenerationResult } from '@/services/GeminiService';
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
  const [generatedData, setGeneratedData] = useState<ContentGenerationResult | null>(null);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [documentation, setDocumentation] = useState('');
  
  // Content generation settings
  const [recordCount, setRecordCount] = useState(10);
  const [dataLanguage, setDataLanguage] = useState('fr');
  const [dataStyle, setDataStyle] = useState('réaliste');
  
  // SEO settings
  const [seoKeywords, setSeoKeywords] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    // Load stored API key on component mount
    const storedKey = GeminiService.getStoredApiKey();
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const geminiService = apiKey ? new GeminiService({ apiKey }) : null;

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      GeminiService.saveApiKey(apiKey);
      toast({
        title: "Clé API sauvegardée",
        description: "Votre clé API Gemini a été sauvegardée en local.",
      });
    }
  };

  const handleClearApiKey = () => {
    GeminiService.clearStoredApiKey();
    setApiKey('');
    toast({
      title: "Clé API supprimée",
      description: "La clé API a été supprimée du stockage local.",
    });
  };

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
        description: `${newSuggestions.length} suggestions générées par Gemini Flash 2.0.`,
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

  const generateSampleData = async () => {
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
      const request: ContentGenerationRequest = {
        table: activeTable,
        recordCount,
        context: context || `Données pour ${activeTable.name}`,
        language: dataLanguage,
        style: dataStyle
      };

      const result = await geminiService.generateSampleData(request);
      setGeneratedData(result);
      
      toast({
        title: "Données générées",
        description: `${result.data.length} enregistrements créés pour "${activeTable.name}".`,
      });
    } catch (error) {
      console.error('Error generating sample data:', error);
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer les données d'exemple.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const optimizeForSEO = async () => {
    if (!geminiService || !activeTable) {
      toast({
        title: "Prérequis manquants",
        description: "Clé API et table active requises.",
        variant: "destructive"
      });
      return;
    }

    const keywords = seoKeywords.split(',').map(k => k.trim()).filter(k => k);
    if (keywords.length === 0) {
      toast({
        title: "Mots-clés requis",
        description: "Saisissez au moins un mot-clé pour l'optimisation SEO.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const seoSuggestions = await geminiService.optimizeForSEO(activeTable, keywords);
      setSuggestions(prev => [...prev, ...seoSuggestions]);
      
      toast({
        title: "Optimisation SEO",
        description: `${seoSuggestions.length} suggestions SEO générées.`,
      });
    } catch (error) {
      console.error('Error optimizing for SEO:', error);
      toast({
        title: "Erreur SEO",
        description: "Impossible de générer les optimisations SEO.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateSchema = async () => {
    if (!geminiService) {
      toast({
        title: "Clé API manquante",
        description: "Veuillez saisir votre clé API Gemini.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await geminiService.validateSchema(schema);
      setValidationResult(result);
      
      toast({
        title: "Validation terminée",
        description: `${result.errors.length} erreurs, ${result.warnings.length} avertissements trouvés.`,
        variant: result.errors.length > 0 ? "destructive" : "default"
      });
    } catch (error) {
      console.error('Error validating schema:', error);
      toast({
        title: "Erreur de validation",
        description: "Impossible de valider le schéma.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateDocumentation = async () => {
    if (!geminiService) {
      toast({
        title: "Clé API manquante",
        description: "Veuillez saisir votre clé API Gemini.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const docs = await geminiService.generateDocumentation(schema);
      setDocumentation(docs);
      
      toast({
        title: "Documentation générée",
        description: "Documentation technique complète créée.",
      });
    } catch (error) {
      console.error('Error generating documentation:', error);
      toast({
        title: "Erreur de documentation",
        description: "Impossible de générer la documentation.",
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
              foreign_key: suggestion.implementation.field.foreign_key,
              relation_cardinality: suggestion.implementation.field.relation_cardinality,
              enum_values: suggestion.implementation.field.enum_values,
              description: suggestion.implementation.field.description || suggestion.description,
              example_value: suggestion.implementation.field.example_value || '',
              category: suggestion.implementation.field.category,
              notes: suggestion.implementation.field.notes,
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
        case 'seo':
          if (activeTable) {
            toast({
              title: "Optimisation appliquée",
              description: "Les optimisations seront visibles dans le code généré.",
            });
          }
          break;
          
        case 'table':
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

  const downloadGeneratedData = () => {
    if (!generatedData) return;
    
    const dataStr = JSON.stringify(generatedData.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTable?.name || 'data'}_sample.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'field': return Plus;
      case 'optimization': return Wand2;
      case 'relationship': return Sparkles;
      case 'seo': return SearchCheck;
      case 'content': return FileText;
      default: return Lightbulb;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          Assistant IA Gemini Flash 2.0 - Ultra Complet
        </CardTitle>
        <p className="text-sm text-slate-600">
          Suite complète d'outils IA pour optimiser et enrichir vos structures de données
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Config
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analyse
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Génération
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contenu
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2">
              <SearchCheck className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Docs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="gemini-api-key">Clé API Gemini *</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="gemini-api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Saisissez votre clé API Gemini..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSaveApiKey}
                    disabled={!apiKey.trim()}
                    variant="outline"
                    size="icon"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleClearApiKey}
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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

              <div>
                <Label htmlFor="context">Contexte du projet</Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Décrivez votre projet (ex: blog tech, e-commerce mode, plateforme formation...)"
                  rows={3}
                  className="mt-1"
                />
              </div>

              {!apiKey && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Une clé API Gemini est requise pour utiliser l'assistant IA. Toutes les fonctionnalités avancées seront disponibles une fois configurée.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={analyzeSchema}
                disabled={!apiKey || isLoading || schema.tables.length === 0}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <BarChart3 className="h-4 w-4 mr-2" />
                )}
                Analyser le schéma complet
              </Button>

              <Button
                onClick={validateSchema}
                disabled={!apiKey || isLoading || schema.tables.length === 0}
                variant="outline"
                className="border-orange-200 hover:bg-orange-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4 mr-2" />
                )}
                Valider & Diagnostiquer
              </Button>
            </div>

            {validationResult && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Résultat de validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={validationResult.isValid ? "default" : "destructive"}>
                        {validationResult.isValid ? "✓ Valide" : "✗ Erreurs détectées"}
                      </Badge>
                    </div>
                    
                    {validationResult.errors.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-800 mb-2">Erreurs critiques :</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                          {validationResult.errors.map((error: string, idx: number) => (
                            <li key={idx}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {validationResult.warnings.length > 0 && (
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">Avertissements :</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                          {validationResult.warnings.map((warning: string, idx: number) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="generation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={improveTable}
                disabled={!apiKey || !activeTable || isLoading}
                variant="outline"
                className="border-blue-200 hover:bg-blue-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Améliorer la table active
              </Button>

              <Button
                onClick={generateFields}
                disabled={!apiKey || !activeTable || !context.trim() || isLoading}
                variant="outline"
                className="border-green-200 hover:bg-green-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Générer champs manquants
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="record-count">Nombre d'enregistrements</Label>
                <Input
                  id="record-count"
                  type="number"
                  value={recordCount}
                  onChange={(e) => setRecordCount(parseInt(e.target.value) || 10)}
                  min="1"
                  max="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="data-language">Langue</Label>
                <Select value={dataLanguage} onValueChange={setDataLanguage}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="data-style">Style</Label>
                <Select value={dataStyle} onValueChange={setDataStyle}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="réaliste">Réaliste</SelectItem>
                    <SelectItem value="créatif">Créatif</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                    <SelectItem value="casual">Décontracté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={generateSampleData}
              disabled={!apiKey || !activeTable || isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Database className="h-4 w-4 mr-2" />
              )}
              Générer données d'exemple contextuelles
            </Button>

            {generatedData && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Données générées</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={downloadGeneratedData}
                      size="sm"
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger JSON
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Enregistrements générés : <strong>{generatedData.metadata.generated_count}</strong></span>
                      <span>Contexte : <strong>{generatedData.metadata.context_applied}</strong></span>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto border rounded p-3 bg-gray-50">
                      <pre className="text-xs">
                        {JSON.stringify(generatedData.data.slice(0, 3), null, 2)}
                        {generatedData.data.length > 3 && '\n... et ' + (generatedData.data.length - 3) + ' autres'}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <div>
              <Label htmlFor="seo-keywords">Mots-clés cibles (séparés par des virgules)</Label>
              <Input
                id="seo-keywords"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="développement web, react, javascript, formation"
                className="mt-1"
              />
            </div>

            <Button
              onClick={optimizeForSEO}
              disabled={!apiKey || !activeTable || !seoKeywords.trim() || isLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <SearchCheck className="h-4 w-4 mr-2" />
              )}
              Optimiser pour le SEO
            </Button>
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <Button
              onClick={generateDocumentation}
              disabled={!apiKey || schema.tables.length === 0 || isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BookOpen className="h-4 w-4 mr-2" />
              )}
              Générer documentation technique
            </Button>

            {documentation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documentation générée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto border rounded p-4 bg-gray-50">
                    <pre className="whitespace-pre-wrap text-sm">{documentation}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
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
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h4 className="font-medium text-slate-800">
                                {suggestion.title}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {suggestion.type}
                              </Badge>
                              {suggestion.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {suggestion.category}
                                </Badge>
                              )}
                              <Badge 
                                className={`text-xs ${getConfidenceColor(suggestion.confidence)}`}
                              >
                                {Math.round(suggestion.confidence * 100)}%
                              </Badge>
                              {suggestion.impact && (
                                <Badge 
                                  className={`text-xs ${getImpactColor(suggestion.impact)}`}
                                >
                                  {suggestion.impact}
                                </Badge>
                              )}
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

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg">
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
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {generatedData?.data.length || 0}
            </div>
            <div className="text-xs text-slate-600">Données générées</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
