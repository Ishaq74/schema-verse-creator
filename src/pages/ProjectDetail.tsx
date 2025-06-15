import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Network, Download } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import { ProjectSchemaEditorModal } from "@/components/ProjectSchemaEditorModal";

// Plus de mockProjects ici

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useProjects();

  // Chercher le projet correspondant :
  const project = projects.find(p => p.id === id);

  const [showSchemaEditor, setShowSchemaEditor] = React.useState(false);

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
          <div className="flex flex-col md:flex-row justify-between mt-6 gap-2">
            <div className="flex gap-2 mb-2 md:mb-0">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Retour
              </Button>
              <Button variant="secondary" onClick={() => setShowSchemaEditor(true)}>
                Éditer le schéma / modules
              </Button>
            </div>
            <div className="flex gap-2 justify-end">
              {/* Placeholders for other actions */}
              <Button variant="ghost" className="border" title="Mindmap">
                <Network className="w-4 h-4 mr-2" />
                Générer la mindmap
              </Button>
              <Button variant="ghost" className="border" title="Exporter">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {showSchemaEditor && (
        <ProjectSchemaEditorModal
          open={showSchemaEditor}
          onClose={() => setShowSchemaEditor(false)}
          project={project}
        />
      )}
    </div>
  );
}
