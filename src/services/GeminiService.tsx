import { Table, Field, Schema } from '@/types/schema';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface GeminiSuggestion {
  type: 'field' | 'table' | 'relationship' | 'optimization';
  title: string;
  description: string;
  implementation: any;
  confidence: number;
}

export class GeminiService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-2.0-flash-exp';
  }

  async analyzeSchema(schema: Schema): Promise<GeminiSuggestion[]> {
    const prompt = this.createAnalysisPrompt(schema);
    
    try {
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error response:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response from Gemini API');
      }

      return this.parseSuggestions(generatedText);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async improveTable(table: Table): Promise<Table> {
    const prompt = this.createImprovementPrompt(table);
    
    try {
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error response:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response from Gemini API');
      }

      return this.parseImprovedTable(generatedText, table);
    } catch (error) {
      console.error('Error improving table with Gemini:', error);
      throw error;
    }
  }

  async generateMissingFields(table: Table, context: string): Promise<Field[]> {
    const prompt = this.createFieldGenerationPrompt(table, context);
    
    try {
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3072,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error response:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response from Gemini API');
      }

      return this.parseGeneratedFields(generatedText);
    } catch (error) {
      console.error('Error generating fields with Gemini:', error);
      throw error;
    }
  }

  async generateSampleData(table: Table, rowCount: number = 5, context: string = ''): Promise<any[]> {
    const prompt = this.createDataGenerationPrompt(table, rowCount, context);
    
    try {
      const response = await fetch(`${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Gemini API error response:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response from Gemini API');
      }

      return this.parseSampleData(generatedText);
    } catch (error) {
      console.error('Error generating sample data with Gemini:', error);
      throw error;
    }
  }

  private createAnalysisPrompt(schema: Schema): string {
    return `
Analyse ce schéma de base de données et propose des améliorations structurelles :

SCHÉMA ACTUEL :
${JSON.stringify(schema, null, 2)}

INSTRUCTIONS :
- Identifie les champs manquants essentiels
- Détecte les incohérences dans les types et contraintes
- Propose des optimisations d'index et de relations
- Suggère des améliorations pour le SEO et l'UX
- Vérifie la conformité aux bonnes pratiques SQL et web

RETOURNE TA RÉPONSE AU FORMAT JSON :
{
  "suggestions": [
    {
      "type": "field|table|relationship|optimization",
      "title": "Titre court de la suggestion",
      "description": "Description détaillée",
      "implementation": {
        "tableId": "id_table",
        "field": {...}
      },
      "confidence": 0.9
    }
  ]
}
`;
  }

  private createImprovementPrompt(table: Table): string {
    return `
Améliore cette table de base de données en ajoutant les champs manquants essentiels et en optimisant la structure :

TABLE ACTUELLE :
${JSON.stringify(table, null, 2)}

INSTRUCTIONS :
- Ajoute les champs standards manquants (id, created_at, updated_at si nécessaire)
- Optimise les types SQL et contraintes
- Améliore les descriptions et exemples
- Ajoute des champs utiles pour le contexte métier
- Assure la cohérence des noms et types
- Optimise pour le SEO (slugs, meta) et l'UX

RETOURNE LA TABLE AMÉLIORÉE AU FORMAT JSON EXACT :
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "fields": [
    {
      "name": "string",
      "type_general": "string",
      "type_sql": "string",
      "required": true,
      "unique": false,
      "primary_key": false,
      "description": "string",
      "example_value": "string",
      "slug_compatible": false,
      "acf_field_type": "string",
      "ui_component": "string"
    }
  ]
}
`;
  }

  private createFieldGenerationPrompt(table: Table, context: string): string {
    return `
Génère des champs additionnels pertinents pour cette table dans le contexte : "${context}"

TABLE EXISTANTE :
${JSON.stringify(table, null, 2)}

CONTEXTE : ${context}

INSTRUCTIONS :
- Génère 3-7 champs complémentaires utiles
- Respecte le contexte métier
- Utilise des types appropriés
- Inclus des exemples réalistes
- Optimise pour l'usage web (Astro, WordPress, Supabase)

RETOURNE UNIQUEMENT UN ARRAY JSON DE CHAMPS :
[
  {
    "name": "nom_champ",
    "type_general": "string",
    "type_sql": "VARCHAR(255)",
    "required": false,
    "unique": false,
    "primary_key": false,
    "description": "description claire",
    "example_value": "exemple concret",
    "slug_compatible": false,
    "acf_field_type": "text",
    "ui_component": "input"
  }
]
`;
  }

  private createDataGenerationPrompt(table: Table, rowCount: number, context: string): string {
    return `
Génère ${rowCount} lignes de données d'exemple réalistes et cohérentes pour cette table :

TABLE : ${table.name}
DESCRIPTION : ${table.description}
CONTEXTE : ${context}

STRUCTURE :
${JSON.stringify(table.fields.map(f => ({
  name: f.name,
  type: f.type_general,
  description: f.description,
  example: f.example_value,
  required: f.required
})), null, 2)}

INSTRUCTIONS :
- Génère des données réalistes et variées
- Respecte les contraintes (required, unique, etc.)
- Utilise des valeurs cohérentes avec le contexte
- Assure la cohérence entre les champs liés
- Utilise des formats appropriés (emails valides, URLs, dates, etc.)
- Pour les relations, utilise des IDs existants ou réalistes

RETOURNE UNIQUEMENT UN ARRAY JSON :
[
  {
    "field1": "valeur1",
    "field2": "valeur2"
  }
]
`;
  }

  private parseSuggestions(text: string): GeminiSuggestion[] {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in Gemini response');
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    } catch (error) {
      console.error('Error parsing Gemini suggestions:', error);
      return [];
    }
  }

  private parseImprovedTable(text: string, originalTable: Table): Table {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in Gemini response, returning original table');
        return originalTable;
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!parsed.fields || !Array.isArray(parsed.fields)) {
        console.warn('Invalid table structure from Gemini, returning original');
        return originalTable;
      }

      return {
        id: originalTable.id,
        name: parsed.name || originalTable.name,
        description: parsed.description || originalTable.description,
        category: parsed.category || originalTable.category,
        fields: parsed.fields.map((field: any) => ({
          name: field.name || '',
          type_general: field.type_general || 'string',
          type_sql: field.type_sql || 'VARCHAR(255)',
          required: Boolean(field.required),
          unique: Boolean(field.unique),
          primary_key: Boolean(field.primary_key),
          description: field.description || '',
          example_value: field.example_value || '',
          slug_compatible: Boolean(field.slug_compatible),
          acf_field_type: field.acf_field_type || 'text',
          ui_component: field.ui_component || 'input'
        }))
      };
    } catch (error) {
      console.error('Error parsing improved table:', error);
      return originalTable;
    }
  }

  private parseGeneratedFields(text: string): Field[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON array found in Gemini response');
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(parsed)) {
        console.warn('Parsed result is not an array');
        return [];
      }

      return parsed.filter(field => field.name && field.type_general && field.description)
                   .map(field => ({
                     name: field.name,
                     type_general: field.type_general as Field['type_general'],
                     type_sql: field.type_sql || 'VARCHAR(255)',
                     required: Boolean(field.required),
                     unique: Boolean(field.unique),
                     primary_key: Boolean(field.primary_key),
                     description: field.description,
                     example_value: field.example_value || '',
                     slug_compatible: Boolean(field.slug_compatible),
                     acf_field_type: field.acf_field_type || 'text',
                     ui_component: field.ui_component as Field['ui_component'] || 'input'
                   }));
    } catch (error) {
      console.error('Error parsing generated fields:', error);
      return [];
    }
  }

  private parseSampleData(text: string): any[] {
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON array found in Gemini response');
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing sample data:', error);
      return [];
    }
  }
}
