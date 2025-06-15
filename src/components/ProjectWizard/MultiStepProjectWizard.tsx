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
  const { addProject } = useProjects();
  const navigate = useNavigate();

  // Helper : génère le schéma réel à partir des modules sélectionnés
  function buildSchemaFromModules(selectedModuleIds: string[]): Schema {
    let tables: Table[] = [];
    selectedModuleIds.forEach(moduleId => {
      if (baseModulesSchema[moduleId]) {
        tables = [...tables, ...baseModulesSchema[moduleId]];
      }
      // autres modules custom ou à enrichir plus tard
    });
    return {
      tables,
      name: "Project Schema",
      description: "Schéma auto-généré à partir des modules sélectionnés.",
      version: "1.0",
    };
  }

  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);

  const handleExport = () => {
    // Sauvegarde le projet. La vraie génération/export serait faite ici.
    addProject({
      id: crypto.randomUUID(),
      name,
      description: description || need,
      modules: selectedModules.map(id => ({
        id,
        name: id, // Pour la vraie UI, nommage friendly à récupérer
        description: "",
        tables: [],
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
        {step === 2 && (
          <Step3IAAnalysis
            selectedModules={selectedModules}
            onBack={goBack}
            onNext={goNext}
          />
        )}
        {step === 3 && (
          <Step4Mindmap
            selectedModuleIds={selectedModules}
            onBack={goBack}
            onNext={goNext}
          />
        )}
        {step === 4 && (
          <Step5Export
            onBack={goBack}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
}
