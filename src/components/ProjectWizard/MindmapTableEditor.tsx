
import React, { useState } from "react";
import { Table, Field } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MindmapTableEditorProps {
  table: Table;
  onSave: (tb: Table) => void;
  onCancel: () => void;
}

export default function MindmapTableEditor({ table, onSave, onCancel }: MindmapTableEditorProps) {
  const [name, setName] = useState(table.name);
  const [description, setDescription] = useState(table.description);

  return (
    <div className="bg-white border rounded shadow p-2 mb-2">
      <div className="mb-1">
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom de la table"
          className="mb-1"
        />
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <Button size="sm" variant="secondary" onClick={() => onSave({ ...table, name, description })}>
          Enregistrer
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
