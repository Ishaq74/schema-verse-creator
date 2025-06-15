
import React from "react";
// ➔ Pour la vraie version, remplacer par une vraie mindmap interactive (lib externe)
interface MindmapPreviewProps {
  modules: { id: string; name: string }[];
}
export default function MindmapPreview({ modules }: MindmapPreviewProps) {
  return (
    <div className="my-5">
      <div className="font-medium mb-2">Schéma des modules sélectionnés</div>
      <div className="flex flex-wrap gap-5">
        {modules.map((mod, idx) => (
          <div
            key={mod.id}
            className="rounded-lg border bg-white px-5 py-3 shadow hover:bg-blue-50 transition"
          >
            <div className="text-lg font-semibold">{mod.name}</div>
            <div className="text-xs text-slate-400">Id : {mod.id}</div>
            {/* On peut ajouter ici les relations plus tard */}
            {idx < modules.length - 1 && (
              <span className="mx-2">→</span>
            )}
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-500 mt-2 italic">
        (Mindmap MVP - Interactif à venir)
      </div>
    </div>
  );
}
