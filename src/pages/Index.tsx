import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, Field, Schema } from '@/types/schema';
import { SchemaEditor } from '@/components/SchemaEditor';
import { SchemaPresets } from '@/components/SchemaPresets';
import { GeminiIntegration } from '@/components/GeminiIntegration';
import { useToast } from "@/hooks/use-toast"
import {
  Download,
  Copy,
  Plus,
  Edit,
  Settings,
  BookOpen,
  Sparkles
} from 'lucide-react';

const Index = () => {
  const [schema, setSchema] = useState<Schema>({
    name: "Mon Schéma",
    description: "Un nouveau schéma de base de données",
    version: "1.0.0",
    tables: []
  });
  const [activeTab, setActiveTab] = useState("editor");
  const [activeTable, setActiveTable] = useState<Table | undefined>(undefined);
  const [schemaName, setSchemaName] = useState("Mon Schéma");
  const [schemaDescription, setSchemaDescription] = useState("Un nouveau schéma de base de données");
  const { toast } = useToast()

  useEffect(() => {
    setSchemaName(schema.name);
    setSchemaDescription(schema.description);
  }, [schema]);

  const handleApplyPreset = (preset: Schema) => {
    setSchema({
      ...preset,
      tables: preset.tables.map(table => ({
        ...table,
        id: crypto.randomUUID()
      }))
    });
    toast({
      title: "Preset appliqué",
      description: `Le preset "${preset.name}" a été chargé.`,
    })
  };

  const handleMergePresets = (presets: Schema[]) => {
    const mergedTables = presets.flatMap(preset => 
      preset.tables.map(table => ({
        ...table,
        id: crypto.randomUUID() // Generate new IDs to avoid conflicts
      }))
    );

    const updatedSchema = {
      ...schema,
      name: `Schéma fusionné (${presets.map(p => p.name).join(' + ')})`,
      description: `Schéma créé par fusion de: ${presets.map(p => p.name).join(', ')}`,
      tables: [...schema.tables, ...mergedTables]
    };

    setSchema(updatedSchema);
    toast({
      title: "Presets fusionnés",
      description: `${mergedTables.length} tables ajoutées depuis ${presets.length} presets.`,
    });
  };

  const handleSchemaNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchemaName(e.target.value);
  };

  const handleSchemaDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchemaDescription(e.target.value);
  };

  const handleUpdateSchemaMeta = () => {
    setSchema({
      ...schema,
      name: schemaName,
      description: schemaDescription
    });
    toast({
      title: "Méta mis à jour",
      description: "Nom et description du schéma mis à jour.",
    })
  };

  const handleAddTable = () => {
    const newTable: Table = {
      id: crypto.randomUUID(),
      name: "Nouvelle Table",
      description: "Description de la nouvelle table",
      category: "Général",
      fields: []
    };
    setSchema({
      ...schema,
      tables: [...schema.tables, newTable]
    });
    setActiveTable(newTable);
    toast({
      title: "Table ajoutée",
      description: `La table "${newTable.name}" a été ajoutée au schéma.`,
    })
  };

  const handleUpdateTable = (updatedTable: Table) => {
    setSchema({
      ...schema,
      tables: schema.tables.map(table =>
        table.id === updatedTable.id ? updatedTable : table
      )
    });
    setActiveTable(updatedTable);
    toast({
      title: "Table mise à jour",
      description: `La table "${updatedTable.name}" a été modifiée.`,
    })
  };

  const handleDeleteTable = (tableToDelete: Table) => {
    setSchema({
      ...schema,
      tables: schema.tables.filter(table => table.id !== tableToDelete.id)
    });
    setActiveTable(undefined);
    toast({
      title: "Table supprimée",
      description: `La table "${tableToDelete.name}" a été supprimée.`,
    })
  };

  const handleDuplicateTable = (tableToDuplicate: Table) => {
    const duplicatedTable: Table = {
      ...tableToDuplicate,
      id: crypto.randomUUID(),
      name: `${tableToDuplicate.name} (copie)`
    };
    setSchema({
      ...schema,
      tables: [...schema.tables, duplicatedTable]
    });
    setActiveTable(duplicatedTable);
    toast({
      title: "Table dupliquée",
      description: `La table "${duplicatedTable.name}" a été dupliquée.`,
    })
  };

  const handleAddField = (table: Table) => {
    const newField: Field = {
      name: "nouveau_champ",
      type_general: "string",
      type_sql: "VARCHAR(255)",
      required: false,
      unique: false,
      primary_key: false,
      description: "Description du nouveau champ",
      example_value: "exemple",
      slug_compatible: false,
      acf_field_type: "text",
      ui_component: "input"
    };
    const updatedTable = {
      ...table,
      fields: [...table.fields, newField]
    };
    handleUpdateTable(updatedTable);
    toast({
      title: "Champ ajouté",
      description: `Le champ "${newField.name}" a été ajouté à la table "${table.name}".`,
    })
  };

  const handleExportSchema = () => {
    const jsonString = JSON.stringify(schema, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${schema.name.replace(/ /g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Schéma exporté",
      description: "Le schéma a été exporté au format JSON.",
    })
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2))
      .then(() => {
        toast({
          title: "Schéma copié",
          description: "Le schéma a été copié dans le presse-papier.",
        })
      })
      .catch(err => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le schéma.",
          variant: "destructive"
        })
        console.error("Erreur lors de la copie du schéma :", err);
      });
  };

  const handleImportSchema = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Aucun fichier sélectionné",
        description: "Veuillez sélectionner un fichier JSON.",
        variant: "destructive"
      })
      return;
    }

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      try {
        const jsonString = event.target?.result as string;
        const importedSchema = JSON.parse(jsonString);
        setSchema(importedSchema);
        toast({
          title: "Schéma importé",
          description: `Le schéma "${importedSchema.name}" a été importé.`,
        })
      } catch (error) {
        toast({
          title: "Erreur d'importation",
          description: "Impossible d'importer le schéma. Vérifiez le format JSON.",
          variant: "destructive"
        })
        console.error("Erreur lors de l'importation du schéma :", error);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-800">
              Esquisse de Schéma
            </h1>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopySchema}>
              <Copy className="h-4 w-4 mr-2" />
              Copier
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSchema}>
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Input
              type="file"
              id="import-schema"
              className="hidden"
              accept=".json"
              onChange={handleImportSchema}
            />
            <Label htmlFor="import-schema" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted h-9 px-4 py-2 bg-slate-100 border border-slate-200">
              Importer
            </Label>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">Éditeur</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="ai">Assistant IA</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="space-y-6">
            <div className="md:flex md:space-x-6">
              <div className="w-full md:w-1/2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Table: {activeTable?.name || 'Aucune table sélectionnée'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activeTable ? (
                      <SchemaEditor
                        table={activeTable}
                        onUpdateTable={handleUpdateTable}
                        onDeleteTable={handleDeleteTable}
                        onDuplicateTable={handleDuplicateTable}
                        onAddField={() => handleAddField(activeTable)}
                      />
                    ) : (
                      <p className="text-sm text-slate-500">
                        Sélectionnez une table pour la modifier ou créez-en une nouvelle.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="w-full md:w-1/2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Schéma: {schema.name}
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                      Gérez les tables et la structure globale de votre schéma.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {schema.tables.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        Aucune table dans le schéma. Ajoutez une table pour commencer.
                      </p>
                    ) : (
                      <ul className="list-none space-y-2">
                        {schema.tables.map(table => (
                          <li
                            key={table.id}
                            className={`px-4 py-2 rounded-md cursor-pointer hover:bg-slate-100 ${activeTable?.id === table.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700'}`}
                            onClick={() => setActiveTable(table)}
                          >
                            {table.name} ({table.fields.length} champs)
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button onClick={handleAddTable} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une table
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-6">
            <SchemaPresets 
              onApplyPreset={handleApplyPreset}
              onMergePresets={handleMergePresets}
            />
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <GeminiIntegration
              schema={schema}
              activeTable={activeTable}
              onSchemaUpdate={setSchema}
              onTableUpdate={handleUpdateTable}
            />
          </TabsContent>

          <TabsContent value="config" className="space-y-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuration du Schéma
                </CardTitle>
                <p className="text-sm text-slate-500">
                  Personnalisez les informations générales de votre schéma.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="schema-name">Nom du Schéma</Label>
                  <Input
                    type="text"
                    id="schema-name"
                    value={schemaName}
                    onChange={handleSchemaNameChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="schema-description">Description du Schéma</Label>
                  <Textarea
                    id="schema-description"
                    value={schemaDescription}
                    onChange={handleSchemaDescriptionChange}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleUpdateSchemaMeta}>
                  Mettre à jour
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
