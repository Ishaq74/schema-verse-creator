
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Schema } from "@/types/schema";
import { ArtifactGenerator } from "@/components/ArtifactGenerator";
import { ArtifactViewer } from "@/components/ArtifactViewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Step5ExportProps {
  onBack: () => void;
  onExport: () => void;
  schema: Schema;
}

export default function Step5Export({ onBack, onExport, schema }: Step5ExportProps) {
  // Dialecte SQL sélectionné (postgres (par défaut), sqlite)
  const [dialect, setDialect] = useState<"postgres" | "sqlite">("sqlite");
  const [selectedTable, setSelectedTable] = useState(schema.tables[0]?.name || "");
  const [showViewerFor, setShowViewerFor] = useState<string | null>(null);

  // Génère tous les artefacts pour toutes les tables du schéma actuel/dialecte
  const allArtifacts = schema.tables.map(table => ({
    table,
    artifacts: ArtifactGenerator.generateAll(table, dialect),
  }));

  return (
    <div>
      <div className="font-medium mb-2">Prêt ! Voici les tables générées :</div>
      <div className="text-slate-700 mb-3">
        Visualise et exporte chaque table de ce schéma. Tu peux changer de dialecte SQL.
      </div>
      <div className="flex items-center gap-4 mb-5">
        <label className="font-semibold">Dialecte SQL:</label>
        <Tabs
          defaultValue="sqlite"
          onValueChange={val => setDialect(val as "postgres" | "sqlite")}
        >
          <TabsList>
            <TabsTrigger value="sqlite">SQLite</TabsTrigger>
            <TabsTrigger value="postgres">Postgres</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="mb-4">
        <div className="font-semibold mb-2">Tables du schéma ({schema.tables.length})</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schema.tables.map(tb => (
            <div
              key={tb.name}
              className={`border rounded-lg p-3 bg-slate-50 flex flex-col gap-1 shadow hover:bg-blue-50 transition relative`}
            >
              <div className="font-semibold text-blue-800 flex items-center gap-2">
                <Badge variant="secondary" className="text-xxs">{tb.name}</Badge>
                <span className="text-xs text-slate-500">{tb.fields.length} champs</span>
              </div>
              <div className="text-xs text-slate-600">{tb.description}</div>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowViewerFor(tb.name)}
                >
                  Explorer / exporter
                </Button>
              </div>
              {showViewerFor === tb.name && (
                <div className="fixed z-40 inset-0 flex items-center justify-center bg-black/40 p-4">
                  <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 relative">
                    <Button
                      size="icon"
                      className="absolute top-3 right-3"
                      variant="ghost"
                      onClick={() => setShowViewerFor(null)}
                    >
                      ×
                    </Button>
                    <div className="mb-3 font-semibold text-lg">{tb.name}</div>
                    <ArtifactViewer
                      artifacts={ArtifactGenerator.generateAll(tb, dialect)}
                      tableName={tb.name}
                      onClose={() => setShowViewerFor(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onExport}>Exporter / Terminer</Button>
      </div>
    </div>
  );
}
