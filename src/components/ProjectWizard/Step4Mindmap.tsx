
import React from "react";
import MindmapPreview from "./MindmapPreview";
import { Button } from "@/components/ui/button";
import { moduleCatalogue } from "@/modules/catalogue";

interface Step4MindmapProps {
  selectedModuleIds: string[];
  onBack: () => void;
  onNext: () => void;
}
export default function Step4Mindmap({
  selectedModuleIds,
  onBack,
  onNext,
}: Step4MindmapProps) {
  // Pour la démo, simple mapping
  const modules = [...moduleCatalogue,
    // Simule les modules personnalisés (blog, ecommerce...)
    {
      id: "blog",
      name: "Blog",
      description: "",
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      description: "",
    },
    {
      id: "gallery",
      name: "Galerie Média",
      description: "",
    },
  ].filter(m => selectedModuleIds.includes(m.id));
  return (
    <div>
      <MindmapPreview modules={modules} />
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onNext}>Etape finale</Button>
      </div>
    </div>
  );
}
