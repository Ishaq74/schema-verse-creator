
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Copy, Plus, Edit3 } from 'lucide-react';
import { Table, Field } from '@/types/schema';

interface SchemaEditorProps {
  table: Table;
  onUpdateTable: (table: Table) => void;
  onDeleteTable: (table: Table) => void;
  onDuplicateTable: (table: Table) => void;
  onAddField: () => void;
}

export const SchemaEditor: React.FC<SchemaEditorProps> = ({
  table,
  onUpdateTable,
  onDeleteTable,
  onDuplicateTable,
  onAddField
}) => {
  const [editingField, setEditingField] = useState<number | null>(null);

  const updateTableProperty = (property: keyof Table, value: string) => {
    onUpdateTable({
      ...table,
      [property]: value
    });
  };

  const updateField = (index: number, updatedField: Field) => {
    const newFields = [...table.fields];
    newFields[index] = updatedField;
    onUpdateTable({
      ...table,
      fields: newFields
    });
  };

  const deleteField = (index: number) => {
    const newFields = table.fields.filter((_, i) => i !== index);
    onUpdateTable({
      ...table,
      fields: newFields
    });
    setEditingField(null);
  };

  const duplicateField = (index: number) => {
    const fieldToDuplicate = table.fields[index];
    const duplicatedField: Field = {
      ...fieldToDuplicate,
      name: `${fieldToDuplicate.name}_copy`
    };
    const newFields = [...table.fields];
    newFields.splice(index + 1, 0, duplicatedField);
    onUpdateTable({
      ...table,
      fields: newFields
    });
  };

  return (
    <div className="space-y-6">
      {/* Table Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Informations de la table
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="table-name">Nom de la table</Label>
              <Input
                id="table-name"
                value={table.name}
                onChange={(e) => updateTableProperty('name', e.target.value)}
                placeholder="nom_table"
              />
            </div>
            <div>
              <Label htmlFor="table-category">Catégorie</Label>
              <Input
                id="table-category"
                value={table.category || ''}
                onChange={(e) => updateTableProperty('category', e.target.value)}
                placeholder="Authentification, Contenu..."
              />
            </div>
          </div>
          <div>
            <Label htmlFor="table-description">Description</Label>
            <Textarea
              id="table-description"
              value={table.description}
              onChange={(e) => updateTableProperty('description', e.target.value)}
              placeholder="Description de la table..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="table-notes">Notes</Label>
            <Textarea
              id="table-notes"
              value={table.notes || ''}
              onChange={(e) => updateTableProperty('notes', e.target.value)}
              placeholder="Notes techniques..."
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onDuplicateTable(table)}>
              <Copy className="h-4 w-4 mr-2" />
              Dupliquer
            </Button>
            <Button variant="destructive" onClick={() => onDeleteTable(table)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fields */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Champs ({table.fields.length})</CardTitle>
            <Button onClick={onAddField}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un champ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {table.fields.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              Aucun champ défini. Ajoutez un champ pour commencer.
            </p>
          ) : (
            <div className="space-y-4">
              {table.fields.map((field, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{field.name || `Champ ${index + 1}`}</h4>
                      <Badge variant="outline">{field.type_general}</Badge>
                      {field.primary_key && <Badge className="bg-yellow-100 text-yellow-800">PK</Badge>}
                      {field.required && <Badge className="bg-red-100 text-red-800">Requis</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField(editingField === index ? null : index)}
                      >
                        {editingField === index ? 'Fermer' : 'Éditer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicateField(index)}
                      >
                        <Copy className="h-4 w-4" />
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

                  {editingField === index && (
                    <FieldEditor
                      field={field}
                      onUpdate={(updatedField) => updateField(index, updatedField)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const FieldEditor: React.FC<{
  field: Field;
  onUpdate: (field: Field) => void;
}> = ({ field, onUpdate }) => {
  const updateFieldProperty = (property: keyof Field, value: any) => {
    onUpdate({
      ...field,
      [property]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-lg">
      <div>
        <Label htmlFor="field-name">Nom du champ</Label>
        <Input
          id="field-name"
          value={field.name}
          onChange={(e) => updateFieldProperty('name', e.target.value)}
          placeholder="nom_champ"
        />
      </div>
      <div>
        <Label htmlFor="field-type">Type général</Label>
        <Select value={field.type_general} onValueChange={(value) => updateFieldProperty('type_general', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="string">String</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="int">Integer</SelectItem>
            <SelectItem value="float">Float</SelectItem>
            <SelectItem value="bool">Boolean</SelectItem>
            <SelectItem value="datetime">DateTime</SelectItem>
            <SelectItem value="enum">Enum</SelectItem>
            <SelectItem value="relation">Relation</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="uuid">UUID</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="field-sql-type">Type SQL</Label>
        <Input
          id="field-sql-type"
          value={field.type_sql}
          onChange={(e) => updateFieldProperty('type_sql', e.target.value)}
          placeholder="VARCHAR(255)"
        />
      </div>
      <div>
        <Label htmlFor="field-ui-component">Composant UI</Label>
        <Select value={field.ui_component} onValueChange={(value) => updateFieldProperty('ui_component', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="input">Input</SelectItem>
            <SelectItem value="select">Select</SelectItem>
            <SelectItem value="datepicker">Date Picker</SelectItem>
            <SelectItem value="toggle">Toggle</SelectItem>
            <SelectItem value="textarea">Textarea</SelectItem>
            <SelectItem value="relation-picker">Relation Picker</SelectItem>
            <SelectItem value="image-picker">Image Picker</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="field-description">Description</Label>
        <Textarea
          id="field-description"
          value={field.description}
          onChange={(e) => updateFieldProperty('description', e.target.value)}
          placeholder="Description du champ..."
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="field-example">Valeur d'exemple</Label>
        <Input
          id="field-example"
          value={field.example_value}
          onChange={(e) => updateFieldProperty('example_value', e.target.value)}
          placeholder="exemple"
        />
      </div>
      <div>
        <Label htmlFor="field-foreign-key">Clé étrangère</Label>
        <Input
          id="field-foreign-key"
          value={field.foreign_key || ''}
          onChange={(e) => updateFieldProperty('foreign_key', e.target.value)}
          placeholder="table(column)"
        />
      </div>
      <div className="md:col-span-2 space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="field-required"
            checked={field.required}
            onCheckedChange={(checked) => updateFieldProperty('required', checked)}
          />
          <Label htmlFor="field-required">Requis</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="field-unique"
            checked={field.unique}
            onCheckedChange={(checked) => updateFieldProperty('unique', checked)}
          />
          <Label htmlFor="field-unique">Unique</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="field-primary-key"
            checked={field.primary_key}
            onCheckedChange={(checked) => updateFieldProperty('primary_key', checked)}
          />
          <Label htmlFor="field-primary-key">Clé primaire</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="field-slug-compatible"
            checked={field.slug_compatible}
            onCheckedChange={(checked) => updateFieldProperty('slug_compatible', checked)}
          />
          <Label htmlFor="field-slug-compatible">Compatible slug</Label>
        </div>
      </div>
    </div>
  );
};
