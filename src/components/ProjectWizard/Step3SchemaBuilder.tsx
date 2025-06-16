
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Schema, Table, Field } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';
import SchemaBuilderToolbar from './SchemaBuilderToolbar';
import SchemaTableList from './SchemaTableList';
import SchemaPreview from './SchemaPreview';
import AISchemaGenerator from './AISchemaGenerator';
import { TableEditor } from '@/components/TableEditor';

interface Step3SchemaBuilderProps {
  selectedModules: string[];
  schema: Schema;
  onBack: () => void;
  onNext: () => void;
  onUpdateSchema: (schema: Schema) => void;
}

export default function Step3SchemaBuilder({
  selectedModules,
  schema,
  onBack,
  onNext,
  onUpdateSchema
}: Step3SchemaBuilderProps) {
  const [mode, setMode] = useState<'builder' | 'preview'>('builder');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const totalFields = schema.tables.reduce((acc, table) => acc + table.fields.length, 0);

  const handleAddTable = () => {
    const newTable: Table = {
      id: crypto.randomUUID(),
      name: `table_${schema.tables.length + 1}`,
      description: 'Nouvelle table',
      category: 'Général',
      fields: []
    };
    
    onUpdateSchema({
      ...schema,
      tables: [...schema.tables, newTable]
    });
    
    setEditingTable(newTable);
    toast({
      title: "Table créée",
      description: `La table "${newTable.name}" a été ajoutée.`
    });
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
  };

  const handleUpdateTable = (updatedTable: Table) => {
    onUpdateSchema({
      ...schema,
      tables: schema.tables.map(t => t.id === updatedTable.id ? updatedTable : t)
    });
    setEditingTable(null);
    setSelectedTable(updatedTable);
    
    toast({
      title: "Table mise à jour",
      description: `La table "${updatedTable.name}" a été modifiée.`
    });
  };

  const handleDuplicateTable = (table: Table) => {
    const duplicatedTable: Table = {
      ...table,
      id: crypto.randomUUID(),
      name: `${table.name}_copy`,
      description: `Copie de ${table.description}`
    };
    
    onUpdateSchema({
      ...schema,
      tables: [...schema.tables, duplicatedTable]
    });
    
    toast({
      title: "Table dupliquée",
      description: `La table "${duplicatedTable.name}" a été créée.`
    });
  };

  const handleDeleteTable = (tableId: string) => {
    const tableToDelete = schema.tables.find(t => t.id === tableId);
    onUpdateSchema({
      ...schema,
      tables: schema.tables.filter(t => t.id !== tableId)
    });
    
    if (selectedTable?.id === tableId) {
      setSelectedTable(null);
    }
    
    toast({
      title: "Table supprimée",
      description: `La table "${tableToDelete?.name}" a été supprimée.`
    });
  };

  const handleGenerateAI = (generatedSchema: Schema) => {
    onUpdateSchema({
      ...schema,
      tables: [...schema.tables, ...generatedSchema.tables]
    });
    setShowAIGenerator(false);
    
    toast({
      title: "Schéma généré",
      description: `${generatedSchema.tables.length} table(s) ont été ajoutées.`
    });
  };

  const handleImportSchema = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSchema = JSON.parse(e.target?.result as string);
          onUpdateSchema(importedSchema);
          toast({
            title: "Schéma importé",
            description: `${importedSchema.tables.length} table(s) importée(s).`
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
    input.click();
  };

  const handleExportSchema = () => {
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
      description: "Le fichier JSON a été téléchargé."
    });
  };

  const handleGenerateSQL = () => {
    toast({
      title: "Génération SQL",
      description: "Fonctionnalité disponible à l'étape suivante."
    });
  };

  const handleExportDiagram = () => {
    toast({
      title: "Export de diagramme",
      description: "Fonctionnalité en cours de développement."
    });
  };

  return (
    <div className="space-y-6">
      <SchemaBuilderToolbar
        mode={mode}
        setMode={setMode}
        onAddTable={handleAddTable}
        onImportSchema={handleImportSchema}
        onExportSchema={handleExportSchema}
        onGenerateFromDescription={() => setShowAIGenerator(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tableCount={schema.tables.length}
        fieldCount={totalFields}
      />

      {mode === 'builder' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <SchemaTableList
                  tables={schema.tables}
                  selectedTableId={selectedTable?.id || null}
                  onSelectTable={setSelectedTable}
                  onEditTable={handleEditTable}
                  onDuplicateTable={handleDuplicateTable}
                  onDeleteTable={handleDeleteTable}
                  searchTerm={searchTerm}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedTable ? (
              <TableEditor
                table={selectedTable}
                onUpdate={handleUpdateTable}
                onDelete={() => handleDeleteTable(selectedTable.id)}
                onGenerateArtifacts={() => {}}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-slate-500">
                    <p className="mb-4">Sélectionnez une table pour l'éditer</p>
                    <Button onClick={handleAddTable}>
                      Créer votre première table
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <SchemaPreview
          schema={schema}
          onGenerateSQL={handleGenerateSQL}
          onExportDiagram={handleExportDiagram}
        />
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          onClick={onNext}
          disabled={schema.tables.length === 0}
        >
          Étape suivante
        </Button>
      </div>

      {/* Dialog pour l'édition de table */}
      <Dialog open={!!editingTable} onOpenChange={() => setEditingTable(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Édition de la table : {editingTable?.name}
            </DialogTitle>
          </DialogHeader>
          {editingTable && (
            <TableEditor
              table={editingTable}
              onUpdate={handleUpdateTable}
              onDelete={() => {
                handleDeleteTable(editingTable.id);
                setEditingTable(null);
              }}
              onGenerateArtifacts={() => {}}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog pour la génération IA */}
      <Dialog open={showAIGenerator} onOpenChange={setShowAIGenerator}>
        <DialogContent className="max-w-4xl">
          <AISchemaGenerator
            onGenerate={handleGenerateAI}
            onClose={() => setShowAIGenerator(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
