
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ShoppingCart, GraduationCap, Briefcase, Building, MapPin } from 'lucide-react';
import { Schema } from '@/types/schema';

interface SchemaPresetsProps {
  onApplyPreset: (preset: Schema) => void;
}

export const SchemaPresets: React.FC<SchemaPresetsProps> = ({ onApplyPreset }) => {
  const presets: Schema[] = [
    {
      name: "Blog Personnel",
      description: "Structure complète pour un blog avec articles, catégories et commentaires",
      version: "1.0.0",
      tables: [
        {
          id: crypto.randomUUID(),
          name: "articles",
          description: "Articles de blog avec contenu riche",
          category: "Contenu",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de l'article",
              example_value: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "title",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Titre de l'article",
              example_value: "Mon premier article de blog",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "URL conviviale de l'article",
              example_value: "mon-premier-article-de-blog",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "content",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Contenu principal de l'article en markdown",
              example_value: "# Introduction\n\nCeci est mon premier article...",
              slug_compatible: false,
              acf_field_type: "wysiwyg",
              ui_component: "textarea"
            },
            {
              name: "excerpt",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Résumé court de l'article",
              example_value: "Découvrez comment j'ai commencé mon blog...",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "featured_image",
              type_general: "image",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Image principale de l'article",
              example_value: "/images/articles/premier-article.jpg",
              slug_compatible: false,
              acf_field_type: "image",
              ui_component: "image-picker"
            },
            {
              name: "category_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES categories(id)",
              required: false,
              unique: false,
              primary_key: false,
              foreign_key: "categories(id)",
              relation_cardinality: "N-1",
              description: "Catégorie de l'article",
              example_value: "tech-web",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "published",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT FALSE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "FALSE",
              description: "Article publié ou brouillon",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            },
            {
              name: "published_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE",
              required: false,
              unique: false,
              primary_key: false,
              description: "Date de publication",
              example_value: "2024-01-15T10:30:00Z",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            },
            {
              name: "created_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
              required: true,
              unique: false,
              primary_key: false,
              default_sql: "NOW()",
              description: "Date de création",
              example_value: "2024-01-15T10:30:00Z",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            },
            {
              name: "updated_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
              required: true,
              unique: false,
              primary_key: false,
              default_sql: "NOW()",
              description: "Date de dernière modification",
              example_value: "2024-01-15T10:30:00Z",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            }
          ]
        },
        {
          id: crypto.randomUUID(),
          name: "categories",
          description: "Catégories pour organiser les articles",
          category: "Classification",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de la catégorie",
              example_value: "cat-tech-web",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(100) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom de la catégorie",
              example_value: "Technologies Web",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(100) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "Slug URL de la catégorie",
              example_value: "technologies-web",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "description",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description de la catégorie",
              example_value: "Articles sur les dernières technologies web",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "color",
              type_general: "string",
              type_sql: "VARCHAR(7) DEFAULT '#3B82F6'",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "'#3B82F6'",
              description: "Couleur hexadécimale de la catégorie",
              example_value: "#3B82F6",
              slug_compatible: false,
              acf_field_type: "color_picker",
              ui_component: "input"
            }
          ]
        }
      ]
    },
    {
      name: "E-commerce",
      description: "Boutique en ligne avec produits, commandes et clients",
      version: "1.0.0",
      tables: [
        {
          id: crypto.randomUUID(),
          name: "products",
          description: "Catalogue de produits",
          category: "Commerce",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du produit",
              example_value: "prod-12345",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom du produit",
              example_value: "T-shirt Bio Coton",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "URL du produit",
              example_value: "t-shirt-bio-coton",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "description",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description détaillée du produit",
              example_value: "T-shirt en coton bio, confortable et durable...",
              slug_compatible: false,
              acf_field_type: "wysiwyg",
              ui_component: "textarea"
            },
            {
              name: "price",
              type_general: "float",
              type_sql: "DECIMAL(10,2) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Prix en euros",
              example_value: "29.99",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "stock",
              type_general: "int",
              type_sql: "INTEGER DEFAULT 0",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0",
              description: "Quantité en stock",
              example_value: "150",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "featured_image",
              type_general: "image",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Image principale du produit",
              example_value: "/images/products/t-shirt-bio.jpg",
              slug_compatible: false,
              acf_field_type: "image",
              ui_component: "image-picker"
            },
            {
              name: "gallery",
              type_general: "json",
              type_sql: "JSONB",
              required: false,
              unique: false,
              primary_key: false,
              description: "Galerie d'images du produit",
              example_value: '["img1.jpg", "img2.jpg", "img3.jpg"]',
              slug_compatible: false,
              acf_field_type: "gallery",
              ui_component: "image-picker"
            },
            {
              name: "category_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES product_categories(id)",
              required: false,
              unique: false,
              primary_key: false,
              foreign_key: "product_categories(id)",
              relation_cardinality: "N-1",
              description: "Catégorie du produit",
              example_value: "vetements",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "active",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT TRUE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "TRUE",
              description: "Produit actif/visible",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            }
          ]
        }
      ]
    },
    {
      name: "Plateforme de Formation",
      description: "Cours en ligne avec modules, leçons et étudiants",
      version: "1.0.0",
      tables: [
        {
          id: crypto.randomUUID(),
          name: "courses",
          description: "Cours de formation en ligne",
          category: "Éducation",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du cours",
              example_value: "course-javascript-avance",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "title",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Titre du cours",
              example_value: "JavaScript Avancé",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "URL du cours",
              example_value: "javascript-avance",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "description",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description du cours",
              example_value: "Apprenez les concepts avancés de JavaScript...",
              slug_compatible: false,
              acf_field_type: "wysiwyg",
              ui_component: "textarea"
            },
            {
              name: "level",
              type_general: "enum",
              type_sql: "VARCHAR(20) CHECK (level IN ('debutant', 'intermediaire', 'avance'))",
              enum_values: ["debutant", "intermediaire", "avance"],
              required: true,
              unique: false,
              primary_key: false,
              description: "Niveau de difficulté",
              example_value: "avance",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "select"
            },
            {
              name: "duration_hours",
              type_general: "int",
              type_sql: "INTEGER",
              required: false,
              unique: false,
              primary_key: false,
              description: "Durée en heures",
              example_value: "40",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "price",
              type_general: "float",
              type_sql: "DECIMAL(10,2)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Prix du cours en euros",
              example_value: "299.00",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "thumbnail",
              type_general: "image",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Image de couverture du cours",
              example_value: "/images/courses/js-avance.jpg",
              slug_compatible: false,
              acf_field_type: "image",
              ui_component: "image-picker"
            },
            {
              name: "published",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT FALSE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "FALSE",
              description: "Cours publié",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            }
          ]
        }
      ]
    },
    {
      name: "Services Professionnels",
      description: "Site vitrine pour services avec témoignages et portfolio",
      version: "1.0.0",
      tables: [
        {
          id: crypto.randomUUID(),
          name: "services",
          description: "Services proposés par l'entreprise",
          category: "Business",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du service",
              example_value: "service-dev-web",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom du service",
              example_value: "Développement Web",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "URL du service",
              example_value: "developpement-web",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "description",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description détaillée du service",
              example_value: "Création de sites web modernes et performants...",
              slug_compatible: false,
              acf_field_type: "wysiwyg",
              ui_component: "textarea"
            },
            {
              name: "price_from",
              type_general: "float",
              type_sql: "DECIMAL(10,2)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Prix de départ",
              example_value: "1500.00",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "duration_estimate",
              type_general: "string",
              type_sql: "VARCHAR(100)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Durée estimée",
              example_value: "2-4 semaines",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "icon",
              type_general: "string",
              type_sql: "VARCHAR(100)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Nom de l'icône",
              example_value: "code",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "featured",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT FALSE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "FALSE",
              description: "Service mis en avant",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            }
          ]
        }
      ]
    },
    {
      name: "Annuaire Professionnel",
      description: "Répertoire d'entreprises et professionnels",
      version: "1.0.0",
      tables: [
        {
          id: crypto.randomUUID(),
          name: "businesses",
          description: "Entreprises et professionnels référencés",
          category: "Annuaire",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de l'entreprise",
              example_value: "biz-restaurant-paris",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom de l'entreprise",
              example_value: "Restaurant Le Gourmet",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "URL de l'entreprise",
              example_value: "restaurant-le-gourmet",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "description",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description de l'entreprise",
              example_value: "Restaurant gastronomique au cœur de Paris...",
              slug_compatible: false,
              acf_field_type: "wysiwyg",
              ui_component: "textarea"
            },
            {
              name: "address",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Adresse complète",
              example_value: "123 Rue de la Paix, 75001 Paris",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "phone",
              type_general: "string",
              type_sql: "VARCHAR(20)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Numéro de téléphone",
              example_value: "01 42 33 44 55",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "email",
              type_general: "string",
              type_sql: "VARCHAR(255)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Adresse email",
              example_value: "contact@legourmet.fr",
              slug_compatible: false,
              acf_field_type: "email",
              ui_component: "input"
            },
            {
              name: "website",
              type_general: "string",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Site web",
              example_value: "https://www.legourmet.fr",
              slug_compatible: false,
              acf_field_type: "url",
              ui_component: "input"
            },
            {
              name: "category_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES business_categories(id)",
              required: false,
              unique: false,
              primary_key: false,
              foreign_key: "business_categories(id)",
              relation_cardinality: "N-1",
              description: "Catégorie d'activité",
              example_value: "restaurants",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "logo",
              type_general: "image",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Logo de l'entreprise",
              example_value: "/images/logos/legourmet.jpg",
              slug_compatible: false,
              acf_field_type: "image",
              ui_component: "image-picker"
            },
            {
              name: "verified",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT FALSE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "FALSE",
              description: "Entreprise vérifiée",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            }
          ]
        }
      ]
    },
    {
      name: "Annuaire de Lieux",
      description: "Guide touristique avec lieux d'intérêt et avis",
      version: "1.0.0",
      tables: [
        {
          id: crypto.randomUUID(),
          name: "places",
          description: "Lieux d'intérêt touristique",
          category: "Tourisme",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du lieu",
              example_value: "place-tour-eiffel",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom du lieu",
              example_value: "Tour Eiffel",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "URL du lieu",
              example_value: "tour-eiffel",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "description",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description du lieu",
              example_value: "Monument emblématique de Paris, symbole de la France...",
              slug_compatible: false,
              acf_field_type: "wysiwyg",
              ui_component: "textarea"
            },
            {
              name: "address",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Adresse du lieu",
              example_value: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "latitude",
              type_general: "float",
              type_sql: "DECIMAL(10,8)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Latitude GPS",
              example_value: "48.8584",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "longitude",
              type_general: "float",
              type_sql: "DECIMAL(11,8)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Longitude GPS",
              example_value: "2.2945",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "type",
              type_general: "enum",
              type_sql: "VARCHAR(50) CHECK (type IN ('monument', 'musee', 'parc', 'restaurant', 'hotel', 'autre'))",
              enum_values: ["monument", "musee", "parc", "restaurant", "hotel", "autre"],
              required: true,
              unique: false,
              primary_key: false,
              description: "Type de lieu",
              example_value: "monument",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "select"
            },
            {
              name: "featured_image",
              type_general: "image",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Image principale du lieu",
              example_value: "/images/places/tour-eiffel.jpg",
              slug_compatible: false,
              acf_field_type: "image",
              ui_component: "image-picker"
            },
            {
              name: "gallery",
              type_general: "json",
              type_sql: "JSONB",
              required: false,
              unique: false,
              primary_key: false,
              description: "Galerie photos du lieu",
              example_value: '["eiffel1.jpg", "eiffel2.jpg", "eiffel3.jpg"]',
              slug_compatible: false,
              acf_field_type: "gallery",
              ui_component: "image-picker"
            },
            {
              name: "rating",
              type_general: "float",
              type_sql: "DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Note moyenne (0-5)",
              example_value: "4.7",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "active",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT TRUE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "TRUE",
              description: "Lieu actif/visible",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            }
          ]
        }
      ]
    }
  ];

  const presetIcons = {
    "Blog Personnel": BookOpen,
    "E-commerce": ShoppingCart,
    "Plateforme de Formation": GraduationCap,
    "Services Professionnels": Briefcase,
    "Annuaire Professionnel": Building,
    "Annuaire de Lieux": MapPin
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Presets de Schémas
        </h2>
        <p className="text-slate-600">
          Choisissez un modèle pré-configuré pour démarrer rapidement votre projet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset, index) => {
          const IconComponent = presetIcons[preset.name as keyof typeof presetIcons];
          
          return (
            <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-2 rounded-lg">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    {preset.name}
                  </CardTitle>
                </div>
                <p className="text-sm text-slate-600">
                  {preset.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {preset.tables.length} table{preset.tables.length > 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    v{preset.version}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {preset.tables.map((table, tableIndex) => (
                    <div key={tableIndex} className="text-xs bg-slate-50 p-2 rounded">
                      <span className="font-medium">{table.name}</span>
                      <span className="text-slate-500 ml-2">
                        ({table.fields.length} champs)
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={() => onApplyPreset(preset)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Utiliser ce preset
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
