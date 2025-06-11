
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Field } from '@/types/schema';

interface FieldEditorProps {
  field: Field;
  onUpdate: (field: Field) => void;
}

export const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate }) => {
  const updateField = (key: keyof Field, value: any) => {
    onUpdate({ ...field, [key]: value });
  };

  const typeOptions = [
    { value: 'string', label: 'String', sql: 'VARCHAR(255)' },
    { value: 'text', label: 'Text', sql: 'TEXT' },
    { value: 'int', label: 'Integer', sql: 'INTEGER' },
    { value: 'float', label: 'Float', sql: 'DECIMAL(10,2)' },
    { value: 'bool', label: 'Boolean', sql: 'BOOLEAN' },
    { value: 'datetime', label: 'DateTime', sql: 'TIMESTAMP WITH TIME ZONE' },
    { value: 'uuid', label: 'UUID', sql: 'UUID' },
    { value: 'enum', label: 'Enum', sql: 'VARCHAR(50)' },
    { value: 'relation', label: 'Relation', sql: 'UUID' },
    { value: 'image', label: 'Image', sql: 'VARCHAR(500)' },
    { value: 'json', label: 'JSON', sql: 'JSONB' }
  ];

  const acfFieldTypes = [
    'text', 'textarea', 'number', 'email', 'url', 'password',
    'select', 'checkbox', 'radio', 'true_false', 'date_picker',
    'color_picker', 'image', 'file', 'relationship', 'post_object'
  ];

  const uiComponents = [
    'input', 'textarea', 'select', 'datepicker', 'toggle', 'relation-picker', 'image-picker'
  ];

  const indexTypes = ['none', 'BTree', 'GIN', 'GIST'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 p-4 bg-white rounded-lg border">
      {/* Informations de base */}
      <div className="space-y-4">
        <h5 className="font-semibold text-slate-700 border-b pb-2">Informations de base</h5>
        
        <div>
          <Label htmlFor="field-name">Nom du champ *</Label>
          <Input
            id="field-name"
            value={field.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="user_id, email, title..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="field-type">Type général *</Label>
          <Select value={field.type_general} onValueChange={(value) => {
            updateField('type_general', value);
            const typeOption = typeOptions.find(t => t.value === value);
            if (typeOption) {
              updateField('type_sql', typeOption.sql);
            }
          }}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="field-sql-type">Type SQL</Label>
          <Input
            id="field-sql-type"
            value={field.type_sql}
            onChange={(e) => updateField('type_sql', e.target.value)}
            placeholder="VARCHAR(255), INTEGER NOT NULL..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="field-default">Valeur par défaut SQL</Label>
          <Input
            id="field-default"
            value={field.default_sql || ''}
            onChange={(e) => updateField('default_sql', e.target.value)}
            placeholder="NULL, now(), uuid_generate_v4()..."
            className="mt-1"
          />
        </div>
      </div>

      {/* Contraintes et propriétés */}
      <div className="space-y-4">
        <h5 className="font-semibold text-slate-700 border-b pb-2">Contraintes</h5>

        <div className="flex items-center justify-between">
          <Label htmlFor="required">Champ requis</Label>
          <Switch
            id="required"
            checked={field.required}
            onCheckedChange={(checked) => updateField('required', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="unique">Unique</Label>
          <Switch
            id="unique"
            checked={field.unique}
            onCheckedChange={(checked) => updateField('unique', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="primary-key">Clé primaire</Label>
          <Switch
            id="primary-key"
            checked={field.primary_key}
            onCheckedChange={(checked) => updateField('primary_key', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="slug-compatible">Compatible slug</Label>
          <Switch
            id="slug-compatible"
            checked={field.slug_compatible}
            onCheckedChange={(checked) => updateField('slug_compatible', checked)}
          />
        </div>

        <div>
          <Label htmlFor="foreign-key">Clé étrangère</Label>
          <Input
            id="foreign-key"
            value={field.foreign_key || ''}
            onChange={(e) => updateField('foreign_key', e.target.value)}
            placeholder="users(id), categories(id)..."
            className="mt-1"
          />
        </div>

        {field.type_general === 'relation' && (
          <div>
            <Label htmlFor="cardinality">Cardinalité</Label>
            <Select value={field.relation_cardinality || '1-N'} onValueChange={(value) => updateField('relation_cardinality', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-1">1-1 (Un à un)</SelectItem>
                <SelectItem value="1-N">1-N (Un à plusieurs)</SelectItem>
                <SelectItem value="N-N">N-N (Plusieurs à plusieurs)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {field.type_general === 'enum' && (
          <div>
            <Label htmlFor="enum-values">Valeurs enum (séparées par virgules)</Label>
            <Input
              id="enum-values"
              value={field.enum_values?.join(', ') || ''}
              onChange={(e) => updateField('enum_values', e.target.value.split(',').map(v => v.trim()))}
              placeholder="draft, published, archived"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Documentation et métadonnées */}
      <div className="space-y-4">
        <h5 className="font-semibold text-slate-700 border-b pb-2">Documentation</h5>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={field.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Description claire du champ..."
            className="mt-1"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="example">Exemple de valeur</Label>
          <Input
            id="example"
            value={field.example_value}
            onChange={(e) => updateField('example_value', e.target.value)}
            placeholder="jean.dupont@example.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">Catégorie</Label>
          <Input
            id="category"
            value={field.category || ''}
            onChange={(e) => updateField('category', e.target.value)}
            placeholder="Identité, Métadonnées..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="acf-type">Type ACF WordPress</Label>
          <Select value={field.acf_field_type} onValueChange={(value) => updateField('acf_field_type', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {acfFieldTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ui-component">Composant UI</Label>
          <Select value={field.ui_component} onValueChange={(value) => updateField('ui_component', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {uiComponents.map(component => (
                <SelectItem key={component} value={component}>
                  {component}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="index-type">Type d'index</Label>
          <Select value={field.index || 'none'} onValueChange={(value) => updateField('index', value === 'none' ? undefined : value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Aucun index" />
            </SelectTrigger>
            <SelectContent>
              {indexTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type === 'none' ? 'Aucun index' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="supabase-policy">Politique Supabase</Label>
          <Input
            id="supabase-policy"
            value={field.supabase_policy || ''}
            onChange={(e) => updateField('supabase_policy', e.target.value)}
            placeholder="auth.uid() = user_id"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes techniques</Label>
          <Textarea
            id="notes"
            value={field.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Contraintes particulières..."
            className="mt-1"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};
