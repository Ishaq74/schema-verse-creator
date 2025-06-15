
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { moduleCatalogue, BaseModule } from "@/modules/catalogue";

// On supprime le type redéfini ici (conflit import)
export default function NewProject() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>(
    moduleCatalogue.filter(m => m.required).map(m => m.id)
  );
  const navigate = useNavigate();

  const handleModuleToggle = (id: string) => {
    if (moduleCatalogue.find(m => m.id === id)?.required) return;
    setSelectedModules(mods =>
      mods.includes(id) ? mods.filter(mid => mid !== id) : [...mods, id]
    );
  };

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleCreate = () => {
    // TODO IN STEP 3+: sauvegarde et IA
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "Définir votre nouveau site/projet"}
            {step === 2 && "Sélectionnez les briques de base"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-6"
            >
              <div>
                <label className="block mb-1 font-medium">
                  Nom du site/projet *
                </label>
                <Input
                  required
                  placeholder="MyAwesomeApp, AgenceX, Blog Kylian..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Description (facultatif)
                </label>
                <Input
                  placeholder="PME, blog tech, ecommerce, CRM SaaS..."
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="submit">Suite</Button>
              </div>
            </form>
          )}
          {step === 2 && (
            <div>
              <div className="mb-4 text-sm text-slate-600">
                Sélectionnez les briques incontournables : l’IA complétera la structure plus tard.
              </div>
              <div className="space-y-3">
                {moduleCatalogue.map(mod => (
                  <div
                    key={mod.id}
                    className={`flex items-center gap-3 p-3 rounded border cursor-pointer ${
                      selectedModules.includes(mod.id)
                        ? "bg-blue-50 border-blue-400"
                        : "bg-slate-50 border-slate-200"
                    }`}
                    onClick={() => handleModuleToggle(mod.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(mod.id)}
                      disabled={mod.required}
                      onChange={() => handleModuleToggle(mod.id)}
                      className="accent-blue-600"
                    />
                    <div>
                      <div className="font-medium">{mod.name}</div>
                      <div className="text-xs text-slate-500">{mod.description}</div>
                      {mod.required && (
                        <span className="text-xxs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">
                          Obligatoire
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-between mt-6">
                <Button variant="outline" onClick={handleBack}>Retour</Button>
                <Button onClick={handleCreate}>Créer le projet</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
