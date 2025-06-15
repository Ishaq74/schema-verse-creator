
import React from "react";
import { Table } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Loader2 } from "lucide-react";

interface MindmapAllTablesContentPanelProps {
  open: boolean;
  onClose: () => void;
  tableContents: Record<string, any[]>;
  tables: Table[];
  loading: boolean;
  onContentClear: (tableId: string) => void;
  onExportAll: () => void;
}

export default function MindmapAllTablesContentPanel({
  open,
  onClose,
  tableContents,
  tables,
  loading,
  onContentClear,
  onExportAll,
}: MindmapAllTablesContentPanelProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-2 max-h-[90vh] overflow-y-auto relative border flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="font-bold text-lg text-blue-800">
            Jeux de données IA générés – toutes les tables
          </div>
          <Button size="sm" variant="ghost" onClick={onClose}>✕</Button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {tables.map(tb => (
            <div key={tb.id} className="mb-5 bg-amber-50 rounded border p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-blue-600">{tb.name}</span>
                <span className="text-xs text-slate-400">({tb.id})</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onContentClear(tb.id)}
                  disabled={loading}
                  className="ml-auto"
                  title="Effacer les exemples de cette table"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {tableContents[tb.id]?.length ? (
                <div className="max-h-40 overflow-y-auto bg-white border p-2 rounded font-mono text-xxs">
                  <pre>
                    {JSON.stringify(tableContents[tb.id].slice(0, 3), null, 2)}
                    {tableContents[tb.id].length > 3 &&
                      `\n... (+${tableContents[tb.id].length - 3} lignes)`}
                  </pre>
                </div>
              ) : (
                <div className="text-slate-400 italic">Aucune donnée IA générée pour cette table.</div>
              )}
            </div>
          ))}
        </div>
        <div className="flex px-4 py-3 border-t gap-2 justify-between items-center bg-slate-50">
          <div className="text-xs text-slate-500">{Object.values(tableContents).reduce((acc, arr) => acc + arr.length, 0)} lignes en tout</div>
          <Button onClick={onExportAll} size="sm" variant="secondary" disabled={loading || Object.values(tableContents).every(arr => !arr.length)}>
            <Download className="w-4 h-4 mr-1" /> Exporter tout (JSON)
          </Button>
        </div>
      </div>
    </div>
  );
}
