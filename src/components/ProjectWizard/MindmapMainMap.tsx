
import React from "react";
import MindmapDragDropList from "./MindmapDragDropList";
import MindmapNode from "./MindmapNode";
import MindmapTableEditor from "./MindmapTableEditor";
import MindmapRelations from "./MindmapRelations";
import { Button } from "@/components/ui/button";
import type { Table, Schema } from "@/types/schema";

interface MindmapMainMapProps {
  mindmap: any[];
  editingTableId: string | null;
  editingTable: Table | undefined;
  handleTableEdit: (tb: Table) => void;
  handleTableSave: (tb: Table) => void;
  handleFieldMove: (tableId: string, from: number, to: number) => void;
  handleFieldDelete: (tableId: string, fieldName: string) => void;
  handleFieldAdd: (tableId: string, name: string) => void;
  handleTableMove: (moduleIdx: number, from: number, to: number) => void;
  handleTableDelete: (moduleIdx: number, id: string) => void;
  handleTableAdd: (moduleIdx: number, name: string) => void;
  handleModulesReorder: (fromIdx: number, toIdx: number) => void;
  handleModuleRemove: (id: string) => void;
  handleModuleAdd: (name: string) => void;
  handleEnhanceTableByIA: (tb: Table) => void;
  enhancingTableId: string | null;
  schemaTables: Table[];
  onBack: () => void;
  onNext: () => void;
}

const MindmapMainMap: React.FC<MindmapMainMapProps> = ({
  mindmap,
  editingTableId,
  editingTable,
  handleTableEdit,
  handleTableSave,
  handleFieldMove,
  handleFieldDelete,
  handleFieldAdd,
  handleTableMove,
  handleTableDelete,
  handleTableAdd,
  handleModulesReorder,
  handleModuleRemove,
  handleModuleAdd,
  handleEnhanceTableByIA,
  enhancingTableId,
  schemaTables,
  onBack,
  onNext,
}) => (
  <div className="flex-1">
    <div className="flex flex-wrap justify-center gap-7 my-5">
      <MindmapDragDropList
        items={mindmap.map(m => ({ id: m.id, name: m.name }))}
        renderItem={(mod, i) => (
          <div className="bg-gradient-to-tl from-slate-50 to-blue-50 border px-4 py-3 rounded-lg shadow w-[270px] max-w-full">
            <div className="font-bold text-blue-700">{mod.name}</div>
            <div className="text-xs mb-2 text-slate-500">Module: {mod.id}</div>
            <MindmapDragDropList
              items={mindmap[i]?.tables.map(tb => ({ id: tb.id, name: tb.name }))}
              renderItem={(tb, tIdx) => {
                const tableData = mindmap[i]?.tables[tIdx];
                return (
                  <div>
                    {editingTableId === tb.id ? (
                      <MindmapTableEditor
                        table={tableData}
                        onSave={handleTableSave}
                        onCancel={() => handleTableEdit({ ...tableData, id: "" })}
                      />
                    ) : (
                      <>
                        <MindmapNode
                          table={tableData}
                          moduleName={mod.name}
                          onEnhanceIA={handleEnhanceTableByIA}
                          enhancementInProgress={enhancingTableId === tb.id}
                        />
                        <Button size="sm" className="mt-1" variant="ghost" onClick={() => handleTableEdit(tableData)}>
                          ✏️ Éditer table
                        </Button>
                        <MindmapDragDropList
                          items={tableData.fields.map(f => ({ id: f.name, name: f.name }))}
                          renderItem={(f) => (
                            <span className="inline-flex rounded px-1 py-0.5 border bg-slate-50 text-slate-700 text-xxs">{f.name}</span>
                          )}
                          onMove={(from, to) => handleFieldMove(tb.id, from, to)}
                          onDelete={(fid) => handleFieldDelete(tb.id, fid)}
                          onAdd={(fname) => handleFieldAdd(tb.id, fname)}
                          addLabel="Ajouter champ"
                        />
                      </>
                    )}
                  </div>
                );
              }}
              onMove={(from, to) => handleTableMove(i, from, to)}
              onDelete={(tid) => handleTableDelete(i, tid)}
              onAdd={(tname) => handleTableAdd(i, tname)}
              addLabel="Ajouter table"
            />
          </div>
        )}
        onMove={handleModulesReorder}
        onDelete={handleModuleRemove}
        onAdd={handleModuleAdd}
        addLabel="Ajouter module"
      />
    </div>
    <MindmapRelations tables={schemaTables} />
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={onBack}>Retour</Button>
      <Button onClick={onNext}>Etape finale</Button>
    </div>
    <div className="text-xs text-center text-slate-400 mt-3">
      (Mindmap interactive : Drag&Drop, édition/ajout/suppression multi-niveaux, toujours IA… [RELATIONS et EXPORTS CI-DESSUS])
    </div>
  </div>
);

export default MindmapMainMap;
