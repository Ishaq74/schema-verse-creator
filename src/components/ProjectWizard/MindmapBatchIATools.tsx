
import React from "react";
import { Button } from "@/components/ui/button";

interface MindmapBatchIAToolsProps {
  batchRecordCount: number;
  setBatchRecordCount: (n: number) => void;
  previewPerTable: number;
  setPreviewPerTable: (n: number) => void;
  loading: boolean;
  schemaTablesLength: number;
  allTableContent: Record<string, any[]>;
  handleGenerateAllContent: (regenOnlyEmpty?: boolean) => void;
  handleExportAllContentCSV: () => void;
  handleClearAllContent: () => void;
  setShowAllContentPanel: (b: boolean) => void;
  batchProgress: number;
}

const MindmapBatchIATools: React.FC<MindmapBatchIAToolsProps> = ({
  batchRecordCount,
  setBatchRecordCount,
  previewPerTable,
  setPreviewPerTable,
  loading,
  schemaTablesLength,
  allTableContent,
  handleGenerateAllContent,
  handleExportAllContentCSV,
  handleClearAllContent,
  setShowAllContentPanel,
  batchProgress,
}) => (
  <div className="flex flex-col gap-2 my-2">
    <div className="flex items-center gap-2">
      <label htmlFor="batch-recordcount" className="text-xs text-slate-600">
        Nb d'exemples / table :
      </label>
      <input
        id="batch-recordcount"
        type="number"
        min={1}
        max={100}
        className="border px-2 rounded text-xs w-16"
        value={batchRecordCount}
        onChange={e => setBatchRecordCount(Number(e.target.value) || 10)}
        disabled={loading}
        title="Nombre d'exemples à générer par table (batch)"
      />
      <Button
        size="sm"
        variant="default"
        className="my-2"
        onClick={() => handleGenerateAllContent(false)}
        disabled={loading || !schemaTablesLength}
        title="Générer du contenu IA pour toutes les tables (nouveau contenu)"
      >
        Générer tout le contenu IA
      </Button>
      <Button
        size="sm"
        variant="secondary"
        className="my-2"
        onClick={() => handleGenerateAllContent(true)}
        disabled={loading || !schemaTablesLength}
        title="Ne génère que pour les tables vides (laisse intacts les existants)"
      >
        Générer uniquement les vides
      </Button>
    </div>
    <div className="flex items-center gap-2">
      <label htmlFor="previewcount" className="text-xs text-slate-600">
        Prévisualiser&nbsp;
        <input
          id="previewcount"
          type="number"
          min={1}
          max={30}
          value={previewPerTable}
          onChange={e => setPreviewPerTable(Number(e.target.value) || 3)}
          className="border rounded px-2 text-xs w-12"
          disabled={loading}
          title="Nombre de lignes à prévisualiser dans les tableaux"
          style={{ width: 48 }}
        />{" "}
        lignes/table
      </label>
    </div>
    <div className="flex items-center gap-2">
      <Button
        onClick={() => setShowAllContentPanel(true)}
        disabled={!Object.values(allTableContent).some(arr => arr?.length)}
        size="sm"
        variant="outline"
        title="Voir le panneau de tout le contenu IA généré"
      >
        Voir contenu IA généré
      </Button>
      <Button
        onClick={handleExportAllContentCSV}
        disabled={!Object.values(allTableContent).some(arr => arr?.length)}
        size="sm"
        variant="outline"
        title="Exporter tout en CSV (ZIP)"
      >
        Exporter tout (CSV)
      </Button>
      <Button
        onClick={handleClearAllContent}
        disabled={!Object.values(allTableContent).some(arr => arr?.length)}
        size="sm"
        variant="destructive"
        title="Effacer tout le contenu IA généré"
      >
        Tout effacer
      </Button>
    </div>
    {loading && (
      <div className="w-full my-2">
        <div className="h-2 bg-slate-200 rounded">
          <div className="h-2 rounded bg-blue-500 transition-all" style={{ width: `${batchProgress}%` }} />
        </div>
        <div className="text-xs text-slate-500 text-center mt-1">{batchProgress > 0 ? `${batchProgress}%` : "Génération en cours..."}</div>
      </div>
    )}
  </div>
);

export default MindmapBatchIATools;
