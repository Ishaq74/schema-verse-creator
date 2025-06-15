import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectContext";
import { Project, Module, Field } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Table } from "@/types/schema";
import { X, Plus, Trash2, Check } from "lucide-react";
import FieldEditorRow from "./FieldEditorRow";

interface ProjectSchemaEditorModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectSchemaEditorModal: React.FC<ProjectSchemaEditorModalProps> = ({
  open,
  onClose,
  project,
}) => {
  const { updateProject } = useProjects();
  const [modules, setModules] = useState<Module[]>(project.modules ?? []);
  const [tables, setTables] = useState<Table[]>(project.schema.tables ?? []);
  const [isEditingModule, setIsEditingModule] = useState<string | null>(null);
  const [isEditingTable, setIsEditingTable] = useState<string | null>(null);
  const [editedModule, setEditedModule] = useState<Partial<Module>>({});
  const [editedTable, setEditedTable] = useState<Partial<Table>>({});
  const [editingFieldsTableId, setEditingFieldsTableId] = useState<string | null>(null);
  const [fieldDrafts, setFieldDrafts] = useState<{ [tableId: string]: Field[] }>({});
  const [saving, setSaving] = useState(false);

  // Handle module edition
  const handleEditModule = (mod: Module) => {
    setIsEditingModule(mod.id);
    setEditedModule(mod);
  };

  const handleModuleField = (field: keyof Module, value: string) => {
    setEditedModule({ ...editedModule, [field]: value });
  };

  const handleModuleSave = () => {
    setModules(ms =>
      ms.map(m =>
        m.id === isEditingModule ? { ...(m as Module), ...editedModule, id: m.id, tables: m.tables ?? [] } : m
      )
    );
    setIsEditingModule(null);
    setEditedModule({});
  };

  const handleModuleDelete = (id: string) => {
    setModules(ms => ms.filter(m => m.id !== id));
  };

  const handleModuleAdd = () => {
    const newMod: Module = {
      id: "mod-" + Date.now(),
      name: "",
      description: "",
      tables: [],
    };
    setModules([...modules, newMod]);
    setIsEditingModule(newMod.id);
    setEditedModule(newMod);
  };

  // Handle tables edition
  const handleEditTable = (tb: Table) => {
    setIsEditingTable(tb.id);
    setEditedTable(tb);
  };

  const handleTableField = (field: keyof Table, value: string) => {
    setEditedTable({ ...editedTable, [field]: value });
  };

  const handleTableSave = () => {
    setTables(ts =>
      ts.map(t =>
        t.id === isEditingTable ? { ...(t as Table), ...editedTable, id: t.id, fields: t.fields ?? [] } : t
      )
    );
    setIsEditingTable(null);
    setEditedTable({});
  };

  const handleTableDelete = (id: string) => {
    setTables(ts => ts.filter(t => t.id !== id));
  };

  const handleTableAdd = () => {
    const newTable: Table = {
      id: "tb-" + Date.now(),
      name: "",
      description: "",
      fields: [],
    };
    setTables([...tables, newTable]);
    setIsEditingTable(newTable.id);
    setEditedTable(newTable);
  };

  // Champs/fields handling
  const handleEditFields = (table: Table) => {
    setEditingFieldsTableId(table.id);
    setFieldDrafts(d => ({
      ...d,
      [table.id]: table.fields.length > 0
        ? table.fields.map(f => ({ ...f }))
        : [{
            name: "",
            type_general: "string",
            type_sql: "",
            required: false,
            unique: false,
            primary_key: false,
            description: "",
            example_value: "",
            slug_compatible: false,
            acf_field_type: "",
            ui_component: "input"
          }]
    }));
  };

  const handleFieldChange = (idx: number, field: Field) => {
    if (!editingFieldsTableId) return;
    setFieldDrafts(d => ({
      ...d,
      [editingFieldsTableId]: d[editingFieldsTableId].map((f, i) => (i === idx ? field : f))
    }));
  };

  const handleFieldAdd = () => {
    if (!editingFieldsTableId) return;
    setFieldDrafts(d => ({
      ...d,
      [editingFieldsTableId]: [
        ...(d[editingFieldsTableId] || []),
        {
          name: "",
          type_general: "string",
          type_sql: "",
          required: false,
          unique: false,
          primary_key: false,
          description: "",
          example_value: "",
          slug_compatible: false,
          acf_field_type: "",
          ui_component: "input"
        }
      ]
    }));
  };

  const handleFieldDelete = (idx: number) => {
    if (!editingFieldsTableId) return;
    setFieldDrafts(d => ({
      ...d,
      [editingFieldsTableId]: d[editingFieldsTableId].filter((_, i) => i !== idx)
    }));
  };

  const handleFieldsSave = () => {
    if (!editingFieldsTableId) return;
    setTables(ts =>
      ts.map(t =>
        t.id === editingFieldsTableId
          ? { ...t, fields: fieldDrafts[editingFieldsTableId] }
          : t
      )
    );
    setEditingFieldsTableId(null);
  };

  // Sauvegarder modifications du projet
  const handleSaveAll = () => {
    setSaving(true);
    updateProject(project.id, {
      ...project,
      modules: modules.map(m => ({
        ...m,
        tables: m.tables ?? [],
      })),
      schema: {
        ...project.schema,
        tables: tables.map(tb => ({
          ...tb,
          fields: tb.fields ?? [],
        })),
      },
      updatedAt: new Date().toISOString(),
    });
    setTimeout(() => {
      setSaving(false);
      onClose();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Édition schéma & modules</DialogTitle>
          <DialogDescription>
            Tu peux gérer modules, tables <b>et champs</b> de ce projet.
            <br />
            <span className="text-xs text-slate-400">
              MVP : édition complète des champs de tables, ergonomie simple.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="my-3">
          <div className="font-semibold mb-1 flex items-center justify-between">
            <span>Modules :</span>
            <Button variant="outline" size="sm" onClick={handleModuleAdd} title="Ajouter module">
              <Plus className="w-4 h-4 mr-1" /> Ajouter
            </Button>
          </div>
          {modules.length > 0 ? (
            <ul className="mb-4">
              {modules.map((mod) =>
                isEditingModule === mod.id ? (
                  <li key={mod.id} className="flex gap-2 items-center py-1">
                    <input
                      className="border px-2 rounded text-sm w-28"
                      placeholder="Nom"
                      value={editedModule.name ?? ""}
                      onChange={e => handleModuleField("name", e.target.value)}
                    />
                    <input
                      className="border px-2 rounded text-xs w-44"
                      placeholder="Description"
                      value={editedModule.description ?? ""}
                      onChange={e => handleModuleField("description", e.target.value)}
                    />
                    <Button onClick={handleModuleSave} size="icon" variant="ghost"><Check className="w-4 h-4" /></Button>
                  </li>
                ) : (
                  <li key={mod.id} className="flex gap-2 items-center py-1">
                    <Badge variant="secondary">{mod.name || <span className="opacity-50 italic">[Sans nom]</span>}</Badge>
                    <span className="text-xs text-slate-500">{mod.description}</span>
                    <Button onClick={() => handleEditModule(mod)} size="icon" variant="ghost" title="Éditer">
                      ✎
                    </Button>
                    <Button onClick={() => handleModuleDelete(mod.id)} size="icon" variant="destructive" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </li>
                )
              )}
            </ul>
          ) : (
            <div className="text-xs text-slate-400 mb-4">Aucun module associé.</div>
          )}

          {/* Tables et édition des champs */}
          <div className="font-semibold mb-1 flex items-center justify-between">
            <span>Tables du schéma :</span>
            <Button variant="outline" size="sm" onClick={handleTableAdd} title="Ajouter table">
              <Plus className="w-4 h-4 mr-1" /> Ajouter
            </Button>
          </div>
          {tables.length > 0 ? (
            <ul>
              {tables.map((tb) =>
                isEditingTable === tb.id ? (
                  <li key={tb.id} className="flex gap-2 items-center py-1">
                    <input
                      className="border px-2 rounded text-sm w-28"
                      placeholder="Nom"
                      value={editedTable.name ?? ""}
                      onChange={e => handleTableField("name", e.target.value)}
                    />
                    <input
                      className="border px-2 rounded text-xs w-44"
                      placeholder="Description"
                      value={editedTable.description ?? ""}
                      onChange={e => handleTableField("description", e.target.value)}
                    />
                    <Button onClick={handleTableSave} size="icon" variant="ghost"><Check className="w-4 h-4" /></Button>
                  </li>
                ) : (
                  <li key={tb.id} className="flex flex-col gap-1 mb-2 py-1 border-b pb-2">
                    <div className="flex gap-2 items-center">
                      <Badge className="bg-blue-100 text-blue-700">{tb.name || <span className="opacity-50 italic">[Sans nom]</span>}</Badge>
                      <span className="text-xs text-slate-500">{tb.description}</span>
                      <Button onClick={() => handleEditTable(tb)} size="icon" variant="ghost" title="Éditer">
                        ✎
                      </Button>
                      <Button onClick={() => handleTableDelete(tb.id)} size="icon" variant="destructive" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleEditFields(tb)} size="sm" variant="outline" title="Éditer champs">
                        🧩 Champs
                      </Button>
                    </div>

                    {/* Editeur des champs */}
                    {editingFieldsTableId === tb.id && (
                      <div className="bg-gray-50 mt-2 mb-1 p-3 rounded border">
                        <div className="font-semibold mb-2 flex items-center gap-3">
                          Champs de la table &laquo; {tb.name} &raquo;
                          <Button size="xs" onClick={handleFieldAdd} variant="outline">
                            <Plus className="w-4 h-4" /> Ajouter champ
                          </Button>
                        </div>
                        <div>
                          {(fieldDrafts[tb.id] || []).map((field, i) => (
                            <FieldEditorRow
                              key={i}
                              value={field}
                              onChange={f => handleFieldChange(i, f)}
                              onDelete={() => handleFieldDelete(i)}
                            />
                          ))}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={handleFieldsSave} variant="secondary">
                            <Check className="w-4 h-4 mr-1" /> Valider les champs
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingFieldsTableId(null)}>
                            Annuler
                          </Button>
                        </div>
                      </div>
                    )}
                  </li>
                )
              )}
            </ul>
          ) : (
            <div className="text-xs text-slate-400 mb-2">Aucune table définie pour ce projet.</div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSaveAll} disabled={saving}>
            <Check className="w-4 h-4 mr-1" />
            Sauvegarder
          </Button>
          <DialogClose asChild>
            <Button variant="outline">
              <X className="w-4 h-4 mr-1" />
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
