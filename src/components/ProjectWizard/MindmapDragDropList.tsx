
import React from "react";

// Ce composant est "générique" : il permet de réordonner (drag&drop) ET d’ajouter/supprimer des éléments.
// Il fonctionne à tous niveaux : modules, tables, champs.
interface Item {
  id: string;
  name: string;
}

interface MindmapDragDropListProps<T extends Item> {
  items: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  onMove: (from: number, to: number) => void; // réordonner via drag
  onAdd?: (name: string) => void;
  onDelete?: (id: string) => void;
  addLabel?: string;
  canDelete?: boolean;
}

export default function MindmapDragDropList<T extends Item>({
  items,
  renderItem,
  onMove,
  onAdd,
  onDelete,
  addLabel,
  canDelete = true,
}: MindmapDragDropListProps<T>) {
  // drag & drop simpliste avec HTML5 drag — si tu veux une meilleure UX, DND-Kit ou React-Beautiful-DND
  const [draggedIdx, setDraggedIdx] = React.useState<number | null>(null);
  const [newName, setNewName] = React.useState<string>("");

  function handleDrop(idx: number) {
    if (draggedIdx !== null && draggedIdx !== idx) onMove(draggedIdx, idx);
    setDraggedIdx(null);
  }

  return (
    <div>
      <ul>
        {items.map((item, idx) => (
          <li
            key={item.id}
            draggable
            onDragStart={() => setDraggedIdx(idx)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(idx)}
            className={"mb-2 group bg-white hover:bg-blue-50 border rounded px-2 py-1 flex items-center justify-between transition " + (draggedIdx === idx ? "opacity-50" : "")}
            style={{ cursor: "grab" }}
          >
            <span className="flex-1">{renderItem(item, idx)}</span>
            {canDelete && onDelete && (
              <button
                className="ml-2 text-xs text-red-500 hover:underline opacity-60 group-hover:opacity-100"
                title="Supprimer"
                onClick={() => onDelete(item.id)}
                type="button"
              >
                ✖
              </button>
            )}
            <span className="text-gray-300 text-xs ml-2 cursor-move hidden group-hover:inline" title="Glisser pour changer l'ordre">⠿</span>
          </li>
        ))}
      </ul>
      {onAdd && (
        <form
          className="flex gap-2 my-2"
          onSubmit={e => {
            e.preventDefault();
            if (!newName.trim()) return;
            onAdd(newName.trim());
            setNewName("");
          }}
        >
          <input
            className="border px-2 rounded text-xs flex-1"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder={addLabel || "Ajouter…"}
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white rounded px-2 text-xs" type="submit">
            Ajouter
          </button>
        </form>
      )}
    </div>
  );
}
