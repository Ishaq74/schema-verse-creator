
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step3IAAnalysisProps {
  selectedModules: string[];
  onBack: () => void;
  onNext: () => void;
}

export default function Step3IAAnalysis({
  selectedModules,
  onBack,
  onNext,
}: Step3IAAnalysisProps) {
  // Simule quelques “analyses” de dépendances IA (à remplacer par l’IA plus tard)
  const suggestions = [];
  if (selectedModules.includes("blog") && !selectedModules.includes("users-advanced")) {
    suggestions.push({
      type: "error",
      message: "Le module Blog nécessite que les utilisateurs avancés soient activés.",
      fix: "users-advanced",
    });
  }
  if (selectedModules.includes("organization") && !selectedModules.includes("users-advanced")) {
    suggestions.push({
      type: "warning",
      message: "Le module Organisation fonctionne mieux avec des utilisateurs avancés.",
      fix: "users-advanced",
    });
  }
  if (selectedModules.includes("ecommerce") && !selectedModules.includes("organization")) {
    suggestions.push({
      type: "warning",
      message: "E-commerce peut demander une gestion des organisations (équipes, rôles).",
      fix: "organization",
    });
  }
  return (
    <div>
      <div className="mb-2 text-slate-700 font-medium">Analyse IA préliminaire :</div>
      {suggestions.length === 0 ? (
        <div className="bg-green-50 text-green-700 rounded py-3 px-4 flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5" /> 
          Aucun conflit détecté, tout est prêt !
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {suggestions.map((s, idx) => (
            <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded ${s.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-yellow-50 text-yellow-700"
              }`}>
              {s.type === "error" ? <AlertTriangle className="w-5 h-5" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{s.message}</span>
              {/* Pour corriger automatiquement on pourrait ici : */}
              {/* <Button size="sm" variant="default" onClick={() => addModule(s.fix)}>Corriger</Button> */}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onNext}>Continuer</Button>
      </div>
    </div>
  );
}
