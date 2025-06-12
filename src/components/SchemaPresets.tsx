import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Database, Users, ShoppingCart, FileText, 
  Building, Heart, Calendar, MessageSquare,
  Layers, Combine
} from 'lucide-react';
import { Schema, Table, Field } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';

interface SchemaPresetsProps {
  onApplyPreset: (schema: Schema) => void;
  selectedPresets: string[];
  onTogglePreset: (presetName: string) => void;
  allowMultiple: boolean;
}

export const SchemaPresets: React.FC<SchemaPresetsProps> = ({
  onApplyPreset,
  selectedPresets,
  onTogglePreset,
  allowMultiple
}) => {
  const { toast } = useToast();

  const presets: { [key: string]: Schema } = {
    "E-commerce Complet": {
      name: "E-commerce Complet",
      description: "Système e-commerce avec gestion produits, commandes, utilisateurs",
      version: "2.0.0",
      tables: [
        {
          id: "users-ecom",
          name: "users",
          description: "Utilisateurs de la plateforme e-commerce",
          category: "Authentification",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de l'utilisateur",
              example_value: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
              category: "Identifiant",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "email",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL UNIQUE",
              required: true,
              unique: true,
              primary_key: false,
              description: "Email de l'utilisateur",
              example_value: "jean.dupont@example.com",
              category: "Contact",
              slug_compatible: false,
              acf_field_type: "email",
              ui_component: "input"
            },
            {
              name: "first_name",
              type_general: "string",
              type_sql: "VARCHAR(100) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Prénom de l'utilisateur",
              example_value: "Jean",
              category: "Identité",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "last_name",
              type_general: "string",
              type_sql: "VARCHAR(100) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom de famille de l'utilisateur",
              example_value: "Dupont",
              category: "Identité",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "created_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
              required: true,
              unique: false,
              primary_key: false,
              description: "Date de création du compte",
              example_value: "2024-01-15T10:30:00Z",
              category: "Métadonnées",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            }
          ]
        },
        {
          id: "products-ecom",
          name: "products",
          description: "Catalogue de produits",
          category: "Catalogue",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du produit",
              example_value: "a12bc34d-5678-9def-0123-456789abcdef",
              category: "Identifiant",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(200) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom du produit",
              example_value: "iPhone 15 Pro",
              category: "Contenu",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(200) NOT NULL UNIQUE",
              required: true,
              unique: true,
              primary_key: false,
              description: "URL-friendly identifier",
              example_value: "iphone-15-pro",
              category: "SEO",
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
              example_value: "Le dernier iPhone avec puce A17 Pro",
              category: "Contenu",
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
              description: "Prix du produit en euros",
              example_value: "1199.99",
              category: "Commerce",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            },
            {
              name: "category_id",
              type_general: "relation",
              type_sql: "UUID",
              foreign_key: "categories(id)",
              relation_cardinality: "1-N",
              required: true,
              unique: false,
              primary_key: false,
              description: "Catégorie du produit",
              example_value: "electronics-123",
              category: "Classification",
              slug_compatible: false,
              acf_field_type: "relationship",
              ui_component: "relation-picker"
            }
          ]
        }
      ]
    },

    "Blog Personnel": {
      name: "Blog Personnel",
      description: "Structure complète pour un blog avec articles, commentaires, tags",
      version: "2.0.0",
      tables: [
        {
          id: "posts-blog",
          name: "posts",
          description: "Articles du blog",
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
              example_value: "b23cd45e-6789-0abc-1234-567890bcdefg",
              category: "Identifiant",
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
              example_value: "Les tendances web 2024",
              category: "Contenu",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "slug",
              type_general: "string",
              type_sql: "VARCHAR(255) NOT NULL UNIQUE",
              required: true,
              unique: true,
              primary_key: false,
              description: "URL de l'article",
              example_value: "tendances-web-2024",
              category: "SEO",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "content",
              type_general: "text",
              type_sql: "TEXT NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Contenu de l'article en markdown",
              example_value: "# Introduction\n\nLes tendances web évoluent...",
              category: "Contenu",
              slug_compatible: false,
              acf_field_type: "wysiwyg",
              ui_component: "textarea"
            },
            {
              name: "status",
              type_general: "enum",
              type_sql: "VARCHAR(20) DEFAULT 'draft'",
              enum_values: ["draft", "published", "archived"],
              required: true,
              unique: false,
              primary_key: false,
              description: "Statut de publication",
              example_value: "published",
              category: "Workflow",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "select"
            },
            {
              name: "published_at",
              type_general: "datetime",
              type_sql: "TIMESTAMP WITH TIME ZONE",
              required: false,
              unique: false,
              primary_key: false,
              description: "Date de publication",
              example_value: "2024-01-15T14:30:00Z",
              category: "Métadonnées",
              slug_compatible: false,
              acf_field_type: "date_time_picker",
              ui_component: "datepicker"
            }
          ]
        },
        {
          id: "comments-blog",
          name: "comments",
          description: "Commentaires sur les articles",
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
              example_value: "c34de56f-7890-1bcd-2345-678901cdefgh",
              category: "Identifiant",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "post_id",
              type_general: "relation",
              type_sql: "UUID NOT NULL",
              foreign_key: "posts(id)",
              relation_cardinality: "1-N",
              required: true,
              unique: false,
              primary_key: false,
              description: "Article commenté",
              example_value: "b23cd45e-6789-0abc-1234-567890bcdefg",
              category: "Relation",
              slug_compatible: false,
              acf_field_type: "relationship",
              ui_component: "relation-picker"
            },
            {
              name: "author_name",
              type_general: "string",
              type_sql: "VARCHAR(100) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom de l'auteur du commentaire",
              example_value: "Marie Martin",
              category: "Identité",
              slug_compatible: false,
              acf_field_type: "text",
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
              example_value: "Excellent article, très informatif !",
              category: "Contenu",
              slug_compatible: false,
              acf_field_type: "textarea",
              ui_component: "textarea"
            }
          ]
        }
      ]
    },

    "CRM Entreprise": {
      name: "CRM Entreprise",
      description: "Système de gestion relation client avec contacts, entreprises, opportunités",
      version: "2.0.0",
      tables: [
        {
          id: "companies-crm",
          name: "companies",
          description: "Entreprises clientes",
          category: "CRM",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique de l'entreprise",
              example_value: "d45ef67g-8901-2cde-3456-789012defghi",
              category: "Identifiant",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "name",
              type_general: "string",
              type_sql: "VARCHAR(200) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom de l'entreprise",
              example_value: "TechCorp Solutions",
              category: "Identité",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "industry",
              type_general: "enum",
              type_sql: "VARCHAR(50)",
              enum_values: ["technology", "finance", "healthcare", "education", "retail", "manufacturing"],
              required: false,
              unique: false,
              primary_key: false,
              description: "Secteur d'activité",
              example_value: "technology",
              category: "Classification",
              slug_compatible: false,
              acf_field_type: "select",
              ui_component: "select"
            },
            {
              name: "website",
              type_general: "string",
              type_sql: "VARCHAR(255)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Site web de l'entreprise",
              example_value: "https://techcorp.com",
              category: "Contact",
              slug_compatible: false,
              acf_field_type: "url",
              ui_component: "input"
            },
            {
              name: "annual_revenue",
              type_general: "float",
              type_sql: "DECIMAL(15,2)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Chiffre d'affaires annuel",
              example_value: "2500000.00",
              category: "Financier",
              slug_compatible: false,
              acf_field_type: "number",
              ui_component: "input"
            }
          ]
        },
        {
          id: "contacts-crm",
          name: "contacts",
          description: "Contacts individuels",
          category: "CRM",
          fields: [
            {
              name: "id",
              type_general: "uuid",
              type_sql: "UUID PRIMARY KEY DEFAULT gen_random_uuid()",
              required: true,
              unique: true,
              primary_key: true,
              description: "Identifiant unique du contact",
              example_value: "e56fg78h-9012-3def-4567-890123efghij",
              category: "Identifiant",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "company_id",
              type_general: "relation",
              type_sql: "UUID",
              foreign_key: "companies(id)",
              relation_cardinality: "1-N",
              required: false,
              unique: false,
              primary_key: false,
              description: "Entreprise du contact",
              example_value: "d45ef67g-8901-2cde-3456-789012defghi",
              category: "Relation",
              slug_compatible: false,
              acf_field_type: "relationship",
              ui_component: "relation-picker"
            },
            {
              name: "first_name",
              type_general: "string",
              type_sql: "VARCHAR(100) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Prénom du contact",
              example_value: "Sophie",
              category: "Identité",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "last_name",
              type_general: "string",
              type_sql: "VARCHAR(100) NOT NULL",
              required: true,
              unique: false,
              primary_key: false,
              description: "Nom du contact",
              example_value: "Dubois",
              category: "Identité",
              slug_compatible: true,
              acf_field_type: "text",
              ui_component: "input"
            },
            {
              name: "email",
              type_general: "string",
              type_sql: "VARCHAR(255) UNIQUE",
              required: false,
              unique: true,
              primary_key: false,
              description: "Email professionnel",
              example_value: "sophie.dubois@techcorp.com",
              category: "Contact",
              slug_compatible: false,
              acf_field_type: "email",
              ui_component: "input"
            },
            {
              name: "position",
              type_general: "string",
              type_sql: "VARCHAR(150)",
              required: false,
              unique: false,
              primary_key: false,
              description: "Poste occupé",
              example_value: "Directrice Marketing",
              category: "Professionnel",
              slug_compatible: false,
              acf_field_type: "text",
              ui_component: "input"
            }
          ]
        }
      ]
    }
  };

  const mergePresets = (presetNames: string[]): Schema => {
    
    const mergedTables: Table[] = [];
    let mergedName = "Schéma Combiné";
    let mergedDescription = "Combinaison de plusieurs presets: ";
    
    presetNames.forEach(presetName => {
      const preset = presets[presetName];
      if (preset) {
        mergedTables.push(...preset.tables);
        mergedDescription += `${presetName}, `;
      }
    });
    
    mergedDescription = mergedDescription.slice(0, -2); // Remove last comma
    
    return {
      name: mergedName,
      description: mergedDescription,
      version: "1.0.0",
      tables: mergedTables
    };
  };

  const handleApplyPreset = (presetName: string) => {
    if (allowMultiple) {
      onTogglePreset(presetName);
    } else {
      const preset = presets[presetName];
      if (preset) {
        onApplyPreset(preset);
      }
    }
  };

  const handleApplyMultiplePresets = () => {
    if (selectedPresets.length > 0) {
      const mergedSchema = mergePresets(selectedPresets);
      onApplyPreset(mergedSchema);
    }
  };

  const presetCategories = {
    "E-commerce": ["E-commerce Complet"],
    "Contenu": ["Blog Personnel"],
    "Business": ["CRM Entreprise"]
  };

  return (
    <div className="space-y-6">
      {allowMultiple && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Combine className="h-5 w-5" />
              Mode Combinaison Activé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-blue-600">
                Sélectionnez plusieurs presets pour les fusionner en un seul schéma.
              </p>
              {selectedPresets.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPresets.map(preset => (
                    <Badge key={preset} variant="secondary" className="bg-blue-100">
                      {preset}
                    </Badge>
                  ))}
                </div>
              )}
              <Button 
                onClick={handleApplyMultiplePresets}
                disabled={selectedPresets.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Layers className="h-4 w-4 mr-2" />
                Fusionner les Presets Sélectionnés ({selectedPresets.length})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {Object.entries(presetCategories).map(([category, presetNames]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {category === "E-commerce" && <ShoppingCart className="h-5 w-5 text-green-600" />}
            {category === "Contenu" && <FileText className="h-5 w-5 text-blue-600" />}
            {category === "Business" && <Building className="h-5 w-5 text-purple-600" />}
            {category}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {presetNames.map(presetName => {
              const preset = presets[presetName];
              const isSelected = selectedPresets.includes(presetName);
              
              return (
                <Card key={presetName} className={`transition-all cursor-pointer hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {presetName === "E-commerce Complet" && <ShoppingCart className="h-5 w-5 text-green-600" />}
                          {presetName === "Blog Personnel" && <FileText className="h-5 w-5 text-blue-600" />}
                          {presetName === "CRM Entreprise" && <Building className="h-5 w-5 text-purple-600" />}
                          {presetName}
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">
                          {preset.description}
                        </p>
                      </div>
                      {allowMultiple && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => onTogglePreset(presetName)}
                        />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Database className="h-3 w-3" />
                          {preset.tables.length} tables
                        </Badge>
                        <Badge variant="secondary">
                          v{preset.version}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-slate-700">Tables incluses:</p>
                        <div className="flex flex-wrap gap-1">
                          {preset.tables.map(table => (
                            <Badge key={table.id} variant="outline" className="text-xs">
                              {table.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <Button 
                        onClick={() => handleApplyPreset(presetName)}
                        className="w-full"
                        size="sm"
                        variant={allowMultiple ? "outline" : "default"}
                      >
                        {allowMultiple ? "Sélectionner" : "Appliquer"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
