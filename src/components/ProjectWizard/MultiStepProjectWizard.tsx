import React, { useState } from "react";
import Step1Identity from "./Step1Identity";
import Step2Modules from "./Step2Modules";
import Step3IAAnalysis from "./Step3IAAnalysis";
import Step4Mindmap from "./Step4Mindmap";
import Step5Export from "./Step5Export";
import { useProjects } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { baseModulesSchema } from "@/modules/baseModulesSchema";
import { Schema, Table } from "@/types/schema";

const STEPS = [
  "Identité",
  "Briques/Modules",
  "Analyse IA",
  "Visualisation",
  "Export",
];

export default function MultiStepProjectWizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [need, setNeed] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>(["base-identity", "users-advanced"]);
  const [schema, setSchema] = useState<Schema | null>(null); // Schéma réel calculé
  const { addProject } = useProjects();
  const navigate = useNavigate();

  // Génère le schéma réel à partir des modules sélectionnés
  function buildSchemaFromModules(selectedModuleIds: string[]): Schema {
    let tables: Table[] = [];
    selectedModuleIds.forEach(moduleId => {
      if (baseModulesSchema[moduleId]) {
        tables = [...tables, ...baseModulesSchema[moduleId]];
      }
      // Ajout d’autres modules custom ou à enrichir plus tard
    });
    // Enlève les doublons de table (même id)
    const uniqueTables = tables.filter((tb, idx, arr) => arr.findIndex(t => t.id === tb.id) === idx);
    return {
      tables: uniqueTables,
      name: name || "Project Schema",
      description: description || need || "Schéma généré à partir des modules.",
      version: "1.0",
    };
  }

  // Mise à jour du schéma à chaque changement de modules ou métadonnées
  React.useEffect(() => {
    setSchema(buildSchemaFromModules(selectedModules));
  }, [selectedModules, name, description, need]);

  // Cette fonction met à jour UNE table dans le schéma courant
  function handleTableUpdate(updatedTable: Table) {
    if (!schema) return;
    setSchema({
      ...schema,
      tables: schema.tables.map(t => t.id === updatedTable.id ? updatedTable : t)
    });
  }

  // Cette fonction met à jour tout le schéma (suite suggestion IA)
  function handleSchemaUpdate(newSchema: Schema) {
    setSchema(newSchema);
  }

  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);

  const handleExport = () => {
    if (!schema) return;
    addProject({
      id: crypto.randomUUID(),
      name,
      description: description || need,
      modules: selectedModules.map(id => ({
        id,
        name: id,
        description: "",
        tables: [],
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schema, // Enregistre le vrai schéma dans le projet
    });
    navigate("/");
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="mb-6 flex items-center gap-2 justify-center">
        {STEPS.map((label, idx) => (
          <React.Fragment key={label}>
            <div
              className={`rounded-full w-7 h-7 flex items-center justify-center border-2 text-sm font-semibold
                          ${step === idx ? "bg-blue-500 text-white border-blue-500" : "border-blue-300 text-blue-700 bg-blue-100"}
            `}
            >
              {idx + 1}
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-8 h-1 rounded ${idx < step ? "bg-blue-500" : "bg-blue-200"}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="bg-white border rounded-lg shadow p-6">
        {step === 0 && (
          <Step1Identity
            name={name}
            description={description}
            logo={logo}
            need={need}
            setName={setName}
            setDescription={setDescription}
            setLogo={setLogo}
            setNeed={setNeed}
            onNext={goNext}
          />
        )}
        {step === 1 && (
          <Step2Modules
            selected={selectedModules}
            setSelected={setSelectedModules}
            onBack={goBack}
            onNext={goNext}
          />
        )}
        {step === 2 && schema && (
          <Step3IAAnalysis
            selectedModules={selectedModules}
            schema={schema}
            onBack={goBack}
            onNext={goNext}
            onUpdateSchema={handleSchemaUpdate}
            onUpdateTable={handleTableUpdate}
          />
        )}
        {step === 3 && (
          <Step4Mindmap
            selectedModuleIds={selectedModules}
            onBack={goBack}
            onNext={goNext}
          />
        )}
        {step === 4 && schema && (
          <Step5Export
            onBack={goBack}
            onExport={handleExport}
            schema={schema}
          />
        )}
      </div>
    </div>
  );
}
