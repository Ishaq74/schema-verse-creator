import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ShoppingCart, GraduationCap, Briefcase, Building, MapPin, Users, Calendar, MessageSquare, Star, Heart, Camera } from 'lucide-react';
import { Schema } from '@/types/schema';

interface SchemaPresetsProps {
  onApplyPreset: (preset: Schema) => void;
  selectedPresets?: string[];
  onTogglePreset?: (presetName: string) => void;
  allowMultiple?: boolean;
}

export const SchemaPresets: React.FC<SchemaPresetsProps> = ({ 
  onApplyPreset, 
  selectedPresets = [], 
  onTogglePreset, 
  allowMultiple = false 
}) => {
  const presets: Schema[] = [
    {
      name: "Blog Personnel Complet",
      description: "Blog ultra-complet avec articles, auteurs, catégories, tags, commentaires et newsletter",
      version: "2.0.0",
      tables: [
        // Articles table
        {
          id: crypto.randomUUID(),
          name: "articles",
          description: "Articles de blog avec contenu riche et métadonnées SEO",
          category: "Contenu Principal",
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
              description: "Titre de l'article optimisé SEO",
              example_value: "Guide Complet du Développement Web en 2024",
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
              example_value: "guide-complet-developpement-web-2024",
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
              example_value: "# Introduction\n\nDans ce guide complet...",
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
              description: "Résumé court pour SEO et aperçus",
              example_value: "Découvrez les dernières tendances du développement web...",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "meta_description",
              type_general: "string",
              type_sql: "VARCHAR(160)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description meta pour le SEO",
              example_value: "Guide complet 2024 : technologies, outils et bonnes pratiques",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "featured_image",
              type_general: "image",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Image principale de l'article",
              example_value: "/images/articles/dev-web-2024.jpg",
              slug_compatible: false,
              acf_field_type: "image",
              ui_component: "image-picker"
            },
            {
              name: "author_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES authors(id)",
              required: true,
              unique: false,
              primary_key: false,
              foreign_key: "authors(id)",
              relation_cardinality: "1-N",
              description: "Auteur de l'article",
              example_value: "author-123",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "category_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES categories(id)",
              required: false,
              unique: false,
              primary_key: false,
              foreign_key: "categories(id)",
              relation_cardinality: "1-N",
              description: "Catégorie principale de l'article",
              example_value: "tech-web",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "reading_time",
              type_general: "int",
              type_sql: "INTEGER",
              required: false,
              unique: false,
              primary_key: false,
              description: "Temps de lecture estimé en minutes",
              example_value: "8",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "view_count",
              type_general: "int",
              type_sql: "INTEGER DEFAULT 0",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0",
              description: "Nombre de vues de l'article",
              example_value: "1523",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "likes_count",
              type_general: "int",
              type_sql: "INTEGER DEFAULT 0",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0",
              description: "Nombre de likes",
              example_value: "45",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
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
              name: "featured",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT FALSE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "FALSE",
              description: "Article mis en avant",
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
        // Authors table
        {
          id: crypto.randomUUID(),
          name: "authors",
          description: "Auteurs du blog avec profils complets",
          category: "Utilisateurs",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de l'auteur",
              example_value: "author-123",
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
              description: "Nom complet de l'auteur",
              example_value: "Marie Dubois",
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
              description: "URL de profil de l'auteur",
              example_value: "marie-dubois",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "email",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "Email de l'auteur",
              example_value: "marie@example.com",
              slug_compatible: false,
              acf_field_type: "email",
              ui_component: "input"
            },
            {
              name: "bio",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Biographie de l'auteur",
              example_value: "Développeuse web passionnée avec 8 ans d'expérience...",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "avatar",
              type_general: "image",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Photo de profil de l'auteur",
              example_value: "/images/authors/marie-dubois.jpg",
              slug_compatible: false,
              acf_field_type: "image",
              ui_component: "image-picker"
            },
            {
              name: "website",
              type_general: "string",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Site web personnel",
              example_value: "https://marie-dubois.dev",
              slug_compatible: false,
              acf_field_type: "url",
              ui_component: "input"
            },
            {
              name: "social_twitter",
              type_general: "string",
              type_sql: "VARCHAR(100)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Nom d'utilisateur Twitter",
              example_value: "marie_dev",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "social_linkedin",
              type_general: "string",
              type_sql: "VARCHAR(100)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Profil LinkedIn",
              example_value: "marie-dubois-dev",
              slug_compatible: false,
              acf_field_type: "text",
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
              description: "Auteur actif",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            }
          ]
        },
        // Categories table
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
            },
            {
              name: "icon",
              type_general: "string",
              type_sql: "VARCHAR(50)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Icône de la catégorie",
              example_value: "code",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            }
          ]
        },
        // Tags table
        {
          id: crypto.randomUUID(),
          name: "tags",
          description: "Tags pour une classification fine des articles",
          category: "Classification",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du tag",
              example_value: "tag-react",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(50) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom du tag",
              example_value: "React",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(50) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "Slug URL du tag",
              example_value: "react",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "usage_count",
              type_general: "int",
              type_sql: "INTEGER DEFAULT 0",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0",
              description: "Nombre d'utilisations du tag",
              example_value: "25",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            }
          ]
        },
        // Comments table
        {
          id: crypto.randomUUID(),
          name: "comments",
          description: "Commentaires des lecteurs sur les articles",
          category: "Interaction",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du commentaire",
              example_value: "comment-123",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "article_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES articles(id) ON DELETE CASCADE",
              required: true,
              unique: false,
              primary_key: false,
              foreign_key: "articles(id)",
              relation_cardinality: "1-N",
              description: "Article commenté",
              example_value: "article-123",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "author_name",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom de l'auteur du commentaire",
              example_value: "Jean Leclair",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "author_email",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Email de l'auteur du commentaire",
              example_value: "jean@example.com",
              slug_compatible: false,
              acf_field_type: "email",
              ui_component: "input"
            },
            {
              name: "content",
              type_general: "text",
              type_sql: "TEXT NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Contenu du commentaire",
              example_value: "Excellent article ! Merci pour ces explications claires.",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "approved",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT FALSE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "FALSE",
              description: "Commentaire approuvé par modération",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            },
            {
              name: "created_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
              required: true,
              unique: false,
              primary_key: false,
              default_sql: "NOW()",
              description: "Date de création du commentaire",
              example_value: "2024-01-15T10:30:00Z",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            }
          ]
        },
        // Newsletter subscribers
        {
          id: crypto.randomUUID(),
          name: "newsletter_subscribers",
          description: "Abonnés à la newsletter",
          category: "Marketing",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de l'abonné",
              example_value: "subscriber-123",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "email",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "Email de l'abonné",
              example_value: "subscriber@example.com",
              slug_compatible: false,
              acf_field_type: "email",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(255)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Nom de l'abonné",
              example_value: "Sophie Martin",
              slug_compatible: false,
              acf_field_type: "text",
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
              description: "Abonnement actif",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            },
            {
              name: "subscribed_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
              required: true,
              unique: false,
              primary_key: false,
              default_sql: "NOW()",
              description: "Date d'abonnement",
              example_value: "2024-01-15T10:30:00Z",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            }
          ]
        }
      ]
    },
    {
      name: "E-commerce Complet",
      description: "Boutique en ligne complète avec produits, commandes, clients, inventaire et marketing",
      version: "2.0.0",
      tables: [
        // Products table (enhanced)
        {
          id: crypto.randomUUID(),
          name: "products",
          description: "Catalogue de produits avec variantes et inventaire",
          category: "Commerce Principal",
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
              example_value: "T-shirt Bio Coton Organic",
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
              example_value: "t-shirt-bio-coton-organic",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "sku",
              type_general: "string",
              type_sql: "VARCHAR(50) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "Code produit (SKU)",
              example_value: "TSH-BIO-001",
              slug_compatible: false,
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
              example_value: "T-shirt en coton bio 100% certifié GOTS...",
              slug_compatible: false,
              acf_field_type: "wysiwyg",
              ui_component: "textarea"
            },
            {
              name: "short_description",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description courte pour les listes",
              example_value: "T-shirt éco-responsable en coton bio",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "price",
              type_general: "float",
              type_sql: "DECIMAL(10,2) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Prix de vente en euros",
              example_value: "29.99",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "sale_price",
              type_general: "float",
              type_sql: "DECIMAL(10,2)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Prix promotionnel",
              example_value: "24.99",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "cost_price",
              type_general: "float",
              type_sql: "DECIMAL(10,2)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Prix de revient",
              example_value: "12.50",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "stock_quantity",
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
              name: "low_stock_threshold",
              type_general: "int",
              type_sql: "INTEGER DEFAULT 5",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "5",
              description: "Seuil d'alerte stock faible",
              example_value: "10",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "weight",
              type_general: "float",
              type_sql: "DECIMAL(8,3)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Poids en kg pour frais de port",
              example_value: "0.150",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "dimensions",
              type_general: "json",
              type_sql: "JSONB",
              required: false,
              unique: false,
              primary_key: false,
              description: "Dimensions (L x l x h) en cm",
              example_value: '{"length": 30, "width": 20, "height": 2}',
              slug_compatible: false,
              acf_field_type: "text",
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
              relation_cardinality: "1-N",
              description: "Catégorie du produit",
              example_value: "vetements",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "brand_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES brands(id)",
              required: false,
              unique: false,
              primary_key: false,
              foreign_key: "brands(id)",
              relation_cardinality: "1-N",
              description: "Marque du produit",
              example_value: "eco-fashion",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "meta_title",
              type_general: "string",
              type_sql: "VARCHAR(60)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Titre SEO",
              example_value: "T-shirt Bio Coton | Mode Éthique",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "meta_description",
              type_general: "string",
              type_sql: "VARCHAR(160)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Description SEO",
              example_value: "T-shirt éco-responsable en coton bio certifié GOTS. Confort et style durable.",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "tags",
              type_general: "json",
              type_sql: "JSONB",
              required: false,
              unique: false,
              primary_key: false,
              description: "Tags produit pour filtres",
              example_value: '["bio", "coton", "éthique", "unisexe"]',
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
              description: "Produit mis en avant",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
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
            }
          ]
        },
        // Product Categories
        {
          id: crypto.randomUUID(),
          name: "product_categories",
          description: "Catégories de produits hiérarchiques",
          category: "Commerce Principal",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de la catégorie",
              example_value: "cat-vetements",
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
              description: "Nom de la catégorie",
              example_value: "Vêtements",
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
              description: "URL de la catégorie",
              example_value: "vetements",
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
              example_value: "Collection complète de vêtements éthiques et durables",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "parent_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES product_categories(id)",
              required: false,
              unique: false,
              primary_key: false,
              foreign_key: "product_categories(id)",
              relation_cardinality: "1-N",
              description: "Catégorie parente",
              example_value: "cat-mode",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "image",
              type_general: "image",
              type_sql: "VARCHAR(500)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Image de la catégorie",
              example_value: "/images/categories/vetements.jpg",
              slug_compatible: false,
              acf_field_type: "image",
              ui_component: "image-picker"
            },
            {
              name: "sort_order",
              type_general: "int",
              type_sql: "INTEGER DEFAULT 0",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0",
              description: "Ordre d'affichage",
              example_value: "1",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            }
          ]
        },
        // Customers
        {
          id: crypto.randomUUID(),
          name: "customers",
          description: "Base de données clients avec historique",
          category: "Clients",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du client",
              example_value: "cust-12345",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "email",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "Email du client",
              example_value: "client@example.com",
              slug_compatible: false,
              acf_field_type: "email",
              ui_component: "input"
            },
            {
              name: "first_name",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Prénom du client",
              example_value: "Marie",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "last_name",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom de famille du client",
              example_value: "Dupont",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "phone",
              type_general: "string",
              type_sql: "VARCHAR(20)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Numéro de téléphone",
              example_value: "06 12 34 56 78",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "birth_date",
              type_general: "datetime",
              type_sql: "DATE",
              required: false,
              unique: false,
              primary_key: false,
              description: "Date de naissance",
              example_value: "1990-05-15",
              slug_compatible: false,
              acf_field_type: "date_picker",
              ui_component: "datepicker"
            },
            {
              name: "total_spent",
              type_general: "float",
              type_sql: "DECIMAL(10,2) DEFAULT 0.00",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0.00",
              description: "Total des achats",
              example_value: "456.78",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "orders_count",
              type_general: "int",
              type_sql: "INTEGER DEFAULT 0",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0",
              description: "Nombre de commandes",
              example_value: "12",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "newsletter_subscribed",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT FALSE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "FALSE",
              description: "Abonné newsletter",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            },
            {
              name: "customer_group",
              type_general: "enum",
              type_sql: "VARCHAR(20) CHECK (customer_group IN ('standard', 'premium', 'vip')) DEFAULT 'standard'",
              enum_values: ["standard", "premium", "vip"],
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "'standard'",
              description: "Groupe client pour tarification",
              example_value: "premium",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "select"
            },
            {
              name: "notes",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Notes internes sur le client",
              example_value: "Client fidèle, préfère les produits bio",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "active",
              type_general: "bool",
              type_sql: "BOOLEAN DEFAULT TRUE",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "TRUE",
              description: "Compte client actif",
              example_value: "true",
              slug_compatible: false,
              acf_field_type: "true_false",
              ui_component: "toggle"
            },
            {
              name: "created_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
              required: true,
              unique: false,
              primary_key: false,
              default_sql: "NOW()",
              description: "Date d'inscription",
              example_value: "2024-01-15T10:30:00Z",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            }
          ]
        },
        // Orders
        {
          id: crypto.randomUUID(),
          name: "orders",
          description: "Commandes clients avec statuts détaillés",
          category: "Commandes",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de la commande",
              example_value: "order-12345",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "order_number",
              type_general: "string",
              type_sql: "VARCHAR(50) UNIQUE NOT NULL",
              required: true,
              unique: true,
              primary_key: false,
              description: "Numéro de commande public",
              example_value: "CMD-2024-001234",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "customer_id",
              type_general: "relation",
              type_sql: "UUID REFERENCES customers(id)",
              required: true,
              unique: false,
              primary_key: false,
              foreign_key: "customers(id)",
              relation_cardinality: "1-N",
              description: "Client qui a passé la commande",
              example_value: "cust-12345",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "relation-picker"
            },
            {
              name: "status",
              type_general: "enum",
              type_sql: "VARCHAR(20) CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')) DEFAULT 'pending'",
              enum_values: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
              required: true,
              unique: false,
              primary_key: false,
              default_sql: "'pending'",
              description: "Statut de la commande",
              example_value: "processing",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "select"
            },
            {
              name: "subtotal",
              type_general: "float",
              type_sql: "DECIMAL(10,2) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Sous-total HT",
              example_value: "89.97",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "tax_amount",
              type_general: "float",
              type_sql: "DECIMAL(10,2) DEFAULT 0.00",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0.00",
              description: "Montant de la TVA",
              example_value: "17.99",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "shipping_amount",
              type_general: "float",
              type_sql: "DECIMAL(10,2) DEFAULT 0.00",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0.00",
              description: "Frais de livraison",
              example_value: "5.90",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "discount_amount",
              type_general: "float",
              type_sql: "DECIMAL(10,2) DEFAULT 0.00",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "0.00",
              description: "Montant de la remise",
              example_value: "10.00",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "total_amount",
              type_general: "float",
              type_sql: "DECIMAL(10,2) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Total TTC final",
              example_value: "103.86",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "currency",
              type_general: "string",
              type_sql: "VARCHAR(3) DEFAULT 'EUR'",
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "'EUR'",
              description: "Devise",
              example_value: "EUR",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "payment_method",
              type_general: "enum",
              type_sql: "VARCHAR(20) CHECK (payment_method IN ('card', 'paypal', 'bank_transfer', 'check', 'cash'))",
              enum_values: ["card", "paypal", "bank_transfer", "check", "cash"],
              required: false,
              unique: false,
              primary_key: false,
              description: "Méthode de paiement",
              example_value: "card",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "select"
            },
            {
              name: "payment_status",
              type_general: "enum",
              type_sql: "VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')) DEFAULT 'pending'",
              enum_values: ["pending", "paid", "failed", "refunded", "partially_refunded"],
              required: false,
              unique: false,
              primary_key: false,
              default_sql: "'pending'",
              description: "Statut du paiement",
              example_value: "paid",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "select"
            },
            {
              name: "billing_address",
              type_general: "json",
              type_sql: "JSONB",
              required: false,
              unique: false,
              primary_key: false,
              description: "Adresse de facturation",
              example_value: '{"name": "Marie Dupont", "address": "123 Rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}',
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "shipping_address",
              type_general: "json",
              type_sql: "JSONB",
              required: false,
              unique: false,
              primary_key: false,
              description: "Adresse de livraison",
              example_value: '{"name": "Marie Dupont", "address": "123 Rue de la Paix", "city": "Paris", "postal_code": "75001", "country": "France"}',
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "notes",
              type_general: "text",
              type_sql: "TEXT",
              required: false,
              unique: false,
              primary_key: false,
              description: "Notes de commande",
              example_value: "Livraison en point relais demandée",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            },
            {
              name: "tracking_number",
              type_general: "string",
              type_sql: "VARCHAR(100)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Numéro de suivi livraison",
              example_value: "COL123456789FR",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "shipped_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE",
              required: false,
              unique: false,
              primary_key: false,
              description: "Date d'expédition",
              example_value: "2024-01-17T14:30:00Z",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            },
            {
              name: "delivered_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE",
              required: false,
              unique: false,
              primary_key: false,
              description: "Date de livraison",
              example_value: "2024-01-19T16:45:00Z",
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
              description: "Date de la commande",
              example_value: "2024-01-15T10:30:00Z",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
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
    "Blog Personnel Complet": BookOpen,
    "E-commerce Complet": ShoppingCart,
    "Plateforme Formation Complète": GraduationCap,
    "Services Professionnels": Briefcase,
    "Annuaire Professionnel": Building,
    "Annuaire de Lieux": MapPin,
    "Réseau Social": Users,
    "Événements & Billetterie": Calendar,
    "Forum Communautaire": MessageSquare,
    "Site d'Avis": Star,
    "Site de Rencontres": Heart,
    "Portfolio Créatif": Camera
  };

  const handleApplyPreset = (preset: Schema) => {
    if (allowMultiple) {
      // Toggle preset selection
      if (onTogglePreset) {
        onTogglePreset(preset.name);
      }
    } else {
      // Direct application
      onApplyPreset(preset);
    }
  };

  const handleApplySelected = () => {
    if (selectedPresets.length === 0) return;
    
    // Merge selected presets
    const selectedPresetObjects = presets.filter(p => selectedPresets.includes(p.name));
    
    if (selectedPresetObjects.length === 1) {
      onApplyPreset(selectedPresetObjects[0]);
    } else {
      // Merge multiple presets
      const mergedSchema: Schema = {
        name: `Preset Combiné (${selectedPresets.join(', ')})`,
        description: `Schéma combiné de: ${selectedPresets.join(', ')}`,
        version: "1.0.0",
        tables: []
      };

      // Combine all tables from selected presets
      selectedPresetObjects.forEach(preset => {
        preset.tables.forEach(table => {
          // Check if table with same name already exists
          const existingTable = mergedSchema.tables.find(t => t.name === table.name);
          if (!existingTable) {
            mergedSchema.tables.push({
              ...table,
              id: crypto.randomUUID() // Generate new ID
            });
          }
        });
      });

      onApplyPreset(mergedSchema);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Presets de Schémas Ultra-Complets
        </h2>
        <p className="text-slate-600">
          Choisissez un ou plusieurs modèles pré-configurés pour démarrer rapidement votre projet
        </p>
        {allowMultiple && (
          <div className="mt-4">
            <Button 
              onClick={handleApplySelected}
              disabled={selectedPresets.length === 0}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Combiner {selectedPresets.length} preset{selectedPresets.length > 1 ? 's' : ''} sélectionné{selectedPresets.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {presets.map((preset, index) => {
          const IconComponent = presetIcons[preset.name as keyof typeof presetIcons] || BookOpen;
          const isSelected = selectedPresets.includes(preset.name);
          
          return (
            <Card 
              key={index} 
              className={`border-slate-200 hover:shadow-lg transition-all cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleApplyPreset(preset)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`bg-gradient-to-r p-2 rounded-lg ${
                    isSelected 
                      ? 'from-blue-100 to-indigo-100' 
                      : 'from-blue-100 to-indigo-100'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${
                      isSelected ? 'text-blue-700' : 'text-blue-600'
                    }`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    {preset.name}
                  </CardTitle>
                  {isSelected && allowMultiple && (
                    <Badge className="bg-blue-600 text-white">
                      Sélectionné
                    </Badge>
                  )}
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
                
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {preset.tables.map((table, tableIndex) => (
                    <div key={tableIndex} className="text-xs bg-slate-50 p-2 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{table.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {table.category}
                        </Badge>
                      </div>
                      <div className="text-slate-500 mt-1">
                        {table.fields.length} champs • {table.description}
                      </div>
                    </div>
                  ))}
                </div>
                
                {!allowMultiple && (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyPreset(preset);
                    }}
                  >
                    Utiliser ce preset
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
