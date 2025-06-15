
export interface BaseModule {
  id: string;
  name: string;
  description: string;
  required?: boolean;
  example?: string;
}

export const moduleCatalogue: BaseModule[] = [
  {
    id: "base-identity",
    name: "Identité du site",
    description: "Nom, slogan, logo, et éléments de branding essentiels.",
    required: true,
  },
  {
    id: "organization",
    name: "Organisation",
    description: "Gestion des organisations, équipes, rôles/permissions.",
  },
  {
    id: "users-advanced",
    name: "Utilisateurs Avancé",
    description: "Gestion des comptes, profils, rôles, droits, sécurité avancée.",
    required: true,
  },
  {
    id: "design",
    name: "Design & Thème",
    description: "Personnalisation de l’apparence, couleurs, logo, design token.",
  },
  // Ajoute ici d'autres modules standards et futurs modules spéciaux
];
