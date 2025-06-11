
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ShoppingCart, GraduationCap, Briefcase, Users, MapPin, Sparkles } from 'lucide-react';
import { Table, Field, Schema } from '@/types/schema';

interface SchemaPresetsProps {
  onApplyPreset: (schema: Schema) => void;
}

export const SchemaPresets: React.FC<SchemaPresetsProps> = ({ onApplyPreset }) => {
  const createBlogPreset = (): Schema => ({
    name: 'Blog',
    description: 'Structure complète pour un blog avec articles, auteurs, catégories et commentaires',
    version: '1.0.0',
    tables: [
      {
        id: 'authors',
        name: 'authors',
        description: 'Table des auteurs du blog',
        category: 'Content',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique de l\'auteur',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'name',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Nom complet de l\'auteur',
            example_value: 'Jean Dupont',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            category: 'Identité'
          },
          {
            name: 'slug',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Slug unique pour URL',
            example_value: 'jean-dupont',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            index: 'BTree'
          },
          {
            name: 'email',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Email de l\'auteur',
            example_value: 'jean.dupont@example.com',
            slug_compatible: false,
            acf_field_type: 'email',
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
            example_value: 'Passionné de technologie et d\'écriture...',
            slug_compatible: false,
            acf_field_type: 'textarea',
            ui_component: 'textarea'
          },
          {
            name: 'avatar',
            type_general: 'image',
            type_sql: 'VARCHAR(500)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Photo de profil de l\'auteur',
            example_value: 'https://example.com/avatars/jean-dupont.jpg',
            slug_compatible: false,
            acf_field_type: 'image',
            ui_component: 'image-picker'
          }
        ]
      },
      {
        id: 'categories',
        name: 'categories',
        description: 'Catégories d\'articles',
        category: 'Content',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique de la catégorie',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'name',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
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
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Slug unique pour URL',
            example_value: 'technologie',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            index: 'BTree'
          },
          {
            name: 'description',
            type_general: 'text',
            type_sql: 'TEXT',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Description de la catégorie',
            example_value: 'Articles sur les dernières technologies',
            slug_compatible: false,
            acf_field_type: 'textarea',
            ui_component: 'textarea'
          }
        ]
      },
      {
        id: 'posts',
        name: 'posts',
        description: 'Articles de blog',
        category: 'Content',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique de l\'article',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'title',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Titre de l\'article',
            example_value: 'Les tendances du développement web en 2025',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'slug',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Slug unique pour URL',
            example_value: 'tendances-developpement-web-2025',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            index: 'BTree'
          },
          {
            name: 'excerpt',
            type_general: 'text',
            type_sql: 'TEXT',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Extrait de l\'article',
            example_value: 'Découvrez les technologies qui façonneront...',
            slug_compatible: false,
            acf_field_type: 'textarea',
            ui_component: 'textarea'
          },
          {
            name: 'content',
            type_general: 'text',
            type_sql: 'TEXT NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Contenu complet de l\'article',
            example_value: 'Le développement web évolue rapidement...',
            slug_compatible: false,
            acf_field_type: 'wysiwyg',
            ui_component: 'textarea'
          },
          {
            name: 'status',
            type_general: 'enum',
            type_sql: 'VARCHAR(50) DEFAULT \'draft\'',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Statut de publication',
            example_value: 'published',
            slug_compatible: false,
            acf_field_type: 'select',
            ui_component: 'select',
            enum_values: ['draft', 'published', 'archived'],
            default_sql: 'draft'
          },
          {
            name: 'featured_image',
            type_general: 'image',
            type_sql: 'VARCHAR(500)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Image mise en avant',
            example_value: 'https://example.com/images/web-trends-2025.jpg',
            slug_compatible: false,
            acf_field_type: 'image',
            ui_component: 'image-picker'
          },
          {
            name: 'author_id',
            type_general: 'relation',
            type_sql: 'UUID NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Auteur de l\'article',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'relationship',
            ui_component: 'relation-picker',
            foreign_key: 'authors(id)',
            relation_cardinality: '1-N'
          },
          {
            name: 'category_id',
            type_general: 'relation',
            type_sql: 'UUID NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Catégorie de l\'article',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'relationship',
            ui_component: 'relation-picker',
            foreign_key: 'categories(id)',
            relation_cardinality: '1-N'
          },
          {
            name: 'published_at',
            type_general: 'datetime',
            type_sql: 'TIMESTAMP WITH TIME ZONE',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Date de publication',
            example_value: '2025-01-15T10:30:00Z',
            slug_compatible: false,
            acf_field_type: 'date_time_picker',
            ui_component: 'datepicker'
          },
          {
            name: 'created_at',
            type_general: 'datetime',
            type_sql: 'TIMESTAMP WITH TIME ZONE DEFAULT now()',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Date de création',
            example_value: '2025-01-15T10:30:00Z',
            slug_compatible: false,
            acf_field_type: 'date_time_picker',
            ui_component: 'datepicker',
            default_sql: 'now()'
          }
        ]
      }
    ]
  });

  const createEcommercePreset = (): Schema => ({
    name: 'Boutique E-commerce',
    description: 'Structure complète pour une boutique en ligne avec produits, commandes et clients',
    version: '1.0.0',
    tables: [
      {
        id: 'products',
        name: 'products',
        description: 'Catalogue produits',
        category: 'E-commerce',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique du produit',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'name',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Nom du produit',
            example_value: 'MacBook Pro 16" M3',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'slug',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Slug unique pour URL',
            example_value: 'macbook-pro-16-m3',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            index: 'BTree'
          },
          {
            name: 'description',
            type_general: 'text',
            type_sql: 'TEXT',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Description du produit',
            example_value: 'Le MacBook Pro le plus puissant avec puce M3...',
            slug_compatible: false,
            acf_field_type: 'wysiwyg',
            ui_component: 'textarea'
          },
          {
            name: 'price',
            type_general: 'float',
            type_sql: 'DECIMAL(10,2) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Prix en euros',
            example_value: '2999.99',
            slug_compatible: false,
            acf_field_type: 'number',
            ui_component: 'input'
          },
          {
            name: 'stock_quantity',
            type_general: 'int',
            type_sql: 'INTEGER DEFAULT 0',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Quantité en stock',
            example_value: '25',
            slug_compatible: false,
            acf_field_type: 'number',
            ui_component: 'input',
            default_sql: '0'
          },
          {
            name: 'sku',
            type_general: 'string',
            type_sql: 'VARCHAR(100) UNIQUE',
            required: false,
            unique: true,
            primary_key: false,
            description: 'Code produit (SKU)',
            example_value: 'MBP-16-M3-256',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'category',
            type_general: 'string',
            type_sql: 'VARCHAR(100)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Catégorie du produit',
            example_value: 'Ordinateurs',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'images',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'URLs des images du produit',
            example_value: '["https://example.com/img1.jpg", "https://example.com/img2.jpg"]',
            slug_compatible: false,
            acf_field_type: 'gallery',
            ui_component: 'image-picker'
          },
          {
            name: 'specifications',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Spécifications techniques',
            example_value: '{"processor": "M3", "ram": "16GB", "storage": "512GB"}',
            slug_compatible: false,
            acf_field_type: 'repeater',
            ui_component: 'textarea'
          },
          {
            name: 'is_active',
            type_general: 'bool',
            type_sql: 'BOOLEAN DEFAULT true',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Produit actif/visible',
            example_value: 'true',
            slug_compatible: false,
            acf_field_type: 'true_false',
            ui_component: 'toggle',
            default_sql: 'true'
          }
        ]
      },
      {
        id: 'customers',
        name: 'customers',
        description: 'Clients de la boutique',
        category: 'E-commerce',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique du client',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'email',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
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
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Prénom',
            example_value: 'Marie',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'last_name',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Nom de famille',
            example_value: 'Martin',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'phone',
            type_general: 'string',
            type_sql: 'VARCHAR(20)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Numéro de téléphone',
            example_value: '+33 6 12 34 56 78',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'address',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Adresse complète',
            example_value: '{"street": "123 rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}',
            slug_compatible: false,
            acf_field_type: 'group',
            ui_component: 'textarea'
          }
        ]
      }
    ]
  });

  const createTrainingPreset = (): Schema => ({
    name: 'Plateforme de Formations',
    description: 'Structure complète pour une plateforme de formations en ligne',
    version: '1.0.0',
    tables: [
      {
        id: 'courses',
        name: 'courses',
        description: 'Catalogue des formations',
        category: 'Education',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique de la formation',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'title',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Titre de la formation',
            example_value: 'Développement Web avec React',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'slug',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Slug unique pour URL',
            example_value: 'developpement-web-react',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            index: 'BTree'
          },
          {
            name: 'description',
            type_general: 'text',
            type_sql: 'TEXT',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Description de la formation',
            example_value: 'Apprenez à créer des applications web modernes...',
            slug_compatible: false,
            acf_field_type: 'wysiwyg',
            ui_component: 'textarea'
          },
          {
            name: 'level',
            type_general: 'enum',
            type_sql: 'VARCHAR(50)',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Niveau de difficulté',
            example_value: 'intermediate',
            slug_compatible: false,
            acf_field_type: 'select',
            ui_component: 'select',
            enum_values: ['beginner', 'intermediate', 'advanced']
          },
          {
            name: 'duration_hours',
            type_general: 'int',
            type_sql: 'INTEGER',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Durée en heures',
            example_value: '40',
            slug_compatible: false,
            acf_field_type: 'number',
            ui_component: 'input'
          },
          {
            name: 'price',
            type_general: 'float',
            type_sql: 'DECIMAL(10,2)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Prix de la formation',
            example_value: '299.00',
            slug_compatible: false,
            acf_field_type: 'number',
            ui_component: 'input'
          },
          {
            name: 'instructor_name',
            type_general: 'string',
            type_sql: 'VARCHAR(255)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Nom de l\'instructeur',
            example_value: 'Pierre Durand',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'requirements',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Prérequis de la formation',
            example_value: '["Bases en HTML/CSS", "Notions de JavaScript"]',
            slug_compatible: false,
            acf_field_type: 'repeater',
            ui_component: 'textarea'
          },
          {
            name: 'syllabus',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Programme détaillé',
            example_value: '[{"module": "Introduction", "lessons": ["Qu\'est-ce que React", "Configuration"]}]',
            slug_compatible: false,
            acf_field_type: 'repeater',
            ui_component: 'textarea'
          }
        ]
      }
    ]
  });

  const createServicesPreset = (): Schema => ({
    name: 'Annuaire Services',
    description: 'Structure pour un annuaire de services professionnels',
    version: '1.0.0',
    tables: [
      {
        id: 'services',
        name: 'services',
        description: 'Services proposés',
        category: 'Services',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique du service',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'name',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Nom du service',
            example_value: 'Développement Web sur Mesure',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'slug',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Slug unique pour URL',
            example_value: 'developpement-web-sur-mesure',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            index: 'BTree'
          },
          {
            name: 'category',
            type_general: 'enum',
            type_sql: 'VARCHAR(100)',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Catégorie de service',
            example_value: 'web_development',
            slug_compatible: false,
            acf_field_type: 'select',
            ui_component: 'select',
            enum_values: ['web_development', 'graphic_design', 'marketing', 'consulting', 'photography', 'writing']
          },
          {
            name: 'description',
            type_general: 'text',
            type_sql: 'TEXT',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Description du service',
            example_value: 'Création de sites web professionnels et applications...',
            slug_compatible: false,
            acf_field_type: 'wysiwyg',
            ui_component: 'textarea'
          },
          {
            name: 'price_range',
            type_general: 'string',
            type_sql: 'VARCHAR(100)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Fourchette de prix',
            example_value: '500€ - 5000€',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'provider_name',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Nom du prestataire',
            example_value: 'TechSolutions SARL',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'provider_email',
            type_general: 'string',
            type_sql: 'VARCHAR(255)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Email du prestataire',
            example_value: 'contact@techsolutions.fr',
            slug_compatible: false,
            acf_field_type: 'email',
            ui_component: 'input'
          },
          {
            name: 'provider_phone',
            type_general: 'string',
            type_sql: 'VARCHAR(20)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Téléphone du prestataire',
            example_value: '+33 1 23 45 67 89',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'location',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Localisation géographique',
            example_value: '{"city": "Paris", "region": "Île-de-France", "country": "France"}',
            slug_compatible: false,
            acf_field_type: 'group',
            ui_component: 'textarea'
          }
        ]
      }
    ]
  });

  const createBusinessDirectoryPreset = (): Schema => ({
    name: 'Annuaire Professionnels',
    description: 'Annuaire complet de professionnels et entreprises',
    version: '1.0.0',
    tables: [
      {
        id: 'businesses',
        name: 'businesses',
        description: 'Entreprises et professionnels',
        category: 'Directory',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique de l\'entreprise',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'name',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Nom de l\'entreprise',
            example_value: 'Boulangerie Martin',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'slug',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Slug unique pour URL',
            example_value: 'boulangerie-martin',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            index: 'BTree'
          },
          {
            name: 'industry',
            type_general: 'enum',
            type_sql: 'VARCHAR(100)',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Secteur d\'activité',
            example_value: 'food_beverage',
            slug_compatible: false,
            acf_field_type: 'select',
            ui_component: 'select',
            enum_values: ['food_beverage', 'health_medical', 'retail', 'services', 'technology', 'construction', 'education', 'automotive']
          },
          {
            name: 'description',
            type_general: 'text',
            type_sql: 'TEXT',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Description de l\'entreprise',
            example_value: 'Boulangerie artisanale depuis 1995, spécialités maison...',
            slug_compatible: false,
            acf_field_type: 'wysiwyg',
            ui_component: 'textarea'
          },
          {
            name: 'siret',
            type_general: 'string',
            type_sql: 'VARCHAR(20)',
            required: false,
            unique: true,
            primary_key: false,
            description: 'Numéro SIRET',
            example_value: '12345678901234',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'address',
            type_general: 'json',
            type_sql: 'JSONB NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Adresse complète',
            example_value: '{"street": "15 rue de la République", "city": "Lyon", "postal_code": "69001", "country": "France"}',
            slug_compatible: false,
            acf_field_type: 'group',
            ui_component: 'textarea'
          },
          {
            name: 'contact',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Informations de contact',
            example_value: '{"phone": "+33 4 12 34 56 78", "email": "contact@boulangerie-martin.fr", "website": "https://boulangerie-martin.fr"}',
            slug_compatible: false,
            acf_field_type: 'group',
            ui_component: 'textarea'
          },
          {
            name: 'opening_hours',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Horaires d\'ouverture',
            example_value: '{"monday": "7:00-19:00", "tuesday": "7:00-19:00", "sunday": "7:00-13:00"}',
            slug_compatible: false,
            acf_field_type: 'repeater',
            ui_component: 'textarea'
          },
          {
            name: 'rating',
            type_general: 'float',
            type_sql: 'DECIMAL(3,2)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Note moyenne (sur 5)',
            example_value: '4.8',
            slug_compatible: false,
            acf_field_type: 'range',
            ui_component: 'input'
          }
        ]
      }
    ]
  });

  const createPlacesDirectoryPreset = (): Schema => ({
    name: 'Annuaire de Lieux',
    description: 'Annuaire géolocalisé de lieux et points d\'intérêt',
    version: '1.0.0',
    tables: [
      {
        id: 'places',
        name: 'places',
        description: 'Lieux et points d\'intérêt',
        category: 'Geography',
        fields: [
          {
            name: 'id',
            type_general: 'uuid',
            type_sql: 'UUID PRIMARY KEY DEFAULT uuid_generate_v4()',
            required: true,
            unique: true,
            primary_key: true,
            description: 'Identifiant unique du lieu',
            example_value: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            slug_compatible: false,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'name',
            type_general: 'string',
            type_sql: 'VARCHAR(255) NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Nom du lieu',
            example_value: 'Tour Eiffel',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input'
          },
          {
            name: 'slug',
            type_general: 'string',
            type_sql: 'VARCHAR(255) UNIQUE NOT NULL',
            required: true,
            unique: true,
            primary_key: false,
            description: 'Slug unique pour URL',
            example_value: 'tour-eiffel',
            slug_compatible: true,
            acf_field_type: 'text',
            ui_component: 'input',
            index: 'BTree'
          },
          {
            name: 'category',
            type_general: 'enum',
            type_sql: 'VARCHAR(100)',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Type de lieu',
            example_value: 'monument',
            slug_compatible: false,
            acf_field_type: 'select',
            ui_component: 'select',
            enum_values: ['monument', 'museum', 'park', 'restaurant', 'hotel', 'shop', 'transport', 'entertainment']
          },
          {
            name: 'description',
            type_general: 'text',
            type_sql: 'TEXT',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Description du lieu',
            example_value: 'Monument emblématique de Paris, construite en 1889...',
            slug_compatible: false,
            acf_field_type: 'wysiwyg',
            ui_component: 'textarea'
          },
          {
            name: 'address',
            type_general: 'json',
            type_sql: 'JSONB NOT NULL',
            required: true,
            unique: false,
            primary_key: false,
            description: 'Adresse complète',
            example_value: '{"street": "Champ de Mars", "city": "Paris", "postal_code": "75007", "country": "France"}',
            slug_compatible: false,
            acf_field_type: 'group',
            ui_component: 'textarea'
          },
          {
            name: 'coordinates',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Coordonnées GPS',
            example_value: '{"latitude": 48.8584, "longitude": 2.2945}',
            slug_compatible: false,
            acf_field_type: 'group',
            ui_component: 'textarea'
          },
          {
            name: 'accessibility',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Informations d\'accessibilité',
            example_value: '{"wheelchair": true, "elevator": true, "parking": false}',
            slug_compatible: false,
            acf_field_type: 'group',
            ui_component: 'textarea'
          },
          {
            name: 'images',
            type_general: 'json',
            type_sql: 'JSONB',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Photos du lieu',
            example_value: '["https://example.com/eiffel1.jpg", "https://example.com/eiffel2.jpg"]',
            slug_compatible: false,
            acf_field_type: 'gallery',
            ui_component: 'image-picker'
          },
          {
            name: 'website',
            type_general: 'string',
            type_sql: 'VARCHAR(500)',
            required: false,
            unique: false,
            primary_key: false,
            description: 'Site web officiel',
            example_value: 'https://www.toureiffel.paris',
            slug_compatible: false,
            acf_field_type: 'url',
            ui_component: 'input'
          }
        ]
      }
    ]
  });

  const presets = [
    {
      id: 'blog',
      title: 'Blog',
      description: 'Articles, auteurs, catégories, commentaires',
      icon: BookOpen,
      schema: createBlogPreset,
      tags: ['Content', 'CMS']
    },
    {
      id: 'ecommerce',
      title: 'Boutique E-commerce',
      description: 'Produits, clients, commandes, inventaire',
      icon: ShoppingCart,
      schema: createEcommercePreset,
      tags: ['E-commerce', 'Vente']
    },
    {
      id: 'training',
      title: 'Formations',
      description: 'Cours, modules, étudiants, certifications',
      icon: GraduationCap,
      schema: createTrainingPreset,
      tags: ['Education', 'LMS']
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Prestataires, services, tarifs, réservations',
      icon: Briefcase,
      schema: createServicesPreset,
      tags: ['Services', 'B2B']
    },
    {
      id: 'business-directory',
      title: 'Annuaire Pros',
      description: 'Entreprises, secteurs, contacts, horaires',
      icon: Users,
      schema: createBusinessDirectoryPreset,
      tags: ['Annuaire', 'Business']
    },
    {
      id: 'places',
      title: 'Annuaire de Lieux',
      description: 'POI, géolocalisation, catégories, photos',
      icon: MapPin,
      schema: createPlacesDirectoryPreset,
      tags: ['Géographie', 'Tourisme']
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Presets de Projets
        </CardTitle>
        <p className="text-sm text-slate-600">
          Démarrez rapidement avec des structures prêtes à l'emploi
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <Card key={preset.id} className="border-slate-200 hover:shadow-lg transition-all cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-2 rounded-lg group-hover:from-blue-200 group-hover:to-purple-200 transition-all">
                    <preset.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{preset.title}</CardTitle>
                </div>
                <p className="text-sm text-slate-600">{preset.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {preset.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => onApplyPreset(preset.schema())}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="sm"
                >
                  Utiliser ce preset
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
