
import React, { useState } from "react";
import { Schema, Table } from "@/types/schema";
import { GeminiIntegration } from "@/components/GeminiIntegration";

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

  return (
    <div>
      <GeminiIntegration
        schema={schema}
        activeTable={schema.tables[activeTableIndex] || null}
        onSchemaUpdate={onUpdateSchema}
        onTableUpdate={onUpdateTable}
      />
      <div className="flex items-center gap-3 justify-between mt-8">
        <button
          className="px-3 py-2 bg-slate-200 rounded"
          onClick={onBack}
        >
          Retour
        </button>
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded"
          onClick={onNext}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
