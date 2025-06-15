
import React from "react";
import { Button } from "@/components/ui/button";
import { GeminiService } from "@/services/GeminiService";
import { toast } from "@/hooks/use-toast";
import { Table, Schema } from "@/types/schema";

interface MindmapToolbarProps {
  schema: Schema;
  onGlobalEnhance: () => void;
  onValidate: () => void;
  onExport: (format: "json" | "csv" | "yaml" | "xml" | "markdown") => void;
  loading: boolean;
}

export default function MindmapToolbar({
  schema,
  onGlobalEnhance,
  onValidate,
  onExport,
  loading,
}: MindmapToolbarProps) {
  return (
    <aside className="w-full md:w-48 flex md:flex-col flex-row gap-2 md:gap-4 p-2 bg-gradient-to-tl from-blue-50 to-slate-50 border-r rounded-lg mb-4">
      <Button
        size="sm"
        variant="default"
        onClick={onGlobalEnhance}
        disabled={loading}
        className="mb-1"
      >
        🔥 Améliorer Schéma (IA)
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onValidate}
        disabled={loading}
        className="mb-1"
      >
        🧑‍⚖️ Valider Schéma (Expert)
      </Button>
      <Button size="sm" variant="outline" onClick={() => onExport("json")}>
        Exporter JSON
      </Button>
      <Button size="sm" variant="outline" onClick={() => onExport("csv")}>
        Exporter CSV
      </Button>
      <Button size="sm" variant="outline" onClick={() => onExport("yaml")}>
        Exporter YAML
      </Button>
      <Button size="sm" variant="outline" onClick={() => onExport("xml")}>
        Exporter XML
      </Button>
      <Button size="sm" variant="secondary" onClick={() => onExport("markdown")}>
        Documentation Markdown (IA)
      </Button>
    </aside>
  );
}
