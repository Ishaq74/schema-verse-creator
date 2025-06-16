
import React, { useState } from "react";
import Step1Identity from "./Step1Identity";
import Step2Modules from "./Step2Modules";
import Step3SchemaBuilder from "./Step3SchemaBuilder";
import Step4Relations from "./Step4Relations";
import Step5Generation from "./Step5Generation";
import { useProjects } from "@/contexts/ProjectContext";
import { useNavigate } from "react-router-dom";
import { baseModulesSchema } from "@/modules/baseModulesSchema";
import { Schema, Table } from "@/types/schema";

const STEPS = [
  "Identité",
  "Modules",
  "Construction",
  "Relations",
  "Génération",
];

export default function MultiStepProjectWizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [need, setNeed] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>(["base-identity", "users-advanced"]);
  const [schema, setSchema] = useState<Schema | null>(null);
  const { addProject } = useProjects();
  const navigate = useNavigate();

  // Génère le schéma réel à partir des modules sélectionnés
  function buildSchemaFromModules(selectedModuleIds: string[]): Schema {
    let tables: Table[] = [];
    selectedModuleIds.forEach(moduleId => {
      if (baseModulesSchema[moduleId]) {
        tables = [...tables, ...baseModulesSchema[moduleId]];
      }
    });
    // Enlève les doublons de table (même id)
    const uniqueTables = tables.filter((tb, idx, arr) => arr.findIndex(t => t.id === tb.id) === idx);
    return {
      tables: uniqueTables,
      name: name || "Nouveau Projet",
      description: description || need || "Schéma généré automatiquement.",
      version: "1.0",
    };
  }

  // Mise à jour du schéma à chaque changement de modules ou métadonnées
  React.useEffect(() => {
    setSchema(buildSchemaFromModules(selectedModules));
  }, [selectedModules, name, description, need]);

  // Cette fonction met à jour UNE table dans le schéma courant
  function handleTableUpdate(updatedTable: Table) {
    if (!schema) return;
    setSchema({
      ...schema,
      tables: schema.tables.map(t => t.id === updatedTable.id ? updatedTable : t)
    });
  }

  // Cette fonction met à jour tout le schéma
  function handleSchemaUpdate(newSchema: Schema) {
    setSchema(newSchema);
  }

  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);

  const handleFinish = () => {
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
      schema,
    });
    navigate("/dashboard");
  };

  const progressPercentage = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Header avec progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-slate-900">Créer un Nouveau Projet</h1>
          <div className="text-sm text-slate-600">
            Étape {step + 1} sur {STEPS.length}
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Indicateurs d'étapes */}
        <div className="flex justify-between items-center">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`rounded-full w-8 h-8 flex items-center justify-center border-2 text-sm font-semibold transition-colors ${
                  step >= idx 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "border-slate-300 text-slate-400 bg-white"
                }`}
              >
                {idx + 1}
              </div>
              <span className={`text-xs mt-1 ${step >= idx ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contenu des étapes */}
      <div className="bg-white border rounded-lg shadow-sm p-8">
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
          <Step3SchemaBuilder
            selectedModules={selectedModules}
            schema={schema}
            onBack={goBack}
            onNext={goNext}
            onUpdateSchema={handleSchemaUpdate}
          />
        )}
        {step === 3 && schema && (
          <Step4Relations
            schema={schema}
            onBack={goBack}
            onNext={goNext}
            onUpdateSchema={handleSchemaUpdate}
          />
        )}
        {step === 4 && schema && (
          <Step5Generation
            schema={schema}
            onBack={goBack}
            onFinish={handleFinish}
          />
        )}
      </div>
    </div>
  );
}
