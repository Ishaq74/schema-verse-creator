import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { moduleCatalogue } from "@/modules/catalogue";
import { baseModulesSchema } from "@/modules/baseModulesSchema";
import type { Table, Schema } from "@/types/schema";
import MindmapNode from "./MindmapNode";
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
}

export default function Step4Mindmap({
  selectedModuleIds,
  onBack,
  onNext,
  schema,
  onTableUpdate
}: Step4MindmapProps) {
  // Construction data mindmap enrichie
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

  // Suivi de l’analyse IA en cours pour chaque table
  const [enhancingTableId, setEnhancingTableId] = useState<string | null>(null);

  // Export (json et csv simplifié, doc markdown en bonus !)
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(schema, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema_complet.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Exporte une flatlist : Module,Table,Champ
    const lines = [["Module","Table","Champ"]];
    mindmap.forEach(mod => {
      mod.tables.forEach(tb => {
        tb.fields.forEach(f => {
          lines.push([mod.name, tb.name, f.name]);
        });
      });
    });
    const csv = lines.map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema_mindmap.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = async () => {
    if (!schema) return;
    try {
      const apiKey = GeminiService.getStoredApiKey();
      if (!apiKey) {
        toast({
          title: "API Gemini requise",
          description: "Tu dois fournir ta clé API Gemini pour la documentation markdown.",
          variant: "destructive"
        });
        return;
      }
      const gemini = new GeminiService({ apiKey });
      toast({ title: "Génération documentation", description: "Patiente…", variant: "default" });
      const md = await gemini.generateDocumentation(schema);
      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documentation_mindmap.md";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Documentation générée !", variant: "default" });
    } catch (e) {
      toast({ title: "Erreur GEMINI", description: String(e), variant: "destructive" });
    }
  };

  // Amélioration IA d’une seule table (appel Gemini + MAJ)
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

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
        <div className="flex gap-3">
          <Button size="sm" variant="default" onClick={handleExportJSON}>
            Exporter JSON Complet
          </Button>
          <Button size="sm" variant="outline" onClick={handleExportCSV}>
            Exporter Mindmap CSV
          </Button>
          <Button size="sm" variant="secondary" onClick={handleExportMarkdown}>
            Documentation Markdown (IA)
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-7 my-5">
        {mindmap.map(mod => (
          <div className="bg-gradient-to-tl from-slate-50 to-blue-50 border px-4 py-3 rounded-lg shadow w-[270px] max-w-full" key={mod.id}>
            <div className="font-bold text-blue-700">{mod.name}</div>
            <div className="text-xs mb-2 text-slate-500">Module: {mod.id}</div>
            <ul className="ml-2 pl-2 border-l-2 border-blue-200">
              {mod.tables.map(tb => (
                <li key={tb.id} className="mt-2">
                  <MindmapNode
                    table={tb}
                    moduleName={mod.name}
                    onEnhanceIA={handleEnhanceTableByIA}
                    enhancementInProgress={enhancingTableId === tb.id}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onNext}>Etape finale</Button>
      </div>
      <div className="text-xs text-center text-slate-400 mt-3">
        (Mindmap interactive, export complet, IA Gemini active sur chaque table)
      </div>
    </div>
  );
}
