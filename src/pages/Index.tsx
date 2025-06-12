import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Database, FileDown, FileUp, Sparkles, 
  Plus, Settings, BookOpen, Upload
} from 'lucide-react';
import { Schema, Table, GeneratedArtifacts } from '@/types/schema';
import { TableEditor } from '@/components/TableEditor';
import { FieldEditor } from '@/components/FieldEditor';
import { ArtifactGeneratorComponent } from '@/components/ArtifactGeneratorComponent';
import { ArtifactViewer } from '@/components/ArtifactViewer';
import { SchemaPresets } from '@/components/SchemaPresets';
import { GeminiIntegration } from '@/components/GeminiIntegration';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [schema, setSchema] = useState<Schema>({
    tables: [],
    name: "Mon Schéma",
    description: "Description du schéma de base de données",
    version: "1.0.0"
  });

  const [activeTable, setActiveTable] = useState<Table | undefined>();
  const [generatedArtifacts, setGeneratedArtifacts] = useState<GeneratedArtifacts | null>(null);
  const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  
  const { toast } = useToast();

  const addTable = () => {
    const newTable: Table = {
      id: crypto.randomUUID(),
      name: `table_${schema.tables.length + 1}`,
      description: "Nouvelle table",
      category: "Général",
      fields: []
    };
    
    setSchema(prev => ({
      ...prev,
      tables: [...prev.tables, newTable]
    }));
    
    setActiveTable(newTable);
    
    toast({
      title: "Table ajoutée",
      description: `La table "${newTable.name}" a été créée.`,
    });
  };

  const updateTable = (updatedTable: Table) => {
    setSchema(prev => ({
      ...prev,
      tables: prev.tables.map(table => 
        table.id === updatedTable.id ? updatedTable : table
      )
    }));
    setActiveTable(updatedTable);
  };

  const deleteTable = (tableId: string) => {
    setSchema(prev => ({
      ...prev,
      tables: prev.tables.filter(table => table.id !== tableId)
    }));
    
    if (activeTable?.id === tableId) {
      setActiveTable(undefined);
    }
    
    toast({
      title: "Table supprimée",
      description: "La table a été supprimée avec succès.",
    });
  };

  const handleApplyPreset = (preset: Schema) => {
    if (isMultiSelectMode && selectedPresets.length > 1) {
      setSchema(preset);
      setSelectedPresets([]);
      setIsMultiSelectMode(false);
      
      toast({
        title: "Presets combinés",
        description: `${selectedPresets.length} presets ont été fusionnés avec succès.`,
      });
    } else {
      setSchema(preset);
      
      if (preset.tables.length > 0) {
        setActiveTable(preset.tables[0]);
      }
      
      toast({
        title: "Preset appliqué",
        description: `Le preset "${preset.name}" a été chargé avec ${preset.tables.length} table(s).`,
      });
    }
  };

  const handleTogglePreset = (presetName: string) => {
    setSelectedPresets(prev => {
      if (prev.includes(presetName)) {
        return prev.filter(name => name !== presetName);
      } else {
        return [...prev, presetName];
      }
    });
  };

  const exportSchema = () => {
    const dataStr = JSON.stringify(schema, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${schema.name.replace(/\s+/g, '_').toLowerCase()}_schema.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Schéma exporté",
      description: "Le fichier JSON a été téléchargé.",
    });
  };

  const importSchema = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSchema = JSON.parse(e.target?.result as string);
        
        if (!importedSchema.tables || !Array.isArray(importedSchema.tables)) {
          throw new Error("Structure de schéma invalide");
        }
        
        setSchema(importedSchema);
        
        if (importedSchema.tables.length > 0) {
          setActiveTable(importedSchema.tables[0]);
        }
        
        toast({
          title: "Schéma importé",
          description: `${importedSchema.tables.length} table(s) importée(s) avec succès.`,
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
    
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Générateur de Schémas Ultra-Complet
          </h1>
          <p className="text-slate-600 text-lg max-w-3xl mx-auto">
            Créez, optimisez et générez des structures de données complètes avec l'IA Gemini Flash 2.0
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={addTable} className="bg-gradient-to-r from-green-600 to-emerald-600">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Table
            </Button>
            
            <Button onClick={exportSchema} variant="outline">
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importSchema}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <FileUp className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </div>
            
            <Button
              onClick={() => setIsMultiSelectMode(!isMultiSelectMode)}
              variant={isMultiSelectMode ? "default" : "outline"}
              className={isMultiSelectMode ? "bg-blue-600" : ""}
            >
              <Settings className="h-4 w-4 mr-2" />
              {isMultiSelectMode ? "Mode Combinaison" : "Mode Simple"}
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Éditeur
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              IA Assistant
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Générateur
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Résultats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Schema Overview */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Tables ({schema.tables.length})</span>
                    <Badge variant="secondary">{schema.version}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {schema.tables.map((table) => (
                      <div
                        key={table.id}
                        onClick={() => setActiveTable(table)}
                        className={`p-3 border rounded cursor-pointer transition-colors ${
                          activeTable?.id === table.id 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{table.name}</h4>
                            <p className="text-sm text-slate-600">{table.description}</p>
                          </div>
                          <Badge variant="outline">{table.fields.length}</Badge>
                        </div>
                      </div>
                    ))}
                    
                    {schema.tables.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune table. Cliquez sur "Nouvelle Table" pour commencer.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Field Editor */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {activeTable ? `Champs de ${activeTable.name}` : 'Sélectionnez une table'}
                  </CardTitle>
                  {activeTable && (
                    <p className="text-sm text-slate-600">
                      {activeTable.description} • {activeTable.fields.length} champ(s)
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {activeTable ? (
                    <FieldEditor
                      fields={activeTable.fields}
                      onFieldsUpdate={(fields) => updateTable({ ...activeTable, fields })}
                    />
                  ) : (
                    <div className="text-center py-12 text-slate-500">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Sélectionnez ou créez une table pour commencer</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="presets">
            <SchemaPresets
              onApplyPreset={handleApplyPreset}
              selectedPresets={selectedPresets}
              onTogglePreset={handleTogglePreset}
              allowMultiple={isMultiSelectMode}
            />
          </TabsContent>

          <TabsContent value="ai">
            <GeminiIntegration
              schema={schema}
              activeTable={activeTable}
              onSchemaUpdate={setSchema}
              onTableUpdate={updateTable}
            />
          </TabsContent>

          <TabsContent value="generator">
            <ArtifactGeneratorComponent
              schema={schema}
              onGenerate={setGeneratedArtifacts}
            />
          </TabsContent>

          <TabsContent value="artifacts">
            {generatedArtifacts ? (
              <ArtifactViewer 
                artifacts={generatedArtifacts} 
                tableName={schema.name}
                onClose={() => setGeneratedArtifacts(null)}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-slate-500">
                    Utilisez le générateur pour créer vos artifacts
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Schema Stats */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{schema.tables.length}</div>
                <div className="text-sm text-slate-600">Tables créées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {schema.tables.reduce((acc, table) => acc + table.fields.length, 0)}
                </div>
                <div className="text-sm text-slate-600">Champs définis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {schema.tables.filter(t => t.fields.some(f => f.primary_key)).length}
                </div>
                <div className="text-sm text-slate-600">Clés primaires</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {schema.tables.reduce((acc, table) => 
                    acc + table.fields.filter(f => f.foreign_key).length, 0
                  )}
                </div>
                <div className="text-sm text-slate-600">Relations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
