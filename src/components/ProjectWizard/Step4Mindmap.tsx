
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { moduleCatalogue } from "@/modules/catalogue";
import { baseModulesSchema } from "@/modules/baseModulesSchema";
import type { Table, Schema } from "@/types/schema";
import MindmapNode from "./MindmapNode";
import MindmapToolbar from "./MindmapToolbar";
import MindmapTableEditor from "./MindmapTableEditor";
import MindmapRelations from "./MindmapRelations";
import { GeminiService } from "@/services/GeminiService";
import { toast } from "@/hooks/use-toast";

function buildMindmapData(modules, schema) {
  return modules.map(mod => ({
    ...mod,
    tables: (baseModulesSchema[mod.id] || []).map(tb => ({
      ...tb,
      fields: schema.tables.find(t => t.id === tb.id)?.fields || [],
    })),
  }));
}

interface Step4MindmapProps {
  selectedModuleIds: string[];
  onBack: () => void;
  onNext: () => void;
  schema?: Schema;
  onTableUpdate?: (tb: Table) => void;
  onSchemaUpdate?: (sch: Schema) => void;
}

export default function Step4Mindmap({
  selectedModuleIds,
  onBack,
  onNext,
  schema,
  onTableUpdate,
  onSchemaUpdate,
}: Step4MindmapProps) {
  const modules = useMemo(() => [
    ...moduleCatalogue,
    { id: "blog", name: "Blog", description: "", },
    { id: "ecommerce", name: "E-commerce", description: "", },
    { id: "gallery", name: "Galerie Média", description: "", },
  ].filter(m => selectedModuleIds.includes(m.id)), [selectedModuleIds]);

  const mindmap = useMemo(
    () => buildMindmapData(modules, schema || { tables: [], name: "", description: "", version: "" }),
    [modules, schema]
  );

  const [enhancingTableId, setEnhancingTableId] = useState<string | null>(null);
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Amélioration globale IA (toutes les tables)
  const handleGlobalEnhanceIA = async () => {
    if (!schema || !onSchemaUpdate) return;
    const apiKey = GeminiService.getStoredApiKey();
    if (!apiKey) {
      toast({ title: "Clé API Gemini requise", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const gemini = new GeminiService({ apiKey });
      toast({ title: "Génération IA", description: "Optimisation complète du schéma...", variant: "default" });
      // Pour chaque table, appliquer l’amélioration IA en parallèle
      const tablesEnhanced = await Promise.all(schema.tables.map(tb => gemini.improveTable(tb)));
      onSchemaUpdate({ ...schema, tables: tablesEnhanced });
      toast({ title: "Amélioration IA terminée", description: "Tout le schéma est enrichi.", variant: "default" });
    } catch (e) {
      toast({ title: "Erreur GEMINI", description: String(e), variant: "destructive" });
    }
    setLoading(false);
  };

  // Validation globale (analyse diagnostic)
  const handleValidate = async () => {
    if (!schema) return;
    const apiKey = GeminiService.getStoredApiKey();
    if (!apiKey) {
      toast({ title: "API Gemini requise", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const gemini = new GeminiService({ apiKey });
      const res = await gemini.validateSchema(schema);
      if (res.errors?.length) {
        toast({ title: "Erreurs détectées", description: res.errors.join(", "), variant: "destructive" });
      } else {
        toast({ title: "Schéma validé", description: "Aucune erreur critique détectée.", variant: "default" });
      }
      // On pourrait aussi faire un panneau “rapports” ici si besoin
    } catch (e) {
      toast({ title: "Erreur GEMINI", description: String(e), variant: "destructive" });
    }
    setLoading(false);
  };

  // Exports multi-formats
  const handleExport = async (format: "json" | "csv" | "yaml" | "xml" | "markdown") => {
    if (!schema) return;
    let blob: Blob, url: string, a: HTMLAnchorElement;
    switch (format) {
      case "json":
        blob = new Blob([JSON.stringify(schema, null, 2)], { type: "application/json" });
        break;
      case "csv": {
        const lines = [["Module", "Table", "Champ"]];
        mindmap.forEach(mod => {
          mod.tables.forEach(tb => {
            tb.fields.forEach(f => {
              lines.push([mod.name, tb.name, f.name]);
            });
          });
        });
        const csv = lines.map(row => row.join(",")).join("\n");
        blob = new Blob([csv], { type: "text/csv" });
        break;
      }
      case "yaml": {
        // Export YAML simple (pas de lib externe pour le show)
        function toYAML(obj: any, indent = 0): string {
          const pad = "  ".repeat(indent);
          if (Array.isArray(obj)) {
            return obj.map(el => `${pad}- ${typeof el === "object" ? toYAML(el, indent + 1).trim() : el}`).join("\n");
          } else if (typeof obj === "object" && obj !== null) {
            return Object.keys(obj).map(key =>
              typeof obj[key] === "object" ?
                `${pad}${key}:\n${toYAML(obj[key], indent + 1)}` :
                `${pad}${key}: ${obj[key]}`
            ).join("\n");
          } else {
            return `${pad}${obj}`;
          }
        }
        blob = new Blob([toYAML(schema)], { type: "text/yaml" });
        break;
      }
      case "xml": {
        // Export XML simple
        function toXML(obj: any, tag = "schema"): string {
          if (Array.isArray(obj)) {
            return obj.map(i => toXML(i, tag)).join("");
          } else if (typeof obj === "object" && obj !== null) {
            return `<${tag}>${Object.keys(obj).map(k => toXML(obj[k], k)).join("")}</${tag}>`;
          } else {
            return `<${tag}>${String(obj)}</${tag}>`;
          }
        }
        blob = new Blob([toXML(schema)], { type: "application/xml" });
        break;
      }
      case "markdown": {
        const apiKey = GeminiService.getStoredApiKey();
        if (!apiKey) {
          toast({
            title: "API Gemini requise",
            description: "Tu dois fournir ta clé API Gemini pour la documentation markdown.",
            variant: "destructive"
          });
          return;
        }
        try {
          const gemini = new GeminiService({ apiKey });
          toast({ title: "Génération documentation", description: "Patiente…", variant: "default" });
          const md = await gemini.generateDocumentation(schema);
          blob = new Blob([md], { type: "text/markdown" });
        } catch (e) {
          toast({ title: "Erreur GEMINI", description: String(e), variant: "destructive" });
          return;
        }
        break;
      }
      default: {
        toast({ title: "Format non supporté", variant: "destructive" });
        return;
      }
    }
    url = URL.createObjectURL(blob);
    a = document.createElement("a");
    a.href = url;
    a.download = `schema_export.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Export ${format.toUpperCase()} OK !`, variant: "default" });
  };

  // Amélioration IA d’une seule table
  const handleEnhanceTableByIA = async (tb: Table) => {
    const apiKey = GeminiService.getStoredApiKey();
    if (!apiKey) {
      toast({ title: "Clé API Gemini requise", description: "Configure ta clé Gemini pour la génération.", variant: "destructive" });
      return;
    }
    setEnhancingTableId(tb.id);
    try {
      const gemini = new GeminiService({ apiKey });
      const tableOptimisee = await gemini.improveTable(tb);
      if (onTableUpdate) onTableUpdate(tableOptimisee);
      toast({ title: "Table IA OK !", description: `La table ${tb.name} est enrichie.`, variant: "default" });
    } catch (e) {
      toast({ title: "Erreur GEMINI", description: String(e), variant: "destructive" });
    } finally {
      setEnhancingTableId(null);
    }
  };

  // Inline edition de table
  const handleTableEdit = (tb: Table) => {
    setEditingTableId(tb.id);
  };
  const handleTableSave = (tb: Table) => {
    setEditingTableId(null);
    if (onTableUpdate) onTableUpdate(tb);
  };

  const editingTable = schema?.tables.find(tb => tb.id === editingTableId);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Toolbar latérale */}
      <MindmapToolbar
        schema={schema!}
        onGlobalEnhance={handleGlobalEnhanceIA}
        onValidate={handleValidate}
        onExport={handleExport}
        loading={loading}
      />

      {/* Mindmap principale */}
      <div className="flex-1">
        <div className="flex flex-wrap justify-center gap-7 my-5">
          {mindmap.map(mod => (
            <div className="bg-gradient-to-tl from-slate-50 to-blue-50 border px-4 py-3 rounded-lg shadow w-[270px] max-w-full" key={mod.id}>
              <div className="font-bold text-blue-700">{mod.name}</div>
              <div className="text-xs mb-2 text-slate-500">Module: {mod.id}</div>
              <ul className="ml-2 pl-2 border-l-2 border-blue-200">
                {mod.tables.map(tb => (
                  <li key={tb.id} className="mt-2 relative">
                    {editingTableId === tb.id ? (
                      <MindmapTableEditor
                        table={tb}
                        onSave={handleTableSave}
                        onCancel={() => setEditingTableId(null)}
                      />
                    ) : (
                      <>
                        <MindmapNode
                          table={tb}
                          moduleName={mod.name}
                          onEnhanceIA={handleEnhanceTableByIA}
                          enhancementInProgress={enhancingTableId === tb.id}
                        />
                        <Button size="xs" className="mt-1" variant="ghost" onClick={() => handleTableEdit(tb)}>
                          ✏️ Éditer table
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Visualisation des relations */}
        <MindmapRelations tables={schema?.tables || []} />
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>Retour</Button>
          <Button onClick={onNext}>Etape finale</Button>
        </div>
        <div className="text-xs text-center text-slate-400 mt-3">
          (Mindmap interactive ultra-pro, export complet, IA Gemini schéma/table, validation experte, relations graphiques)
        </div>
      </div>
    </div>
  );
}

