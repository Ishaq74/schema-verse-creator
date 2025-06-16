
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Loader2 } from 'lucide-react';
import { Schema, Table, Field } from '@/types/schema';

interface AISchemaGeneratorProps {
  onGenerate: (schema: Schema) => void;
  onClose: () => void;
}

export default function AISchemaGenerator({ onGenerate, onClose }: AISchemaGeneratorProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions] = useState([
    "Application de e-commerce avec utilisateurs, produits, commandes et paiements",
    "Système de gestion de blog avec articles, commentaires et catégories",
    "Plateforme de réservation avec utilisateurs, établissements et créneaux",
    "CRM avec contacts, entreprises, opportunités et tâches",
    "Système de formation avec cours, modules, étudiants et évaluations"
  ]);

  const generateSchema = async () => {
    if (!description.trim()) return;
    
    setLoading(true);
    
    // Simulation d'une génération IA (à remplacer par un vrai service)
    setTimeout(() => {
      const mockSchema: Schema = {
        name: "Schéma Généré",
        description: description,
        version: "1.0.0",
        tables: generateMockTables(description)
      };
      
      onGenerate(mockSchema);
      setLoading(false);
    }, 2000);
  };

  const generateMockTables = (desc: string): Table[] => {
    // Logique simplifiée de génération basée sur les mots-clés
    const tables: Table[] = [];
    
    if (desc.toLowerCase().includes('utilisateur') || desc.toLowerCase().includes('user')) {
      tables.push({
        id: 'users',
        name: 'users',
        description: 'Table des utilisateurs',
        category: 'Authentication',
        fields: [
          { 
            name: 'id', 
            type_general: 'uuid', 
            type_sql: 'UUID', 
            required: true, 
            unique: true,
            primary_key: true, 
            description: 'Identifiant unique', 
            example_value: '', 
            slug_compatible: false, 
            acf_field_type: 'text', 
            ui_component: 'input' 
          },
          { 
            name: 'email', 
            type_general: 'string', 
            type_sql: 'VARCHAR(255)', 
            required: true, 
            unique: true, 
            primary_key: false,
            description: 'Email de connexion', 
            example_value: '', 
            slug_compatible: false, 
            acf_field_type: 'email', 
            ui_component: 'input' 
          },
          { 
            name: 'password', 
            type_general: 'string', 
            type_sql: 'VARCHAR(255)', 
            required: true, 
            unique: false,
            primary_key: false,
            description: 'Mot de passe hashé', 
            example_value: '', 
            slug_compatible: false, 
            acf_field_type: 'password', 
            ui_component: 'input' 
          },
          { 
            name: 'created_at', 
            type_general: 'datetime', 
            type_sql: 'TIMESTAMP', 
            required: true, 
            unique: false,
            primary_key: false,
            description: 'Date de création', 
            example_value: '', 
            slug_compatible: false, 
            acf_field_type: 'date_time_picker', 
            ui_component: 'input' 
          }
        ]
      });
    }

    if (desc.toLowerCase().includes('produit') || desc.toLowerCase().includes('product')) {
      tables.push({
        id: 'products',
        name: 'products',
        description: 'Table des produits',
        category: 'E-commerce',
        fields: [
          { 
            name: 'id', 
            type_general: 'uuid', 
            type_sql: 'UUID', 
            required: true, 
            unique: true,
            primary_key: true, 
            description: 'Identifiant unique', 
            example_value: '', 
            slug_compatible: false, 
            acf_field_type: 'text', 
            ui_component: 'input' 
          },
          { 
            name: 'name', 
            type_general: 'string', 
            type_sql: 'VARCHAR(255)', 
            required: true, 
            unique: false,
            primary_key: false,
            description: 'Nom du produit', 
            example_value: '', 
            slug_compatible: false, 
            acf_field_type: 'text', 
            ui_component: 'input' 
          },
          { 
            name: 'price', 
            type_general: 'float', 
            type_sql: 'DECIMAL(10,2)', 
            required: true, 
            unique: false,
            primary_key: false,
            description: 'Prix du produit', 
            example_value: '', 
            slug_compatible: false, 
            acf_field_type: 'number', 
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
            example_value: '', 
            slug_compatible: false, 
            acf_field_type: 'textarea', 
            ui_component: 'textarea' 
          }
        ]
      });
    }

    return tables;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Générateur de Schéma IA
        </CardTitle>
        <p className="text-sm text-slate-600">
          Décrivez votre projet et laissez l'IA créer un schéma de base de données adapté
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Description de votre projet
          </label>
          <Textarea
            placeholder="Décrivez votre application, ses fonctionnalités principales, les types de données que vous souhaitez gérer..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Suggestions d'exemples
          </label>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start h-auto p-3"
                onClick={() => setDescription(suggestion)}
              >
                <Badge variant="secondary" className="mr-2 shrink-0">Exemple</Badge>
                <span className="text-sm">{suggestion}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={generateSchema}
            disabled={!description.trim() || loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Génération...' : 'Générer le Schéma'}
          </Button>
          
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
