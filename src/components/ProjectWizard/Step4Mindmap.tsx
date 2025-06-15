
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { moduleCatalogue } from "@/modules/catalogue";
import { baseModulesSchema } from "@/modules/baseModulesSchema";
import type { Schema } from "@/types/schema";

// Utilitaire mindmap (arbre simple)
function buildMindmapData(modules, schema) {
  return modules.map(mod => ({
    ...mod,
    tables: (baseModulesSchema[mod.id] || []).map(tb => ({
      ...tb,
      fields: schema.tables.find(t => t.id === tb.id)?.fields || [],
    })),
  }));
}

// Visuel très simple, chaque module en tant que noeud racine, ses tables reliées
function Mindmap({ mindmap }) {
  return (
    <div className="flex flex-wrap justify-center gap-7 my-5">
      {mindmap.map(mod => (
        <div className="bg-gradient-to-tl from-slate-50 to-blue-50 border px-4 py-3 rounded-lg shadow w-[270px] max-w-full" key={mod.id}>
          <div className="font-bold text-blue-700">{mod.name}</div>
          <div className="text-xs mb-2 text-slate-500">Module: {mod.id}</div>
          <ul className="ml-2 pl-2 border-l-2 border-blue-200">
            {mod.tables.map(tb => (
              <li key={tb.id} className="mt-2">
                <div className="px-2 py-1 rounded text-sm font-semibold bg-blue-100 text-blue-900">
                  {tb.name}
                </div>
                <ul className="ml-3 pl-1 border-l border-slate-200 text-xs mt-1">
                  {tb.fields.map(f => (
                    <li key={f.name} className="mb-0.5 flex items-center gap-1">
                      <span className="rounded px-1 py-0.5 bg-slate-50 border text-slate-700">{f.name}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

interface Step4MindmapProps {
  selectedModuleIds: string[];
  onBack: () => void;
  onNext: () => void;
  schema?: Schema;
}

export default function Step4Mindmap({
  selectedModuleIds,
  onBack,
  onNext,
  schema,
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

  // Export (json et csv simplifié)
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
        </div>
      </div>
      <Mindmap mindmap={mindmap} />
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onNext}>Etape finale</Button>
      </div>
      <div className="text-xs text-center text-slate-400 mt-3">
        (Mindmap enrichie, navigation et export réellement fonctionnels)
      </div>
    </div>
  );
}
