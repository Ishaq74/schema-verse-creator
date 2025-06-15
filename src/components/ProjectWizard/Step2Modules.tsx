
import React from "react";
import { moduleCatalogue, BaseModule } from "@/modules/catalogue";
import { Button } from "@/components/ui/button";

interface ModuleChoice extends BaseModule {
  preview: string;
  nbTables: number;
}

interface Step2ModulesProps {
  selected: string[];
  setSelected: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}
const AVAILABLE_MODULES: ModuleChoice[] = [
  ...moduleCatalogue.map(m => ({
    ...m,
    preview: m.example || "",
    nbTables: m.id === "blog"
      ? 3
      : m.id === "ecommerce"
        ? 5
        : m.id === "gallery"
          ? 2
          : 1,
  })),
  {
    id: "blog",
    name: "Blog (Articles, Catégories, Commentaires, Tags)",
    description:
      "Blog complet : gestion posts, catégories, comments liés aux users, tags pour SEO.",
    preview: "3 tables (posts, catégories, commentaires)",
    nbTables: 3,
  },
  {
    id: "ecommerce",
    name: "E-commerce (Boutique, Panier, Paiement)",
    description:
      "Gestion boutique, produits, commandes, clients, paniers, paiement intégré.",
    preview: "5 tables (produits, commandes, paiements, paniers, clients)",
    nbTables: 5,
  },
  {
    id: "gallery",
    name: "Galerie Média",
    description: "Gérer des albums de photos ou vidéos, uploader, annoter.",
    preview: "2 tables (albums, fichiers)",
    nbTables: 2,
  },
  // Ajoute d'autres briques ici !
];

export default function Step2Modules({
  selected,
  setSelected,
  onBack,
  onNext,
}: Step2ModulesProps) {
  const toggle = (id: string, required?: boolean) => {
    if (required) return;
    // Fix: Create the new array directly and pass it.
    if (selected.includes(id)) {
      setSelected(selected.filter(d => d !== id));
    } else {
      setSelected([...selected, id]);
    }
  };
  return (
    <div>
      <div className="mb-2 text-slate-600">
        Sélectionne les modules “briques” de ton projet.<br />
        <span className="text-xs">Certains modules sont requis et déjà cochés.</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {AVAILABLE_MODULES.map(mod => (
          <div
            key={mod.id}
            className={`relative flex items-center gap-3 border px-4 py-3 rounded-lg group transition-all shadow-sm
            ${selected.includes(mod.id) ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-slate-50"}
            `}
            onClick={() => toggle(mod.id, mod.required)}
          >
            <input
              type="checkbox"
              checked={selected.includes(mod.id)}
              disabled={mod.required}
              onChange={() => toggle(mod.id, mod.required)}
              className="accent-blue-600"
            />
            <div>
              <div className="font-semibold flex items-center gap-2">
                {mod.name}
                {mod.required && (
                  <span className="text-xxs bg-blue-200 text-blue-700 ml-2 px-2 py-0.5 rounded-full">Obligatoire</span>
                )}
              </div>
              <div className="text-xs text-slate-600">{mod.description}</div>
              <div className="text-xs text-slate-400">{mod.preview} {mod.nbTables > 1 ? `• ${mod.nbTables} tables` : null}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-5">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button onClick={onNext} disabled={selected.length === 0}>Suite</Button>
      </div>
    </div>
  );
}
