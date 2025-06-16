
import React, { useState } from "react";
import { Schema, Table, Field } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Database, Table as TableIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
  onUpdateSchema,
}: Step3SchemaBuilderProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [newTableName, setNewTableName] = useState("");
  const [showAddTable, setShowAddTable] = useState(false);

  const handleAddTable = () => {
    if (!newTableName.trim()) return;
    
    const newTable: Table = {
      id: `table_${Date.now()}`,
      name: newTableName,
      description: "",
      fields: [
        {
          name: "id",
          type_general: "number",
          type_sql: "INTEGER PRIMARY KEY AUTOINCREMENT",
          required: true,
          unique: true,
          primary_key: true,
          description: "Identifiant unique",
          example_value: "1",
          slug_compatible: false,
          acf_field_type: "number",
          ui_component: "input"
        }
      ]
    };

    onUpdateSchema({
      ...schema,
      tables: [...schema.tables, newTable]
    });
    
    setNewTableName("");
    setShowAddTable(false);
    toast({ title: "Table créée", description: `La table ${newTableName} a été ajoutée.` });
  };

  const handleDeleteTable = (tableId: string) => {
    onUpdateSchema({
      ...schema,
      tables: schema.tables.filter(t => t.id !== tableId)
    });
    if (selectedTable === tableId) setSelectedTable(null);
    toast({ title: "Table supprimée", variant: "destructive" });
  };

  const handleEditTable = (table: Table) => {
    setEditingTable({ ...table });
  };

  const handleSaveTable = () => {
    if (!editingTable) return;
    
    onUpdateSchema({
      ...schema,
      tables: schema.tables.map(t => t.id === editingTable.id ? editingTable : t)
    });
    
    setEditingTable(null);
    toast({ title: "Table mise à jour", description: "Les modifications ont été sauvegardées." });
  };

  const handleAddField = (tableId: string) => {
    const newField: Field = {
      name: "nouveau_champ",
      type_general: "string",
      type_sql: "VARCHAR(255)",
      required: false,
      unique: false,
      primary_key: false,
      description: "",
      example_value: "",
      slug_compatible: false,
      acf_field_type: "input",
      ui_component: "input"
    };

    if (editingTable && editingTable.id === tableId) {
      setEditingTable({
        ...editingTable,
        fields: [...editingTable.fields, newField]
      });
    } else {
      onUpdateSchema({
        ...schema,
        tables: schema.tables.map(t => 
          t.id === tableId 
            ? { ...t, fields: [...t.fields, newField] }
            : t
        )
      });
    }
  };

  const handleDeleteField = (tableId: string, fieldIndex: number) => {
    if (editingTable && editingTable.id === tableId) {
      setEditingTable({
        ...editingTable,
        fields: editingTable.fields.filter((_, i) => i !== fieldIndex)
      });
    } else {
      onUpdateSchema({
        ...schema,
        tables: schema.tables.map(t => 
          t.id === tableId 
            ? { ...t, fields: t.fields.filter((_, i) => i !== fieldIndex) }
            : t
        )
      });
    }
  };

  const handleFieldChange = (tableId: string, fieldIndex: number, updates: Partial<Field>) => {
    if (editingTable && editingTable.id === tableId) {
      setEditingTable({
        ...editingTable,
        fields: editingTable.fields.map((field, i) => 
          i === fieldIndex ? { ...field, ...updates } : field
        )
      });
    }
  };

  const currentTable = editingTable || schema.tables.find(t => t.id === selectedTable);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Construction du Schéma</h2>
        <p className="text-slate-600">Créez et configurez vos tables de base de données</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des tables */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Tables ({schema.tables.length})
                </span>
                <Button 
                  size="sm" 
                  onClick={() => setShowAddTable(true)}
                  className="ml-2"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {showAddTable && (
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Nom de la table"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTable()}
                  />
                  <Button size="sm" onClick={handleAddTable}>Créer</Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddTable(false)}>×</Button>
                </div>
              )}
              
              {schema.tables.map((table) => (
                <div
                  key={table.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedTable === table.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedTable(table.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <TableIcon className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-medium">{table.name}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {table.fields.length} champs
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTable(table);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTable(table.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Éditeur de table */}
        <div className="lg:col-span-2">
          {currentTable ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {editingTable ? 'Édition: ' : ''}{currentTable.name}
                  </span>
                  {editingTable && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveTable}>Sauvegarder</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingTable(null)}>Annuler</Button>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingTable && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Nom de la table"
                      value={editingTable.name}
                      onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description de la table"
                      value={editingTable.description}
                      onChange={(e) => setEditingTable({ ...editingTable, description: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">Champs ({currentTable.fields.length})</h3>
                    <Button 
                      size="sm" 
                      onClick={() => handleAddField(currentTable.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Ajouter un champ
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {currentTable.fields.map((field, index) => (
                      <div key={index} className="p-3 border rounded bg-slate-50">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <Input
                            placeholder="Nom du champ"
                            value={field.name}
                            onChange={(e) => handleFieldChange(currentTable.id, index, { name: e.target.value })}
                            disabled={!editingTable}
                          />
                          <select
                            value={field.type_general}
                            onChange={(e) => handleFieldChange(currentTable.id, index, { 
                              type_general: e.target.value as any,
                              type_sql: e.target.value === 'string' ? 'VARCHAR(255)' : 
                                       e.target.value === 'number' ? 'INTEGER' :
                                       e.target.value === 'boolean' ? 'BOOLEAN' : 'TEXT'
                            })}
                            className="border rounded px-2 py-1"
                            disabled={!editingTable}
                          >
                            <option value="string">Texte</option>
                            <option value="number">Nombre</option>
                            <option value="boolean">Booléen</option>
                            <option value="date">Date</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => handleFieldChange(currentTable.id, index, { required: e.target.checked })}
                              disabled={!editingTable}
                              className="mr-1"
                            />
                            Requis
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={field.unique}
                              onChange={(e) => handleFieldChange(currentTable.id, index, { unique: e.target.checked })}
                              disabled={!editingTable}
                              className="mr-1"
                            />
                            Unique
                          </label>
                          {editingTable && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteField(currentTable.id, index)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-slate-500">
                  <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Sélectionnez une table pour l'éditer</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
    </div>
  );
}
