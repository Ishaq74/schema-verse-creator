
import { Table, Field, Schema } from '@/types/schema';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface GeminiSuggestion {
  type: 'field' | 'table' | 'relationship' | 'optimization' | 'content' | 'seo';
  title: string;
  description: string;
  implementation: any;
  confidence: number;
  category?: string;
  impact?: 'low' | 'medium' | 'high';
}

export interface ContentGenerationRequest {
  table: Table;
  recordCount: number;
  context: string;
  language?: string;
  style?: string;
}

export interface ContentGenerationResult {
  data: Record<string, any>[];
  metadata: {
    generated_count: number;
    context_applied: string;
    generation_time: string;
  };
}

export class GeminiService {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-2.0-flash-exp';
  }

  static saveApiKey(apiKey: string): void {
    localStorage.setItem('gemini-api-key', apiKey);
  }

  static getStoredApiKey(): string | null {
    return localStorage.getItem('gemini-api-key');
  }

  static clearStoredApiKey(): void {
    localStorage.removeItem('gemini-api-key');
  }

  async analyzeSchema(schema: Schema): Promise<GeminiSuggestion[]> {
    const prompt = this.createAnalysisPrompt(schema);
    
    try {
      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.3,
        maxOutputTokens: 3072,
      });

      return this.parseSuggestions(response);
    } catch (error) {
      console.error('Error calling Gemini API for schema analysis:', error);
      throw error;
    }
  }

  async improveTable(table: Table): Promise<Table> {
    const prompt = this.createImprovementPrompt(table);
    
    try {
      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.2,
        maxOutputTokens: 4096,
      });

      return this.parseImprovedTable(response, table);
    } catch (error) {
      console.error('Error improving table with Gemini:', error);
      throw error;
    }
  }

  async generateMissingFields(table: Table, context: string): Promise<Field[]> {
    const prompt = this.createFieldGenerationPrompt(table, context);
    
    try {
      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.4,
        maxOutputTokens: 3072,
      });

      return this.parseGeneratedFields(response);
    } catch (error) {
      console.error('Error generating fields with Gemini:', error);
      throw error;
    }
  }

  async generateSampleData(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
    const prompt = this.createDataGenerationPrompt(request);
    
    try {
      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.6,
        maxOutputTokens: 4096,
      });

      return this.parseGeneratedData(response, request);
    } catch (error) {
      console.error('Error generating sample data with Gemini:', error);
      throw error;
    }
  }

  async optimizeForSEO(table: Table, targetKeywords: string[]): Promise<GeminiSuggestion[]> {
    const prompt = this.createSEOOptimizationPrompt(table, targetKeywords);
    
    try {
      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.3,
        maxOutputTokens: 2048,
      });

      return this.parseSuggestions(response);
    } catch (error) {
      console.error('Error generating SEO optimizations:', error);
      throw error;
    }
  }

  async validateSchema(schema: Schema): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: GeminiSuggestion[];
  }> {
    const prompt = this.createValidationPrompt(schema);
    
    try {
      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.1,
        maxOutputTokens: 2048,
      });

      return this.parseValidationResult(response);
    } catch (error) {
      console.error('Error validating schema:', error);
      throw error;
    }
  }

  async generateDocumentation(schema: Schema): Promise<string> {
    const prompt = this.createDocumentationPrompt(schema);
    
    try {
      const response = await this.callGeminiAPI(prompt, {
        temperature: 0.3,
        maxOutputTokens: 4096,
      });

      return this.parseDocumentation(response);
    } catch (error) {
      console.error('Error generating documentation:', error);
      throw error;
    }
  }

  private async callGeminiAPI(prompt: string, config: {
    temperature?: number;
    maxOutputTokens?: number;
  }): Promise<string> {
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
          temperature: config.temperature || 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: config.maxOutputTokens || 2048,
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

    return generatedText;
  }

  private createAnalysisPrompt(schema: Schema): string {
    return `
Tu es un expert en conception de bases de données et développement web. Analyse ce schéma et propose des améliorations structurelles détaillées.

SCHÉMA ACTUEL :
${JSON.stringify(schema, null, 2)}

INSTRUCTIONS D'ANALYSE :
1. Identifie les champs manquants ESSENTIELS pour chaque table
2. Détecte les incohérences dans les types SQL et contraintes
3. Propose des optimisations d'index et de relations
4. Suggère des améliorations pour le SEO et l'UX
5. Vérifie la conformité aux bonnes pratiques SQL modernes
6. Identifie les opportunités d'amélioration des performances
7. Suggère des champs métier pertinents selon le contexte

CONTEXTE TECHNIQUE :
- Base de données : PostgreSQL/Supabase
- Frontend : React/Astro avec TypeScript
- CMS : WordPress avec ACF (Advanced Custom Fields)
- SEO : Optimisation pour moteurs de recherche
- Performance : Optimisation des requêtes et indexation

RETOURNE TA RÉPONSE AU FORMAT JSON STRICT :
{
  "suggestions": [
    {
      "type": "field|table|relationship|optimization|content|seo",
      "title": "Titre court et précis",
      "description": "Description détaillée de l'amélioration",
      "implementation": {
        "tableId": "nom_table",
        "field": {
          "name": "nom_champ",
          "type_general": "string",
          "type_sql": "VARCHAR(255)",
          "required": true,
          "description": "Description du champ",
          "example_value": "exemple concret"
        }
      },
      "confidence": 0.9,
      "category": "Performance|SEO|UX|Sécurité|Métier",
      "impact": "low|medium|high"
    }
  ]
}
`;
  }

  private createImprovementPrompt(table: Table): string {
    return `
Tu es un expert en conception de bases de données. Améliore cette table en profondeur pour qu'elle soit optimale.

TABLE ACTUELLE :
${JSON.stringify(table, null, 2)}

INSTRUCTIONS DÉTAILLÉES :
1. Ajoute TOUS les champs standards manquants essentiels
2. Optimise les types SQL pour PostgreSQL/Supabase
3. Améliore les descriptions et exemples pour qu'ils soient TRÈS détaillés
4. Ajoute des champs métier pertinents selon le contexte
5. Assure la cohérence des noms (snake_case pour SQL)
6. Optimise pour le SEO (slugs, meta descriptions, etc.)
7. Optimise pour l'UX (champs de tri, recherche, etc.)
8. Ajoute des champs pour l'audit et la traçabilité
9. Considère les bonnes pratiques de sécurité
10. Ajoute des contraintes et validations appropriées

CONTEXTE TECHNIQUE :
- PostgreSQL avec UUID par défaut
- ACF pour WordPress
- React/TypeScript pour le frontend
- Optimisation SEO requise
- Respect RGPD et bonnes pratiques

RETOURNE LA TABLE AMÉLIORÉE AU FORMAT JSON EXACT :
{
  "id": "string",
  "name": "string",
  "description": "string complète et détaillée",
  "category": "string",
  "fields": [
    {
      "name": "nom_champ_optimise",
      "type_general": "string",
      "type_sql": "VARCHAR(255) NOT NULL",
      "required": true,
      "unique": false,
      "primary_key": false,
      "default_sql": "valeur par défaut si applicable",
      "description": "description très détaillée du champ",
      "example_value": "exemple concret et réaliste",
      "slug_compatible": false,
      "acf_field_type": "text",
      "ui_component": "input",
      "category": "catégorie du champ",
      "notes": "notes techniques si nécessaire"
    }
  ]
}
`;
  }

  private createFieldGenerationPrompt(table: Table, context: string): string {
    return `
Génère des champs additionnels TRÈS UTILES et pertinents pour cette table dans le contexte spécifié.

TABLE EXISTANTE :
${JSON.stringify(table, null, 2)}

CONTEXTE PROJET : "${context}"

INSTRUCTIONS DÉTAILLÉES :
1. Génère 5-10 champs complémentaires UTILES (pas de champs inutiles)
2. Respecte parfaitement le contexte métier fourni
3. Utilise des types SQL optimaux pour PostgreSQL
4. Inclus des exemples TRÈS réalistes et pertinents
5. Optimise pour l'usage web moderne (Astro, WordPress, Supabase)
6. Considère les besoins SEO, UX, et performance
7. Ajoute des champs pour l'analytics et le tracking si pertinent
8. Pense aux fonctionnalités modernes (notifications, cache, etc.)
9. Assure-toi que chaque champ a une VRAIE valeur ajoutée
10. Utilise des noms de champs cohérents (snake_case)

TYPES PRIVILÉGIÉS :
- UUID pour les relations
- JSONB pour les données structurées
- TIMESTAMP WITH TIME ZONE pour les dates
- DECIMAL(10,2) pour les prix
- TEXT pour le contenu long
- VARCHAR avec tailles appropriées

RETOURNE UNIQUEMENT UN ARRAY JSON DE CHAMPS :
[
  {
    "name": "nom_champ_pertinent",
    "type_general": "string",
    "type_sql": "VARCHAR(255) NOT NULL",
    "required": false,
    "unique": false,
    "primary_key": false,
    "default_sql": "valeur par défaut si applicable",
    "description": "description claire et détaillée de l'utilité",
    "example_value": "exemple concret et contextualisé",
    "slug_compatible": false,
    "acf_field_type": "text",
    "ui_component": "input",
    "category": "catégorie appropriée",
    "notes": "justification de l'ajout de ce champ"
  }
]
`;
  }

  private createDataGenerationPrompt(request: ContentGenerationRequest): string {
    const { table, recordCount, context, language = 'fr', style = 'réaliste' } = request;
    
    return `
Génère ${recordCount} enregistrements de données RÉALISTES et COHÉRENTES pour cette table.

TABLE :
${JSON.stringify(table, null, 2)}

CONTEXTE : ${context}
LANGUE : ${language}
STYLE : ${style}

INSTRUCTIONS STRICTES :
1. Génère exactement ${recordCount} enregistrements
2. Les données doivent être COHÉRENTES entre elles
3. Respecte parfaitement le contexte "${context}"
4. Utilise des valeurs réalistes et crédibles
5. Assure-toi que les relations/clés étrangères soient cohérentes
6. Les UUID doivent être uniques et valides
7. Les dates doivent être logiques et récentes
8. Les prix/nombres doivent être réalistes
9. Le contenu textuel doit être de qualité et contextuel
10. Évite les doublons sur les champs uniques

FORMATS REQUIS :
- UUID : format standard RFC 4122
- Dates : ISO 8601 avec timezone
- Emails : valides et réalistes
- URLs : complètes et fonctionnelles
- JSON : valide et bien structuré

RETOURNE AU FORMAT JSON :
{
  "data": [
    {
      "champ1": "valeur1",
      "champ2": "valeur2",
      // ... tous les champs de la table
    }
  ],
  "metadata": {
    "generated_count": ${recordCount},
    "context_applied": "${context}",
    "generation_time": "timestamp ISO"
  }
}
`;
  }

  private createSEOOptimizationPrompt(table: Table, keywords: string[]): string {
    return `
Optimise cette table pour le SEO avec les mots-clés cibles fournis.

TABLE :
${JSON.stringify(table, null, 2)}

MOTS-CLÉS CIBLES : ${keywords.join(', ')}

INSTRUCTIONS SEO :
1. Suggère des champs SEO manquants essentiels
2. Optimise les champs existants pour le référencement
3. Propose des métadonnées structurées (Schema.org)
4. Suggère des optimisations pour les réseaux sociaux
5. Ajoute des champs pour l'analyse de performance SEO
6. Considère les Core Web Vitals et l'UX

RETOURNE DES SUGGESTIONS AU FORMAT JSON :
{
  "suggestions": [
    {
      "type": "seo",
      "title": "Titre de l'optimisation SEO",
      "description": "Description détaillée de l'impact SEO",
      "implementation": {
        "field": {
          "name": "nom_champ_seo",
          "description": "Description du champ SEO"
        }
      },
      "confidence": 0.9,
      "category": "SEO",
      "impact": "high"
    }
  ]
}
`;
  }

  private createValidationPrompt(schema: Schema): string {
    return `
Valide ce schéma de base de données et identifie les erreurs, avertissements et améliorations.

SCHÉMA :
${JSON.stringify(schema, null, 2)}

VALIDATION À EFFECTUER :
1. Vérifier la cohérence des types SQL
2. Valider les contraintes et relations
3. Identifier les problèmes de performance
4. Détecter les problèmes de sécurité
5. Vérifier les bonnes pratiques
6. Identifier les incohérences de nommage

RETOURNE AU FORMAT JSON :
{
  "isValid": true/false,
  "errors": ["erreur critique 1", "erreur critique 2"],
  "warnings": ["avertissement 1", "avertissement 2"],
  "suggestions": [
    {
      "type": "optimization",
      "title": "Amélioration suggérée",
      "description": "Description de l'amélioration",
      "confidence": 0.8,
      "impact": "medium"
    }
  ]
}
`;
  }

  private createDocumentationPrompt(schema: Schema): string {
    return `
Génère une documentation technique complète et professionnelle pour ce schéma de base de données.

SCHÉMA :
${JSON.stringify(schema, null, 2)}

LA DOCUMENTATION DOIT INCLURE :
1. Vue d'ensemble du schéma
2. Description détaillée de chaque table
3. Relations entre les tables
4. Contraintes et index recommandés
5. Exemples d'utilisation
6. Guide d'installation
7. Bonnes pratiques
8. FAQ technique

FORMAT : Markdown professionnel avec sections structurées
`;
  }

  private parseSuggestions(text: string): GeminiSuggestion[] {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn('No JSON found in Gemini response for suggestions');
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed.suggestions) ? parsed.suggestions.map(s => ({
        type: s.type || 'optimization',
        title: s.title || 'Suggestion',
        description: s.description || '',
        implementation: s.implementation || {},
        confidence: s.confidence || 0.5,
        category: s.category || 'Général',
        impact: s.impact || 'medium'
      })) : [];
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
          default_sql: field.default_sql,
          required: Boolean(field.required),
          unique: Boolean(field.unique),
          primary_key: Boolean(field.primary_key),
          foreign_key: field.foreign_key,
          relation_cardinality: field.relation_cardinality,
          enum_values: field.enum_values,
          description: field.description || '',
          example_value: field.example_value || '',
          category: field.category,
          notes: field.notes,
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
                     default_sql: field.default_sql,
                     required: Boolean(field.required),
                     unique: Boolean(field.unique),
                     primary_key: Boolean(field.primary_key),
                     foreign_key: field.foreign_key,
                     relation_cardinality: field.relation_cardinality,
                     enum_values: field.enum_values,
                     description: field.description,
                     example_value: field.example_value || '',
                     category: field.category,
                     notes: field.notes,
                     slug_compatible: Boolean(field.slug_compatible),
                     acf_field_type: field.acf_field_type || 'text',
                     ui_component: field.ui_component as Field['ui_component'] || 'input'
                   }));
    } catch (error) {
      console.error('Error parsing generated fields:', error);
      return [];
    }
  }

  private parseGeneratedData(text: string, request: ContentGenerationRequest): ContentGenerationResult {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        data: Array.isArray(parsed.data) ? parsed.data : [],
        metadata: {
          generated_count: parsed.metadata?.generated_count || 0,
          context_applied: parsed.metadata?.context_applied || request.context,
          generation_time: parsed.metadata?.generation_time || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error parsing generated data:', error);
      return {
        data: [],
        metadata: {
          generated_count: 0,
          context_applied: request.context,
          generation_time: new Date().toISOString()
        }
      };
    }
  }

  private parseValidationResult(text: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: GeminiSuggestion[];
  } {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in validation response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        isValid: Boolean(parsed.isValid),
        errors: Array.isArray(parsed.errors) ? parsed.errors : [],
        warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : []
      };
    } catch (error) {
      console.error('Error parsing validation result:', error);
      return {
        isValid: true,
        errors: [],
        warnings: [],
        suggestions: []
      };
    }
  }

  private parseDocumentation(text: string): string {
    // For documentation, we return the raw markdown text
    // Remove any JSON markers if present
    return text.replace(/```json|```markdown|```/g, '').trim();
  }
}
