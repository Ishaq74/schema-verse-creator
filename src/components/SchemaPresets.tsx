import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Database, Users, ShoppingCart, FileText, 
  MessageCircle, Calendar, Settings, Search,
  BookOpen, CreditCard, Image, Mail, X
} from 'lucide-react';
import { Schema, Table, Field } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';

interface SchemaPresetsProps {
  onApplyPreset: (schema: Schema) => void;
  selectedPresets: string[];
  onTogglePreset: (presetName: string) => void;
  allowMultiple: boolean;
}

interface PresetSchema {
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  schema: Schema;
  tags: string[];
}

export const SchemaPresets: React.FC<SchemaPresetsProps> = ({
  onApplyPreset,
  selectedPresets,
  onTogglePreset,
  allowMultiple
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const { toast } = useToast();

  // Fonction utilitaire pour créer des champs communs
  const createCommonFields = (): Field[] => [
    {
      name: 'id',
      type_general: 'uuid',
      type_sql: 'UUID PRIMARY KEY DEFAULT gen_random_uuid()',
      required: true,
      unique: true,
      primary_key: true,
      description: 'Identifiant unique',
      example_value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      slug_compatible: false,
      acf_field_type: 'text',
      ui_component: 'input'
    },
    {
      name: 'created_at',
      type_general: 'datetime',
      type_sql: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      required: true,
      unique: false,
      primary_key: false,
      description: 'Date de création',
      example_value: '2024-01-01 12:00:00',
      slug_compatible: false,
      acf_field_type: 'date_time_picker',
      ui_component: 'datepicker'
    },
    {
      name: 'updated_at',
      type_general: 'datetime',
      type_sql: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      required: true,
      unique: false,
      primary_key: false,
      description: 'Date de dernière modification',
      example_value: '2024-01-01 12:00:00',
      slug_compatible: false,
      acf_field_type: 'date_time_picker',
      ui_component: 'datepicker'
    }
  ];

  const presets: PresetSchema[] = [
    {
      name: 'Blog Complet',
      description: 'Système de blog avec articles, catégories, auteurs et commentaires',
      category: 'Contenu',
      icon: FileText,
      tags: ['blog', 'cms', 'articles', 'commentaires'],
      schema: {
        name: 'Blog Complet',
        description: 'Schéma complet pour un système de blog',
        version: '1.0.0',
        tables: [
          {
            id: crypto.randomUUID(),
            name: 'users',
            description: 'Table des utilisateurs',
            category: 'Authentification',
            fields: [
              ...createCommonFields(),
              {
                name: 'email',
                type_general: 'string',
                type_sql: 'VARCHAR(255) UNIQUE',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Adresse email unique',
                example_value: 'user@example.com',
                slug_compatible: false,
                acf_field_type: 'email',
                ui_component: 'input'
              },
              {
                name: 'name',
                type_general: 'string',
                type_sql: 'VARCHAR(100)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Nom complet',
                example_value: 'John Doe',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'bio',
                type_general: 'text',
                type_sql: 'TEXT',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Biographie de l\'auteur',
                example_value: 'Développeur passionné...',
                slug_compatible: false,
                acf_field_type: 'textarea',
                ui_component: 'textarea'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'categories',
            description: 'Catégories d\'articles',
            category: 'Contenu',
            fields: [
              ...createCommonFields(),
              {
                name: 'name',
                type_general: 'string',
                type_sql: 'VARCHAR(100) UNIQUE',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Nom de la catégorie',
                example_value: 'Technologie',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'slug',
                type_general: 'string',
                type_sql: 'VARCHAR(100) UNIQUE',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Slug URL-friendly',
                example_value: 'technologie',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'description',
                type_general: 'text',
                type_sql: 'TEXT',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Description de la catégorie',
                example_value: 'Articles sur les nouvelles technologies',
                slug_compatible: false,
                acf_field_type: 'textarea',
                ui_component: 'textarea'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'articles',
            description: 'Articles de blog',
            category: 'Contenu',
            fields: [
              ...createCommonFields(),
              {
                name: 'title',
                type_general: 'string',
                type_sql: 'VARCHAR(255)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Titre de l\'article',
                example_value: 'Mon premier article',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'slug',
                type_general: 'string',
                type_sql: 'VARCHAR(255) UNIQUE',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Slug URL-friendly',
                example_value: 'mon-premier-article',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'content',
                type_general: 'text',
                type_sql: 'LONGTEXT',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Contenu de l\'article',
                example_value: 'Contenu complet de l\'article...',
                slug_compatible: false,
                acf_field_type: 'wysiwyg',
                ui_component: 'textarea'
              },
              {
                name: 'excerpt',
                type_general: 'text',
                type_sql: 'TEXT',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Résumé de l\'article',
                example_value: 'Court résumé...',
                slug_compatible: false,
                acf_field_type: 'textarea',
                ui_component: 'textarea'
              },
              {
                name: 'author_id',
                type_general: 'relation',
                type_sql: 'UUID',
                foreign_key: 'users.id',
                relation_cardinality: 'N-1',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Auteur de l\'article',
                example_value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                slug_compatible: false,
                acf_field_type: 'relationship',
                ui_component: 'relation-picker'
              },
              {
                name: 'category_id',
                type_general: 'relation',
                type_sql: 'UUID',
                foreign_key: 'categories.id',
                relation_cardinality: 'N-1',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Catégorie de l\'article',
                example_value: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                slug_compatible: false,
                acf_field_type: 'relationship',
                ui_component: 'relation-picker'
              },
              {
                name: 'published',
                type_general: 'bool',
                type_sql: 'BOOLEAN DEFAULT FALSE',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Article publié',
                example_value: 'true',
                slug_compatible: false,
                acf_field_type: 'true_false',
                ui_component: 'toggle'
              },
              {
                name: 'featured_image',
                type_general: 'image',
                type_sql: 'VARCHAR(500)',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Image mise en avant',
                example_value: '/uploads/image.jpg',
                slug_compatible: false,
                acf_field_type: 'image',
                ui_component: 'image-picker'
              }
            ]
          }
        ]
      }
    },
    {
      name: 'E-commerce Simple',
      description: 'Boutique en ligne avec produits, commandes et clients',
      category: 'E-commerce',
      icon: ShoppingCart,
      tags: ['ecommerce', 'boutique', 'produits', 'commandes'],
      schema: {
        name: 'E-commerce Simple',
        description: 'Schéma pour une boutique en ligne',
        version: '1.0.0',
        tables: [
          {
            id: crypto.randomUUID(),
            name: 'products',
            description: 'Produits de la boutique',
            category: 'Catalogue',
            fields: [
              ...createCommonFields(),
              {
                name: 'name',
                type_general: 'string',
                type_sql: 'VARCHAR(255)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Nom du produit',
                example_value: 'T-shirt premium',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'description',
                type_general: 'text',
                type_sql: 'TEXT',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Description du produit',
                example_value: 'T-shirt en coton bio...',
                slug_compatible: false,
                acf_field_type: 'textarea',
                ui_component: 'textarea'
              },
              {
                name: 'price',
                type_general: 'float',
                type_sql: 'DECIMAL(10,2)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Prix en euros',
                example_value: '29.99',
                slug_compatible: false,
                acf_field_type: 'number',
                ui_component: 'input'
              },
              {
                name: 'stock',
                type_general: 'int',
                type_sql: 'INTEGER DEFAULT 0',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Quantité en stock',
                example_value: '100',
                slug_compatible: false,
                acf_field_type: 'number',
                ui_component: 'input'
              },
              {
                name: 'active',
                type_general: 'bool',
                type_sql: 'BOOLEAN DEFAULT TRUE',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Produit actif',
                example_value: 'true',
                slug_compatible: false,
                acf_field_type: 'true_false',
                ui_component: 'toggle'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'customers',
            description: 'Clients de la boutique',
            category: 'Clients',
            fields: [
              ...createCommonFields(),
              {
                name: 'email',
                type_general: 'string',
                type_sql: 'VARCHAR(255) UNIQUE',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Email du client',
                example_value: 'client@example.com',
                slug_compatible: false,
                acf_field_type: 'email',
                ui_component: 'input'
              },
              {
                name: 'first_name',
                type_general: 'string',
                type_sql: 'VARCHAR(100)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Prénom',
                example_value: 'John',
                slug_compatible: false,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'last_name',
                type_general: 'string',
                type_sql: 'VARCHAR(100)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Nom de famille',
                example_value: 'Doe',
                slug_compatible: false,
                acf_field_type: 'text',
                ui_component: 'input'
              }
            ]
          }
        ]
      }
    },
    {
      name: 'Authentification',
      description: 'Système d\'authentification avec utilisateurs et rôles',
      category: 'Auth',
      icon: Users,
      tags: ['auth', 'utilisateurs', 'roles', 'permissions'],
      schema: {
        name: 'Authentification',
        description: 'Système d\'authentification complet',
        version: '1.0.0',
        tables: [
          {
            id: crypto.randomUUID(),
            name: 'users',
            description: 'Utilisateurs du système',
            category: 'Authentification',
            fields: [
              ...createCommonFields(),
              {
                name: 'email',
                type_general: 'string',
                type_sql: 'VARCHAR(255) UNIQUE',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Adresse email',
                example_value: 'user@example.com',
                slug_compatible: false,
                acf_field_type: 'email',
                ui_component: 'input'
              },
              {
                name: 'password_hash',
                type_general: 'string',
                type_sql: 'VARCHAR(255)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Hash du mot de passe',
                example_value: '$2b$10$...',
                slug_compatible: false,
                acf_field_type: 'password',
                ui_component: 'input'
              },
              {
                name: 'username',
                type_general: 'string',
                type_sql: 'VARCHAR(50) UNIQUE',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Nom d\'utilisateur',
                example_value: 'johndoe',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'role',
                type_general: 'enum',
                type_sql: 'ENUM(\'admin\', \'user\', \'moderator\')',
                enum_values: ['admin', 'user', 'moderator'],
                required: true,
                unique: false,
                primary_key: false,
                description: 'Rôle de l\'utilisateur',
                example_value: 'user',
                slug_compatible: false,
                acf_field_type: 'select',
                ui_component: 'select'
              },
              {
                name: 'active',
                type_general: 'bool',
                type_sql: 'BOOLEAN DEFAULT TRUE',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Compte actif',
                example_value: 'true',
                slug_compatible: false,
                acf_field_type: 'true_false',
                ui_component: 'toggle'
              }
            ]
          }
        ]
      }
    },
    {
      name: 'Site Vitrine Simple',
      description: 'Pages statiques, contact, équipe, services et visuels.',
      category: 'Vitrine',
      icon: BookOpen,
      tags: ['vitrine', 'pages', 'contact', 'équipe'],
      schema: {
        name: 'Site Vitrine Simple',
        description: 'Schéma pour un site vitrine PME, agences, etc.',
        version: '1.0.0',
        tables: [
          {
            id: crypto.randomUUID(),
            name: 'pages',
            description: 'Pages statiques du site',
            category: 'Contenu',
            fields: [
              ...createCommonFields(),
              {
                name: 'title',
                type_general: 'string',
                type_sql: 'VARCHAR(255)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Titre de la page',
                example_value: 'À propos de nous',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'slug',
                type_general: 'string',
                type_sql: 'VARCHAR(250) UNIQUE',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Slug pour l’URL',
                example_value: 'a-propos',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'content',
                type_general: 'text',
                type_sql: 'TEXT',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Contenu principal de la page',
                example_value: 'Bienvenue...',
                slug_compatible: false,
                acf_field_type: 'wysiwyg',
                ui_component: 'textarea'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'team_members',
            description: 'Équipe / collaborateurs',
            category: 'Équipe',
            fields: [
              ...createCommonFields(),
              {
                name: 'name',
                type_general: 'string',
                type_sql: 'VARCHAR(100)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Nom membre',
                example_value: 'Marie Dupont',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'role',
                type_general: 'string',
                type_sql: 'VARCHAR(100)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Rôle/Position',
                example_value: 'CEO',
                slug_compatible: false,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'photo',
                type_general: 'image',
                type_sql: 'VARCHAR(350)',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Photo ou avatar',
                example_value: '/uploads/marie.jpg',
                slug_compatible: false,
                acf_field_type: 'image',
                ui_component: 'image-picker'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'contacts',
            description: 'Demandes de contact et formulaires',
            category: 'Contact',
            fields: [
              ...createCommonFields(),
              {
                name: 'fullname',
                type_general: 'string',
                type_sql: 'VARCHAR(100)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Nom complet',
                example_value: 'Julia Marchand',
                slug_compatible: false,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'email',
                type_general: 'string',
                type_sql: 'VARCHAR(255)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Adresse email',
                example_value: 'julia@email.com',
                slug_compatible: false,
                acf_field_type: 'email',
                ui_component: 'input'
              },
              {
                name: 'message',
                type_general: 'text',
                type_sql: 'TEXT',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Message envoyé',
                example_value: 'Bonjour, je souhaite...',
                slug_compatible: false,
                acf_field_type: 'textarea',
                ui_component: 'textarea'
              }
            ]
          }
        ]
      }
    },
    {
      name: 'Portfolio Créatif',
      description: 'Oeuvres, projets, galeries, bio, contact.',
      category: 'Portfolio',
      icon: Image,
      tags: ['portfolio', 'galerie', 'créatif'],
      schema: {
        name: 'Portfolio Créatif',
        description: 'Portfolio pour photographe, artiste, designer.',
        version: '1.0.0',
        tables: [
          {
            id: crypto.randomUUID(),
            name: 'works',
            description: 'Réalisations et projets',
            category: 'Portfolio',
            fields: [
              ...createCommonFields(),
              {
                name: 'title',
                type_general: 'string',
                type_sql: 'VARCHAR(255)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Titre de l’oeuvre',
                example_value: 'Soleil couchant',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'image',
                type_general: 'image',
                type_sql: 'VARCHAR(350)',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Image principale',
                example_value: '/portfolio/img1.jpg',
                slug_compatible: false,
                acf_field_type: 'image',
                ui_component: 'image-picker'
              },
              {
                name: 'description',
                type_general: 'text',
                type_sql: 'TEXT',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Description ou légende',
                example_value: 'Photo prise au Maroc...',
                slug_compatible: false,
                acf_field_type: 'textarea',
                ui_component: 'textarea'
              },
              {
                name: 'date',
                type_general: 'datetime',
                type_sql: 'DATE',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Date de réalisation',
                example_value: '2024-06-01',
                slug_compatible: false,
                acf_field_type: 'date_picker',
                ui_component: 'datepicker'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'bio',
            description: 'Biographie du créateur',
            category: 'Info',
            fields: [
              ...createCommonFields(),
              {
                name: 'fullname',
                type_general: 'string',
                type_sql: 'VARCHAR(100)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Nom complet',
                example_value: 'Émilie Laurent',
                slug_compatible: false,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'bio',
                type_general: 'text',
                type_sql: 'TEXT',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Présentation longue',
                example_value: 'Photographe passionnée...',
                slug_compatible: false,
                acf_field_type: 'textarea',
                ui_component: 'textarea'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'contact',
            description: 'Formulaire de contact',
            category: 'Contact',
            fields: [
              ...createCommonFields(),
              {
                name: 'email',
                type_general: 'string',
                type_sql: 'VARCHAR(255)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Email',
                example_value: 'artiste@email.com',
                slug_compatible: false,
                acf_field_type: 'email',
                ui_component: 'input'
              },
              {
                name: 'message',
                type_general: 'text',
                type_sql: 'TEXT',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Message',
                example_value: 'Super vos oeuvres !',
                slug_compatible: false,
                acf_field_type: 'textarea',
                ui_component: 'textarea'
              }
            ]
          }
        ]
      }
    },
    {
      name: 'SaaS de Gestion',
      description: "Abonnés, équipes, factures, rôles avancés, multi-tenants",
      category: 'SaaS',
      icon: CreditCard,
      tags: ['SaaS', 'facturation', 'utilisateurs', 'multitenant'],
      schema: {
        name: 'SaaS Gestion',
        description: "Schéma type pour SaaS multi-équipes et gestion d’abonnements",
        version: '1.0.0',
        tables: [
          {
            id: crypto.randomUUID(),
            name: 'accounts',
            description: 'Comptes clients',
            category: 'Core',
            fields: [
              ...createCommonFields(),
              {
                name: 'company_name',
                type_general: 'string',
                type_sql: 'VARCHAR(150)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Nom société',
                example_value: 'TechCo',
                slug_compatible: true,
                acf_field_type: 'text',
                ui_component: 'input'
              },
              {
                name: 'contact_email',
                type_general: 'string',
                type_sql: 'VARCHAR(150)',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Email principal',
                example_value: 'support@techco.fr',
                slug_compatible: false,
                acf_field_type: 'email',
                ui_component: 'input'
              },
              {
                name: 'country',
                type_general: 'string',
                type_sql: 'VARCHAR(80)',
                required: false,
                unique: false,
                primary_key: false,
                description: 'Pays',
                example_value: 'France',
                slug_compatible: false,
                acf_field_type: 'text',
                ui_component: 'input'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'subscriptions',
            description: 'Abonnements',
            category: 'Billing',
            fields: [
              ...createCommonFields(),
              {
                name: 'account_id',
                type_general: 'relation',
                type_sql: 'UUID',
                foreign_key: 'accounts.id',
                relation_cardinality: 'N-1',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Client abonné',
                example_value: 'uuid...',
                slug_compatible: false,
                acf_field_type: 'relationship',
                ui_component: 'relation-picker'
              },
              {
                name: 'start_date',
                type_general: 'datetime',
                type_sql: 'DATE',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Début abonnement',
                example_value: '2024-01-01',
                slug_compatible: false,
                acf_field_type: 'date_picker',
                ui_component: 'datepicker'
              },
              {
                name: 'status',
                type_general: 'enum',
                type_sql: "ENUM('active','canceled','trial')",
                enum_values: ['active','canceled','trial'],
                required: true,
                unique: false,
                primary_key: false,
                description: 'Statut actuel',
                example_value: 'active',
                slug_compatible: false,
                acf_field_type: 'select',
                ui_component: 'select'
              }
            ]
          },
          {
            id: crypto.randomUUID(),
            name: 'users',
            description: 'Utilisateurs membres de comptes',
            category: 'Utilisateurs',
            fields: [
              ...createCommonFields(),
              {
                name: 'email',
                type_general: 'string',
                type_sql: 'VARCHAR(255)',
                required: true,
                unique: true,
                primary_key: false,
                description: 'Email utilisateur',
                example_value: 'jane@sub.co',
                slug_compatible: false,
                acf_field_type: 'email',
                ui_component: 'input'
              },
              {
                name: 'role',
                type_general: 'enum',
                type_sql: "ENUM('admin','member')",
                enum_values: ['admin','member'],
                required: true,
                unique: false,
                primary_key: false,
                description: 'Rôle',
                example_value: 'admin',
                slug_compatible: false,
                acf_field_type: 'select',
                ui_component: 'select'
              },
              {
                name: 'account_id',
                type_general: 'relation',
                type_sql: 'UUID',
                foreign_key: 'accounts.id',
                relation_cardinality: 'N-1',
                required: true,
                unique: false,
                primary_key: false,
                description: 'Lien au compte',
                example_value: 'uuid...',
                slug_compatible: false,
                acf_field_type: 'relationship',
                ui_component: 'relation-picker'
              }
            ]
          }
        ]
      }
    }
  ];

  // Combine presets (originaux + nouveaux)
  const allPresets: PresetSchema[] = [
    ...presets,
  ];

  const categories = ['Tous', ...Array.from(new Set(allPresets.map(p => p.category)))];

  const filteredPresets = allPresets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'Tous' || preset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleApplyPreset = (preset: PresetSchema) => {
    if (allowMultiple) {
      onTogglePreset(preset.name);
    } else {
      onApplyPreset(preset.schema);
    }
  };

  // --- NOUVELLE GESTION DES ERREURS COMBO ---
  // Lors de la combinaison, vérifier s'il y a des tables portant le même nom
  const applyCombinedPresets = () => {
    if (selectedPresets.length === 0) return;

    const selectedSchemas = allPresets.filter(p => selectedPresets.includes(p.name));
    const allTables = selectedSchemas.flatMap(s => s.schema.tables);
    const tableNameCounts: {[key: string]: number} = {};
    allTables.forEach(table => {
      tableNameCounts[table.name] = (tableNameCounts[table.name] || 0) + 1;
    });

    const duplicates = Object.entries(tableNameCounts).filter(([, count]) => count > 1).map(([name]) => name);

    if (duplicates.length > 0) {
      toast({
        title: "Conflit de tables",
        description: `Certaines tables existent en double : ${duplicates.join(", ")}. Fusion impossible.`,
        variant: "destructive"
      });
      return;
    }

    const combinedSchema: Schema = {
      name: `Schéma Combiné (${selectedPresets.length} presets)`,
      description: `Combinaison de: ${selectedPresets.join(', ')}`,
      version: '1.0.0',
      tables: allTables
    };

    onApplyPreset(combinedSchema);
  };

  // --- MODALE & LOGIQUE Assistant IA ---
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiInput, setAIInput] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAIRequest = async () => {
    setLoadingAI(true);
    try {
      // Appel du service Gemini pour suggérer un schéma idéal selon le prompt utilisateur
      const { GeminiService } = await import('@/services/GeminiService');
      const apiKey = GeminiService.getStoredApiKey() || '';
      if (!apiKey) {
        toast({ title: "Clé Gemini manquante", description: "Configurez la clé API Gemini.", variant: "destructive" });
        setLoadingAI(false);
        return;
      }
      const gemini = new GeminiService({ apiKey });
      const response = await gemini.analyzeSchema({ name: 'Projet', description: aiInput, version: '1.0.0', tables: [] });
      // Pour cette première version, on utilise la suggestion la plus détaillée trouvée
      const mainSuggestion = response?.find(s => s.implementation?.tableId);
      if (mainSuggestion && mainSuggestion.implementation?.table) {
        onApplyPreset(mainSuggestion.implementation.table);
        setShowAIAssistant(false);
      } else {
        toast({
          title: "Pas de schéma généré",
          description: "Aucune proposition retournée par Gemini. Essayez un prompt plus détaillé.",
          variant: "destructive"
        });
      }
    } catch (err) {
      toast({ title: "Erreur IA", description: "La génération a échoué.", variant: "destructive" });
    }
    setLoadingAI(false);
  };

  return (
    <div className="space-y-6">
      {/* --- AJOUT BOUTON Assistant IA --- */}
      <div className="flex gap-2 items-end justify-end pb-2">
        <Button onClick={() => setShowAIAssistant(true)} variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Assistant IA - Générer le schéma idéal
        </Button>
      </div>
      {/* --- MODALE DEMANDE ASSISTANT IA --- */}
      {showAIAssistant && (
        <div className="fixed left-0 top-0 z-40 w-full h-full bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[95vw] max-w-lg relative">
            <button className="absolute right-2 top-2 text-gray-400" onClick={() => setShowAIAssistant(false)}>
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-2">Décrivez votre site</h2>
            <p className="mb-3 text-sm text-gray-600">Ex : “Je veux un site d’école, gestion profs, élèves, horaires, etc.”</p>
            <textarea
              value={aiInput}
              onChange={e => setAIInput(e.target.value)}
              placeholder="Type de site, fonctionnalités, cible, outils, etc..."
              rows={4}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <div className="flex gap-2">
              <Button onClick={handleAIRequest} disabled={loadingAI}>
                {loadingAI ? <span>Chargement...</span> : <>Proposer un schéma idéal</>}
              </Button>
              <Button variant="secondary" onClick={() => setShowAIAssistant(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search">Rechercher un preset</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, description ou tags..."
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="category">Catégorie</Label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {allowMultiple && selectedPresets.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Presets sélectionnés ({selectedPresets.length})</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPresets.map(name => (
                    <Badge key={name} variant="secondary">{name}</Badge>
                  ))}
                </div>
              </div>
              <Button onClick={applyCombinedPresets} className="bg-blue-600 hover:bg-blue-700">
                Combiner les presets
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map((preset) => {
          const IconComponent = preset.icon;
          const isSelected = selectedPresets.includes(preset.name);
          
          return (
            <Card 
              key={preset.name}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleApplyPreset(preset)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {allowMultiple && (
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {}}
                      className="pointer-events-none"
                    />
                  )}
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{preset.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {preset.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">
                  {preset.description}
                </p>
                
                <div className="space-y-2">
                  <div className="text-xs text-slate-500">
                    {preset.schema.tables.length} table(s) • {' '}
                    {preset.schema.tables.reduce((acc, table) => acc + table.fields.length, 0)} champs
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {preset.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPresets.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun preset trouvé pour "{searchTerm}"</p>
          <p className="text-sm">Essayez avec d'autres mots-clés</p>
        </div>
      )}
    </div>
  );
};
