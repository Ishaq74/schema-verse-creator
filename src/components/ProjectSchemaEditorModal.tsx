
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/contexts/ProjectContext";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Table } from "@/types/schema";
import { X } from "lucide-react";

interface ProjectSchemaEditorModalProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

export const ProjectSchemaEditorModal: React.FC<ProjectSchemaEditorModalProps> = ({
  open,
  onClose,
  project,
}) => {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Édition schéma & modules du projet</DialogTitle>
          <DialogDescription>
            Visualisation rapide des modules et tables de ce projet.<br/>
            <span className="text-xs text-slate-400">Version MVP — édition avancée à venir.</span>
          </DialogDescription>
        </DialogHeader>
        <div className="my-3">
          <div className="font-semibold mb-1">Modules :</div>
          {project.modules.length > 0 ? (
            <ul className="mb-4">
              {project.modules.map((mod) => (
                <li key={mod.id} className="flex gap-2 items-center">
                  <Badge variant="secondary">{mod.name}</Badge>
                  <span className="text-xs text-slate-500">{mod.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-slate-400 mb-4">Aucun module associé.</div>
          )}

          <div className="font-semibold mb-1">Tables du schéma :</div>
          {project.schema.tables.length > 0 ? (
            <ul>
              {project.schema.tables.map((tb: Table) => (
                <li key={tb.id} className="flex gap-2 items-center">
                  <Badge className="bg-blue-100 text-blue-700">{tb.name}</Badge>
                  <span className="text-xs text-slate-500">{tb.fields.length} champs</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-slate-400 mb-2">Aucune table définie pour ce projet.</div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <X className="w-4 h-4 mr-1" />
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
