
import React from "react";
import { Field } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FieldEditorRowProps {
  value: Field;
  onChange: (newField: Field) => void;
  onDelete: () => void;
}

const FIELD_TYPES: Field["type_general"][] = [
  "string", "text", "int", "float", "bool", "datetime", "enum", "relation", "image", "uuid", "json"
];

export default function FieldEditorRow({ value, onChange, onDelete }: FieldEditorRowProps) {
  return (
    <div className="flex gap-2 items-center mb-1">
      <input
        className="border px-2 rounded text-xs w-24"
        placeholder="Nom"
        value={value.name}
        onChange={e => onChange({ ...value, name: e.target.value })}
      />
      <select
        className="border px-1 rounded text-xs w-20"
        value={value.type_general || "string"}
        onChange={e => onChange({ ...value, type_general: e.target.value as Field["type_general"] })}
      >
        {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <input
        className="border px-2 rounded text-xs w-20"
        placeholder="Type SQL"
        value={value.type_sql}
        onChange={e => onChange({ ...value, type_sql: e.target.value })}
      />
      <input
        className="border px-2 rounded text-xs w-12"
        type="checkbox"
        checked={value.required}
        title="Requis"
        onChange={e => onChange({ ...value, required: e.target.checked })}
      />
      <input
        className="border px-2 rounded text-xs w-20"
        placeholder="Défaut SQL"
        value={value.default_sql || ""}
        onChange={e => onChange({ ...value, default_sql: e.target.value })}
      />
      <input
        className="border px-2 rounded text-xs w-28"
        placeholder="Description"
        value={value.description}
        onChange={e => onChange({ ...value, description: e.target.value })}
      />
      <Button
        size="icon"
        variant="ghost"
        title="Supprimer ce champ"
        onClick={onDelete}
      ><X className="h-4 w-4" /></Button>
    </div>
  );
}
