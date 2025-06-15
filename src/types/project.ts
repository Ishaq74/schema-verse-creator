
import type { Schema } from "@/types/schema";

export interface Module {
  id: string;
  name: string;
  description: string;
  tables: string[]; // Ids des tables concernées
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  createdAt: string;
  updatedAt?: string;
  schema: Schema; // <-- added this line to fix the error
}
