
import React, { useState } from "react";
import { Plus, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useProjects } from "@/contexts/ProjectContext";

export default function Dashboard() {
  const { projects, addProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const navigate = useNavigate();

  const handleAddProject = () => {
    if (!newProjectName) return;
    const newProj = {
      id: crypto.randomUUID(),
      name: newProjectName,
      description: newProjectDesc,
      modules: [],
      createdAt: new Date().toISOString(),
    };
    addProject(newProj);
    setNewProjectName('');
    setNewProjectDesc('');
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Mes sites & projets</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate("/project/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau site
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="hover:shadow-xl cursor-pointer"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="w-5 h-5 text-blue-600" />
                {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-slate-600 text-sm">{project.description}</div>
              <div className="text-xs text-slate-400 mt-2">Créé le {new Date(project.createdAt).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {projects.length === 0 && (
        <div className="text-center text-slate-500">
          Aucun projet. Cliquez sur <b>Nouveau site</b> pour commencer.
        </div>
      )}
    </div>
  );
}

