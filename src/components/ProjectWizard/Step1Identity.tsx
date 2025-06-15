
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Step1IdentityProps {
  name: string;
  description: string;
  logo?: File | null;
  need: string;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  setNeed: (v: string) => void;
  setLogo: (v: File | null) => void;
  onNext: () => void;
}

export default function Step1Identity({
  name,
  description,
  logo,
  need,
  setName,
  setDescription,
  setNeed,
  setLogo,
  onNext,
}: Step1IdentityProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        onNext();
      }}
    >
      <div>
        <label className="block font-medium mb-1">Nom du site/projet *</label>
        <Input
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Ex : My Awesome App"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Description du projet</label>
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Blog pro, vitrine PME, SaaS RH, ... "
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Besoin/Métier</label>
        <Input
          value={need}
          onChange={e => setNeed(e.target.value)}
          placeholder="Ex : Blog tech, vitrine PME, e-commerce, gestion interne..."
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Logo (facultatif)</label>
        <Input
          type="file"
          accept="image/*"
          onChange={e => setLogo(e.target.files?.[0] || null)}
        />
        {logo && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(logo)}
              alt="Logo"
              className="h-16 w-16 rounded object-contain shadow"
            />
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <Button type="submit">Suivant</Button>
      </div>
    </form>
  );
}
