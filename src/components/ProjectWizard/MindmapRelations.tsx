
import React from "react";
import { Table } from "@/types/schema";

// Pour démo : affiche relations simples trouvées dans fields (foreign_key)
interface Props {
  tables: Table[];
}

export default function MindmapRelations({ tables }: Props) {
  // On considère foreign_key comme l’ID de la table cible
  const edges = [];
  const positions: Record<string, { x: number; y: number }> = {};
  const radius = 120;

  tables.forEach((tb, i) => {
    // Répartition en cercle
    const theta = (i / tables.length) * 2 * Math.PI;
    positions[tb.id] = {
      x: radius + radius * Math.cos(theta),
      y: radius + radius * Math.sin(theta),
    };
  });

  tables.forEach((tb) => {
    tb.fields?.forEach((f) => {
      if (f.foreign_key) {
        edges.push({
          from: tb.id,
          to: f.foreign_key,
        });
      }
    });
  });

  return (
    <svg width={2 * radius + 60} height={2 * radius + 60} className="bg-white rounded border shadow my-3 mx-auto">
      {/* Noeuds */}
      {tables.map((tb, i) => (
        <g key={tb.id}>
          <circle
            cx={positions[tb.id].x + 30}
            cy={positions[tb.id].y + 30}
            r={24}
            fill="#e0edfa"
            stroke="#428bdd"
            strokeWidth={2}
          />
          <text
            x={positions[tb.id].x + 30}
            y={positions[tb.id].y + 30}
            textAnchor="middle"
            dy="0.4em"
            fontSize={10}
            fill="#003366"
          >
            {tb.name}
          </text>
        </g>
      ))}
      {/* Arêtes */}
      {edges.map((edge, i) => (
        <line
          key={i}
          x1={positions[edge.from].x + 30}
          y1={positions[edge.from].y + 30}
          x2={positions[edge.to]?.x + 30}
          y2={positions[edge.to]?.y + 30}
          stroke={"#bebebe"}
          strokeWidth={2}
          markerEnd="url(#arrow)"
        />
      ))}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,8 L8,4 z" fill="#bebebe" />
        </marker>
      </defs>
    </svg>
  );
}
