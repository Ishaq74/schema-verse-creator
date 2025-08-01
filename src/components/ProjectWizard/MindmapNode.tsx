import React from "react";
import { Table } from "@/types/schema";
import { Badge } from "@/components/ui/badge";
import MindmapAIEnhanceButton from "./MindmapAIEnhanceButton";
import MindmapTableContentPanel from "./MindmapTableContentPanel";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MindmapNodeProps {
  table: Table;
  moduleName: string;
  onEnhanceIA: (tb: Table) => void;
  enhancementInProgress: boolean;
}

export default function MindmapNode({ table, moduleName, onEnhanceIA, enhancementInProgress }: MindmapNodeProps) {
  const [showContentPanel, setShowContentPanel] = React.useState(false);

  return (
    <div className="border rounded-lg bg-white px-3 py-2 shadow mb-2">
      <div className="flex items-center gap-2 font-medium text-blue-800 mb-1">
        <Badge variant="outline">{table.name}</Badge>
        <span className="text-slate-400 text-xs">{moduleName}</span>
      </div>
      <div className="text-xs text-slate-600 mb-1">{table.description}</div>
      <div className="flex gap-2 flex-wrap">
        {table.fields.slice(0, 7).map(field => (
          <span key={field.name} className="inline-flex rounded px-1 py-0.5 border bg-slate-50 text-slate-700 text-xxs">{field.name}</span>
        ))}
        {table.fields.length > 7 && (
          <span className="text-xs text-slate-400">...+{table.fields.length - 7} autr.</span>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <MindmapAIEnhanceButton
          onClick={() => onEnhanceIA(table)}
          loading={enhancementInProgress}
        />
        <Button
          size="sm"
          variant="outline"
          title="Générer contenu IA pour cette table"
          onClick={() => setShowContentPanel(p => !p)}
        >
          <Database className="w-4 h-4 mr-1" /> Générer contenu IA
        </Button>
      </div>
      {showContentPanel && (
        <MindmapTableContentPanel table={table} onClose={() => setShowContentPanel(false)} />
      )}
    </div>
  );
}
