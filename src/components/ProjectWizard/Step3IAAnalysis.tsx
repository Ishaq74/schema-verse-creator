
import React, { useState } from "react";
import { Schema, Table } from "@/types/schema";
import { GeminiIntegration } from "@/components/GeminiIntegration";
import { Button } from "@/components/ui/button";

interface Step3IAAnalysisProps {
  selectedModules: string[];
  schema: Schema;
  onBack: () => void;
  onNext: () => void;
  onUpdateSchema: (schema: Schema) => void;
  onUpdateTable: (table: Table) => void;
}

export default function Step3IAAnalysis({
  selectedModules,
  schema,
  onBack,
  onNext,
  onUpdateSchema,
  onUpdateTable,
}: Step3IAAnalysisProps) {
  const [activeTableIndex, setActiveTableIndex] = useState(0);

  const handlePrevTable = () => {
    setActiveTableIndex(idx => Math.max(idx - 1, 0));
  };

  const handleNextTable = () => {
    setActiveTableIndex(idx => Math.min(idx + 1, schema.tables.length - 1));
  };

  const currentTable = schema.tables[activeTableIndex] || null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          disabled={activeTableIndex === 0}
          onClick={handlePrevTable}
        >
          ◀ Précédent
        </Button>
        <div className="flex-1 text-center">
          <span className="inline-block rounded bg-blue-50 text-blue-700 px-3 py-1 font-mono">
            {currentTable ? `${activeTableIndex + 1} / ${schema.tables.length} : ${currentTable.name}` : "Aucune table"}
          </span>
        </div>
        <Button
          variant="outline"
          disabled={activeTableIndex === schema.tables.length - 1}
          onClick={handleNextTable}
        >
          Suivant ▶
        </Button>
      </div>
      <GeminiIntegration
        schema={schema}
        activeTable={currentTable}
        onSchemaUpdate={onUpdateSchema}
        onTableUpdate={onUpdateTable}
      />
      <div className="flex items-center gap-3 justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onNext}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
