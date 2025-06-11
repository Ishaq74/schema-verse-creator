
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Database, FileCode, Zap, Download, Settings, Sparkles, Upload, Save } from 'lucide-react';
import { TableEditor } from '@/components/TableEditor';
import { ArtifactViewer } from '@/components/ArtifactViewer';
import { ArtifactGenerator } from '@/components/ArtifactGenerator';
import { SchemaPresets } from '@/components/SchemaPresets';
import { GeminiIntegration } from '@/components/GeminiIntegration';
import { Table, Schema, GeneratedArtifacts } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [schema, setSchema] = useState<Schema>({
    tables: [],
    name: 'Mon Projet',
    description: '',
    version: '1.0.0'
  });
  
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [artifacts, setArtifacts] = useState<GeneratedArtifacts | null>(null);
  const [artifactTableName, setArtifactTableName] = useState<string>('');
  const [showArtifacts, setShowArtifacts] = useState(false);
  
  const { toast } = useToast();

  const addTable = () => {
    const newTable: Table = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      fields: [],
      category: ''
    };
    
    setSchema(prev => ({
      ...prev,
      tables: [...prev.tables, newTable]
    }));
    
    setActiveTableId(newTable.id);
  };

  const updateTable = (tableId: string, updatedTable: Table) => {
    setSchema(prev => ({
      ...prev,
      tables: prev.tables.map(table => 
        table.id === tableId ? updatedTable : table
      )
    }));
  };

  const deleteTable = (tableId: string) => {
    setSchema(prev => ({
      ...prev,
      tables: prev.tables.filter(table => table.id !== tableId)
    }));
    
    if (activeTableId === tableId) {
      setActiveTableId(null);
    }
  };

  const generateArtifacts = (table: Table) => {
    if (!table.name || table.fields.length === 0) {
      toast({
        title: "Erreur",
        description: "La table doit avoir un nom et au moins un champ.",
        variant: "destructive"
      });
      return;
    }

    const generatedArtifacts = ArtifactGenerator.generateAll(table);
    setArtifacts(generatedArtifacts);
    setArtifactTableName(table.name);
    setShowArtifacts(true);
    
    toast({
      title: "Artefacts générés !",
      description: `Tous les formats ont été générés pour la table "${table.name}".`,
    });
  };

  const generateAllArtifacts = () => {
    if (schema.tables.length === 0) {
      toast({
        title: "Aucune table",
        description: "Ajoutez au moins une table pour générer les artefacts.",
        variant: "destructive"
      });
      return;
    }

    // Générer un ZIP avec tous les artefacts (pour une future version)
    toast({
      title: "Fonctionnalité à venir",
      description: "La génération globale sera disponible prochainement.",
    });
  };

  const applyPreset = (presetSchema: Schema) => {
    setSchema(presetSchema);
    if (presetSchema.tables.length > 0) {
      setActiveTableId(presetSchema.tables[0].id);
    }
    
    toast({
      title: "Preset appliqué",
      description: `Le preset "${presetSchema.name}" a été chargé avec ${presetSchema.tables.length} table(s).`,
    });
  };

  const exportSchema = () => {
    const dataStr = JSON.stringify(schema, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `schema-${schema.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Schema exporté",
      description: `Le fichier ${exportFileDefaultName} a été téléchargé.`,
    });
  };

  const importSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSchema = JSON.parse(e.target?.result as string);
        setSchema(importedSchema);
        setActiveTableId(importedSchema.tables?.[0]?.id || null);
        
        toast({
          title: "Schema importé",
          description: `Le schema "${importedSchema.name}" a été chargé.`,
        });
      } catch (error) {
        toast({
          title: "Erreur d'import",
          description: "Le fichier JSON n'est pas valide.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const activeTable = schema.tables.find(t => t.id === activeTableId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  DataStruct Generator
                </h1>
                <p className="text-sm text-slate-600">
                  Générateur multi-format avec IA Gemini Flash 2.0
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs">
                {schema.tables.length} table{schema.tables.length !== 1 ? 's' : ''}
              </Badge>
              
              <input
                type="file"
                accept=".json"
                onChange={importSchema}
                className="hidden"
                id="import-schema"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('import-schema')?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportSchema}
                disabled={schema.tables.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              
              <Button 
                onClick={generateAllArtifacts}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={schema.tables.length === 0}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Générer tout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">Éditeur</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="ai">Assistant IA</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Navigation des tables */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Database className="h-5 w-5" />
                      Tables ({schema.tables.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="space-y-2">
                      {schema.tables.map(table => (
                        <div 
                          key={table.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            activeTableId === table.id 
                              ? 'bg-blue-50 border-blue-200 shadow-sm' 
                              : 'bg-white border-slate-200 hover:bg-slate-50'
                          }`}
                          onClick={() => setActiveTableId(table.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">
                              {table.name || 'Table sans nom'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {table.fields.length}
                            </Badge>
                          </div>
                          {table.description && (
                            <p className="text-xs text-slate-600 mt-1 truncate">
                              {table.description}
                            </p>
                          )}
                          {table.category && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {table.category}
                            </Badge>
                          )}
                        </div>
                      ))}
                      
                      <Button 
                        onClick={addTable}
                        variant="outline" 
                        className="w-full mt-3"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une table
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {activeTable ? (
                  <TableEditor
                    table={activeTable}
                    onUpdate={(updatedTable) => updateTable(activeTable.id, updatedTable)}
                    onDelete={() => deleteTable(activeTable.id)}
                    onGenerateArtifacts={generateArtifacts}
                  />
                ) : (
                  <Card className="h-96">
                    <CardContent className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Database className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 mb-2">
                          Aucune table sélectionnée
                        </h3>
                        <p className="text-slate-500 mb-4">
                          Sélectionnez une table existante ou créez-en une nouvelle
                        </p>
                        <Button onClick={addTable} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Créer ma première table
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="mt-6">
            <SchemaPresets onApplyPreset={applyPreset} />
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <GeminiIntegration
              schema={schema}
              activeTable={activeTable}
              onSchemaUpdate={setSchema}
              onTableUpdate={(updatedTable) => {
                if (activeTable) {
                  updateTable(activeTable.id, updatedTable);
                }
              }}
            />
          </TabsContent>

          <TabsContent value="config" className="mt-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5" />
                  Configuration du Projet
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project-name">Nom du projet</Label>
                    <Input
                      id="project-name"
                      value={schema.name}
                      onChange={(e) => setSchema(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="project-version">Version</Label>
                    <Input
                      id="project-version"
                      value={schema.version}
                      onChange={(e) => setSchema(prev => ({ ...prev, version: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={schema.description}
                    onChange={(e) => setSchema(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-1"
                    rows={4}
                  />
                </div>

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
                    <div className="text-xs text-slate-600">Champs totaux</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {schema.tables.filter(t => t.fields.some(f => f.primary_key)).length}
                    </div>
                    <div className="text-xs text-slate-600">Clés primaires</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {schema.tables.reduce((acc, table) => acc + table.fields.filter(f => f.type_general === 'relation').length, 0)}
                    </div>
                    <div className="text-xs text-slate-600">Relations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Panel */}
      <div className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Formats de sortie supportés
            </h2>
            <p className="text-slate-600">
              Générez automatiquement du code prêt à utiliser pour tous vos projets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Database,
                title: 'PostgreSQL/Supabase',
                description: 'Scripts SQL complets avec RLS, contraintes et index optimisés'
              },
              {
                icon: FileCode,
                title: 'Astro ContentCollection',
                description: 'Configuration Zod typée et pages dynamiques [slug].astro'
              },
              {
                icon: FileCode,
                title: 'WordPress ACF',
                description: 'Export JSON ACF prêt à importer dans WordPress'
              },
              {
                icon: Download,
                title: 'CSV/XLSX',
                description: 'Exports documentés avec structure complète des données'
              },
              {
                icon: Zap,
                title: 'Validation avancée',
                description: 'Relations, cardinalités, slugs et contraintes automatiques'
              },
              {
                icon: FileCode,
                title: 'Documentation',
                description: 'Documentation technique générée automatiquement'
              }
            ].map((feature, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Artifact Viewer Modal */}
      {showArtifacts && artifacts && (
        <ArtifactViewer
          artifacts={artifacts}
          tableName={artifactTableName}
          onClose={() => setShowArtifacts(false)}
        />
      )}
    </div>
  );
};

export default Index;
