
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import { Project } from "@/types/project";

// Temp: simple in-memory store, amélioré plus tard !
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Mon Site Vitrine",
    description: "Site vitrine pour PME locale avec blog.",
    modules: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "SAAS Gestion",
    description: "Plateforme SaaS (Users, Organisations, Factures).",
    modules: [],
    createdAt: new Date().toISOString(),
  },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Chercher le projet correspondant :
  const project = mockProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold mb-4">Projet introuvable</h2>
        <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-600" />
            {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-slate-700">{project.description}</div>
          <div className="mb-4 text-xs text-slate-400">Créé le {new Date(project.createdAt).toLocaleDateString()}</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Modules du projet</h3>
            {project.modules && project.modules.length > 0 ? (
              <ul className="list-disc ml-6">
                {project.modules.map((mod) => (
                  <li key={mod.id} className="mb-1">
                    <b>{mod.name}</b>
                    {mod.description ? <> – <span className="text-xs text-slate-500">{mod.description}</span></> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-500">Aucun module associé (sera complété plus tard lors de la création IA).</div>
            )}
          </div>
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => navigate(-1)}>Retour</Button>
            {/* (Futur) Bouton : Générer la mindmap, Exporter, etc. */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
