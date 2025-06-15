
import React, { createContext, useContext, useState } from "react";
import { Project } from "@/types/project";

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Mon Site Vitrine",
    description: "Site vitrine pour PME locale avec blog.",
    modules: [],
    createdAt: new Date().toISOString(),
    schema: {
      tables: [],
      name: "Schéma vide",
      description: "Schéma initial par défaut",
      version: "1.0",
    },
  },
  {
    id: "2",
    name: "SAAS Gestion",
    description: "Plateforme SaaS (Users, Organisations, Factures).",
    modules: [],
    createdAt: new Date().toISOString(),
    schema: {
      tables: [],
      name: "Schéma vide",
      description: "Schéma initial par défaut",
      version: "1.0",
    },
  },
];

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error("useProjects must be used within ProjectProvider");
  return context;
};
