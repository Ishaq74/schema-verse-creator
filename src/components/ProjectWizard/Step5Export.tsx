
import React from "react";
import { Button } from "@/components/ui/button";

interface Step5ExportProps {
  onBack: () => void;
  onExport: () => void;
}

export default function Step5Export({ onBack, onExport }: Step5ExportProps) {
  // Simule les exports disponibles
  return (
    <div>
      <div className="font-medium mb-2">Prêt !</div>
      <div className="text-slate-700 mb-3">
        Tout est prêt, tu peux maintenant générer et exporter ton schéma et ses artefacts.
      </div>
      <div className="space-y-2 mb-6">
        <div className="bg-slate-50 rounded px-4 py-2">
          <strong>Schéma SQL</strong> – Import rapide dans ta base de données.
        </div>
        <div className="bg-slate-50 rounded px-4 py-2">
          <strong>Fichier CSV</strong> – Données prêtes à l’emploi pour migration ou backup.
        </div>
        <div className="bg-slate-50 rounded px-4 py-2">
          <strong>JSON/ACF</strong> – Configuration intégration ou migration CMS.
        </div>
        <div className="bg-slate-50 rounded px-4 py-2">
          <strong>Astro Page</strong> – Génération de pages à partir du schéma généré.
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onExport}>Exporter / Terminer</Button>
      </div>
    </div>
  );
}
