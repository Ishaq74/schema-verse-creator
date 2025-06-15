
import React, { useState } from "react";
import { Table } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { GeminiService } from "@/services/GeminiService";
import { Download, RefreshCw, Trash2, Loader2 } from "lucide-react";

interface MindmapTableContentPanelProps {
  table: Table;
  onClose?: () => void;
}

export default function MindmapTableContentPanel({ table, onClose }: MindmapTableContentPanelProps) {
  const [content, setContent] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState(3);
  const [recordCount, setRecordCount] = useState(10);

  async function handleGenerate() {
    const apiKey = GeminiService.getStoredApiKey();
    if (!apiKey) {
      toast({
        title: "Clé API Gemini requise",
        description: "Configure ta clé Gemini pour générer le contenu.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const gemini = new GeminiService({ apiKey });
      const data = await gemini.generateSampleData({
        table,
        recordCount,
        context: `Génère des exemples réalistes pour la table "${table.name}" du site.`,
        language: "fr",
        style: "réaliste",
      });
      setContent(data.data);
      toast({
        title: "Contenu généré",
        description: `${data.data.length} exemples créés.`,
        variant: "default"
      });
    } catch (e) {
      toast({
        title: "Erreur lors la génération IA",
        description: String(e),
        variant: "destructive"
      });
    }
    setLoading(false);
  }
  function handleClear() {
    setContent(null);
  }
  function handleDownload() {
    if (!content) return;
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${table.name}_sampledata.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="border rounded bg-amber-50 mt-2 p-3 text-xs relative shadow">
      <div className="flex gap-2 items-center mb-2">
        <strong>Jeux de données IA</strong>
        <input
          type="number"
          min={1}
          max={100}
          className="border px-2 rounded text-xs w-16"
          value={recordCount}
          onChange={e => setRecordCount(Number(e.target.value) || 10)}
          title="Nombre d'exemples à générer"
          disabled={loading}
        />
        <Button size="sm" onClick={handleGenerate} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Générer
        </Button>
        <Button size="sm" variant="outline" onClick={handleClear} disabled={loading || !content}><Trash2 className="w-4 h-4" /></Button>
        <Button size="sm" variant="secondary" onClick={handleDownload} disabled={!content}><Download className="w-4 h-4" /></Button>
        {onClose && (
          <Button size="sm" variant="ghost" onClick={onClose}>✕</Button>
        )}
      </div>
      {content ? (
        <div className="max-h-40 overflow-y-auto bg-white border p-2 rounded font-mono">
          <pre className="text-xxs">
            {JSON.stringify(content.slice(0, previewCount), null, 2)}
            {content.length > previewCount && `\n... (+${content.length - previewCount} lignes)`}
          </pre>
        </div>
      ) : (
        <div className="text-slate-500">Aucune données générées pour cette table.</div>
      )}
    </div>
  );
}

