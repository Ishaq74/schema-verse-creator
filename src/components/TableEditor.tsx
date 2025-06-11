
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Database, FileCode, Download } from 'lucide-react';
import { Table, Field } from '@/types/schema';
import { FieldEditor } from './FieldEditor';

interface TableEditorProps {
  table: Table;
  onUpdate: (table: Table) => void;
  onDelete: () => void;
  onGenerateArtifacts: (table: Table) => void;
}

export const TableEditor: React.FC<TableEditorProps> = ({
  table,
  onUpdate,
  onDelete,
  onGenerateArtifacts
}) => {
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);

  const addField = () => {
    const newField: Field = {
      name: '',
      type_general: 'string',
      type_sql: 'VARCHAR(255)',
      required: false,
      unique: false,
      primary_key: false,
      description: '',
      example_value: '',
      slug_compatible: false,
      acf_field_type: 'text',
      ui_component: 'input'
    };

    onUpdate({
      ...table,
      fields: [...table.fields, newField]
    });
    setActiveFieldIndex(table.fields.length);
  };

  const updateField = (index: number, field: Field) => {
    const newFields = [...table.fields];
    newFields[index] = field;
    onUpdate({
      ...table,
      fields: newFields
    });
  };

  const deleteField = (index: number) => {
    const newFields = table.fields.filter((_, i) => i !== index);
    onUpdate({
      ...table,
      fields: newFields
    });
    if (activeFieldIndex === index) {
      setActiveFieldIndex(null);
    }
  };

  const updateTableInfo = (field: string, value: string) => {
    onUpdate({
      ...table,
      [field]: value
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-xl font-semibold text-slate-800">
              {table.name || 'Nouvelle Table'}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {table.fields.length} champs
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => onGenerateArtifacts(table)}
              className="bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <FileCode className="h-4 w-4 mr-2" />
              Générer
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <Tabs defaultValue="definition" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="definition">Définition</TabsTrigger>
            <TabsTrigger value="fields">Champs ({table.fields.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="definition" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="table-name">Nom de la table *</Label>
                <Input
                  id="table-name"
                  value={table.name}
                  onChange={(e) => updateTableInfo('name', e.target.value)}
                  placeholder="users, articles, products..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="table-category">Catégorie</Label>
                <Input
                  id="table-category"
                  value={table.category || ''}
                  onChange={(e) => updateTableInfo('category', e.target.value)}
                  placeholder="Auth, Content, E-commerce..."
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="table-description">Description</Label>
              <Textarea
                id="table-description"
                value={table.description}
                onChange={(e) => updateTableInfo('description', e.target.value)}
                placeholder="Description détaillée de la table et de son usage..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="table-notes">Notes techniques</Label>
              <Textarea
                id="table-notes"
                value={table.notes || ''}
                onChange={(e) => updateTableInfo('notes', e.target.value)}
                placeholder="Contraintes particulières, recommandations..."
                className="mt-1"
                rows={2}
              />
            </div>
          </TabsContent>

          <TabsContent value="fields" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Champs de la table</h3>
              <Button onClick={addField} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un champ
              </Button>
            </div>

            <div className="space-y-4">
              {table.fields.map((field, index) => (
                <div key={index} className="border rounded-lg p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-slate-800">
                        {field.name || `Champ ${index + 1}`}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {field.type_general}
                      </Badge>
                      {field.primary_key && (
                        <Badge className="text-xs bg-yellow-100 text-yellow-800">PK</Badge>
                      )}
                      {field.required && (
                        <Badge className="text-xs bg-red-100 text-red-800">Requis</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveFieldIndex(activeFieldIndex === index ? null : index)}
                      >
                        {activeFieldIndex === index ? 'Fermer' : 'Éditer'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteField(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {activeFieldIndex === index && (
                    <FieldEditor
                      field={field}
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                    />
                  )}
                </div>
              ))}

              {table.fields.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <Database className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Aucun champ défini. Commencez par ajouter un champ.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
