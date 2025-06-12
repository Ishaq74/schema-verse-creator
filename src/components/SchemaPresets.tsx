
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
  BookOpen, CreditCard, Image, Mail
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
    }
  ];

  const categories = ['Tous', ...Array.from(new Set(presets.map(p => p.category)))];

  const filteredPresets = presets.filter(preset => {
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

  const applyCombinedPresets = () => {
    if (selectedPresets.length === 0) return;

    const selectedSchemas = presets.filter(p => selectedPresets.includes(p.name));
    const combinedSchema: Schema = {
      name: `Schéma Combiné (${selectedPresets.length} presets)`,
      description: `Combinaison de: ${selectedPresets.join(', ')}`,
      version: '1.0.0',
      tables: selectedSchemas.flatMap(s => s.schema.tables)
    };

    onApplyPreset(combinedSchema);
  };

  return (
    <div className="space-y-6">
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
