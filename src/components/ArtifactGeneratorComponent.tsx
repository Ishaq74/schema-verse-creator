
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileCode, Database, FileText, Download, 
  Loader2, CheckCircle, AlertCircle, Settings 
} from 'lucide-react';
import { Schema, GeneratedArtifacts } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';

interface ArtifactGeneratorComponentProps {
  schema: Schema;
  onGenerate: (artifacts: GeneratedArtifacts) => void;
}

interface GenerationOptions {
  sql: boolean;
  astro_config: boolean;
  acf_json: boolean;
  csv_data: boolean;
  astro_page: boolean;
  documentation: boolean;
}

export const ArtifactGeneratorComponent: React.FC<ArtifactGeneratorComponentProps> = ({
  schema,
  onGenerate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<GenerationOptions>({
    sql: true,
    astro_config: true,
    acf_json: true,
    csv_data: true,
    astro_page: true,
    documentation: true
  });
  
  const { toast } = useToast();

  const generateSQL = (schema: Schema): string => {
    let sql = `-- Schéma SQL généré pour: ${schema.name}\n`;
    sql += `-- Version: ${schema.version}\n`;
    sql += `-- Description: ${schema.description}\n\n`;

    // Supprimer les tables existantes
    sql += `-- Suppression des tables existantes\n`;
    schema.tables.forEach(table => {
      sql += `DROP TABLE IF EXISTS ${table.name} CASCADE;\n`;
    });
    sql += '\n';

    // Créer les tables
    schema.tables.forEach(table => {
      sql += `-- Table: ${table.name}\n`;
      sql += `-- ${table.description}\n`;
      sql += `CREATE TABLE ${table.name} (\n`;
      
      const fieldDefinitions = table.fields.map(field => {
        let def = `  ${field.name} ${field.type_sql}`;
        if (field.required && !field.primary_key) def += ' NOT NULL';
        if (field.unique && !field.primary_key) def += ' UNIQUE';
        return def;
      });
      
      sql += fieldDefinitions.join(',\n');
      sql += '\n);\n\n';

      // Index et contraintes
      table.fields.forEach(field => {
        if (field.foreign_key) {
          const [refTable, refField] = field.foreign_key.split('.');
          sql += `ALTER TABLE ${table.name} ADD CONSTRAINT fk_${table.name}_${field.name} `;
          sql += `FOREIGN KEY (${field.name}) REFERENCES ${refTable}(${refField});\n`;
        }
      });
      sql += '\n';
    });

    return sql;
  };

  const generateAstroConfig = (schema: Schema): string => {
    return `// Configuration Astro pour ${schema.name}
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://yoursite.com',
  integrations: [
    // Ajoutez vos intégrations ici
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
  vite: {
    define: {
      __SCHEMA_VERSION__: '"${schema.version}"'
    }
  }
});`;
  };

  const generateACFJson = (schema: Schema): string => {
    const acfGroups = schema.tables.map(table => ({
      key: `group_${table.name}`,
      title: `${table.name.charAt(0).toUpperCase() + table.name.slice(1)} Fields`,
      fields: table.fields.map((field, index) => ({
        key: `field_${table.name}_${field.name}`,
        label: field.name.charAt(0).toUpperCase() + field.name.slice(1),
        name: field.name,
        type: field.acf_field_type,
        instructions: field.description,
        required: field.required ? 1 : 0,
        default_value: field.example_value || '',
        wrapper: {
          width: field.type_general === 'text' ? '100' : '50',
          class: '',
          id: ''
        }
      })),
      location: [
        [
          {
            param: 'post_type',
            operator: '==',
            value: table.name
          }
        ]
      ],
      menu_order: 0,
      position: 'normal',
      style: 'default',
      label_placement: 'top',
      instruction_placement: 'label',
      hide_on_screen: '',
      active: true,
      description: table.description
    }));

    return JSON.stringify(acfGroups, null, 2);
  };

  const generateCSVData = (schema: Schema): string => {
    let csv = '';
    
    schema.tables.forEach(table => {
      csv += `\n# Table: ${table.name}\n`;
      csv += `# ${table.description}\n`;
      
      // En-têtes
      const headers = table.fields.map(f => f.name);
      csv += headers.join(',') + '\n';
      
      // Données d'exemple (3 lignes par table)
      for (let i = 1; i <= 3; i++) {
        const row = table.fields.map(field => {
          switch (field.type_general) {
            case 'uuid':
              return `"${crypto.randomUUID()}"`;
            case 'string':
              return `"${field.example_value || `exemple_${i}`}"`;
            case 'int':
              return i.toString();
            case 'float':
              return (i * 10.5).toString();
            case 'bool':
              return (i % 2 === 0).toString();
            case 'datetime':
              return `"2024-01-${String(i).padStart(2, '0')} 12:00:00"`;
            case 'text':
              return `"${field.example_value || `Contenu exemple ${i}`}"`;
            default:
              return `"${field.example_value || `valeur_${i}`}"`;
          }
        });
        csv += row.join(',') + '\n';
      }
      csv += '\n';
    });
    
    return csv;
  };

  const generateAstroPage = (schema: Schema): string => {
    return `---
// Page Astro générée pour ${schema.name}
export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body>
    <main>
      <h1>${schema.name}</h1>
      <p>${schema.description}</p>
      
      <section>
        <h2>Tables du schéma</h2>
        <div class="tables-grid">
          ${schema.tables.map(table => `
          <div class="table-card">
            <h3>${table.name}</h3>
            <p>${table.description}</p>
            <span class="field-count">${table.fields.length} champs</span>
          </div>`).join('')}
        </div>
      </section>
    </main>
    
    <style>
      .tables-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      
      .table-card {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1rem;
        background: white;
      }
      
      .field-count {
        background: #f1f5f9;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
      }
    </style>
  </body>
</html>`;
  };

  const generateDocumentation = (schema: Schema): string => {
    let doc = `# Documentation ${schema.name}\n\n`;
    doc += `**Version:** ${schema.version}\n`;
    doc += `**Description:** ${schema.description}\n\n`;
    
    doc += `## Vue d'ensemble\n\n`;
    doc += `Ce schéma contient ${schema.tables.length} table(s) avec un total de ${schema.tables.reduce((acc, table) => acc + table.fields.length, 0)} champs.\n\n`;
    
    doc += `## Tables\n\n`;
    
    schema.tables.forEach(table => {
      doc += `### ${table.name}\n\n`;
      doc += `**Description:** ${table.description}\n`;
      doc += `**Catégorie:** ${table.category || 'Non spécifiée'}\n`;
      doc += `**Nombre de champs:** ${table.fields.length}\n\n`;
      
      if (table.notes) {
        doc += `**Notes:** ${table.notes}\n\n`;
      }
      
      doc += `#### Champs\n\n`;
      doc += `| Nom | Type | SQL | Requis | Unique | Description |\n`;
      doc += `|-----|------|-----|--------|--------|--------------|\n`;
      
      table.fields.forEach(field => {
        doc += `| ${field.name} | ${field.type_general} | ${field.type_sql} | ${field.required ? '✓' : '✗'} | ${field.unique ? '✓' : '✗'} | ${field.description} |\n`;
      });
      
      doc += '\n';
      
      // Relations
      const relations = table.fields.filter(f => f.foreign_key);
      if (relations.length > 0) {
        doc += `#### Relations\n\n`;
        relations.forEach(field => {
          doc += `- **${field.name}** → ${field.foreign_key} (${field.relation_cardinality})\n`;
        });
        doc += '\n';
      }
    });
    
    doc += `## Instructions d'installation\n\n`;
    doc += `1. Exécutez le script SQL pour créer les tables\n`;
    doc += `2. Importez la configuration ACF si vous utilisez WordPress\n`;
    doc += `3. Utilisez les données CSV comme exemples\n`;
    doc += `4. Adaptez la page Astro selon vos besoins\n\n`;
    
    doc += `---\n`;
    doc += `*Documentation générée automatiquement le ${new Date().toLocaleDateString('fr-FR')}*\n`;
    
    return doc;
  };

  const handleGenerate = async () => {
    if (schema.tables.length === 0) {
      toast({
        title: "Aucune table",
        description: "Ajoutez au moins une table avant de générer les artefacts.",
        variant: "destructive"
      });
      return;
    }

    const selectedOptions = Object.entries(options).filter(([_, selected]) => selected);
    
    if (selectedOptions.length === 0) {
      toast({
        title: "Aucune option sélectionnée",
        description: "Sélectionnez au moins un type d'artefact à générer.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulation d'un délai de génération
      await new Promise(resolve => setTimeout(resolve, 2000));

      const artifacts: GeneratedArtifacts = {
        sql: options.sql ? generateSQL(schema) : '',
        astro_config: options.astro_config ? generateAstroConfig(schema) : '',
        acf_json: options.acf_json ? generateACFJson(schema) : '',
        csv_data: options.csv_data ? generateCSVData(schema) : '',
        astro_page: options.astro_page ? generateAstroPage(schema) : '',
        documentation: options.documentation ? generateDocumentation(schema) : ''
      };

      onGenerate(artifacts);

      toast({
        title: "Artefacts générés",
        description: `${selectedOptions.length} type(s) d'artefacts générés avec succès.`,
      });
    } catch (error) {
      console.error('Error generating artifacts:', error);
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération des artefacts.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleOption = (key: keyof GenerationOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const selectAll = () => {
    setOptions({
      sql: true,
      astro_config: true,
      acf_json: true,
      csv_data: true,
      astro_page: true,
      documentation: true
    });
  };

  const selectNone = () => {
    setOptions({
      sql: false,
      astro_config: false,
      acf_json: false,
      csv_data: false,
      astro_page: false,
      documentation: false
    });
  };

  const artifactTypes = [
    {
      key: 'sql' as keyof GenerationOptions,
      title: 'Script SQL',
      description: 'Commandes CREATE TABLE avec contraintes',
      icon: Database,
      color: 'text-blue-600'
    },
    {
      key: 'astro_config' as keyof GenerationOptions,
      title: 'Configuration Astro',
      description: 'Fichier astro.config.mjs',
      icon: Settings,
      color: 'text-purple-600'
    },
    {
      key: 'acf_json' as keyof GenerationOptions,
      title: 'Champs ACF',
      description: 'Configuration JSON pour WordPress ACF',
      icon: FileCode,
      color: 'text-green-600'
    },
    {
      key: 'csv_data' as keyof GenerationOptions,
      title: 'Données CSV',
      description: 'Données d\'exemple au format CSV',
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      key: 'astro_page' as keyof GenerationOptions,
      title: 'Page Astro',
      description: 'Page de présentation du schéma',
      icon: FileCode,
      color: 'text-indigo-600'
    },
    {
      key: 'documentation' as keyof GenerationOptions,
      title: 'Documentation',
      description: 'Documentation complète en Markdown',
      icon: FileText,
      color: 'text-slate-600'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-6 w-6 text-green-600" />
          Générateur d'Artefacts
        </CardTitle>
        <p className="text-sm text-slate-600">
          Générez des fichiers prêts à l'emploi à partir de votre schéma
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        {schema.tables.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous devez créer au moins une table avant de pouvoir générer des artefacts.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-6">
            {/* Résumé du schéma */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Résumé du schéma</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{schema.tables.length}</div>
                  <div className="text-slate-600">Tables</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {schema.tables.reduce((acc, table) => acc + table.fields.length, 0)}
                  </div>
                  <div className="text-slate-600">Champs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {schema.tables.reduce((acc, table) => 
                      acc + table.fields.filter(f => f.foreign_key).length, 0
                    )}
                  </div>
                  <div className="text-slate-600">Relations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {schema.tables.reduce((acc, table) => 
                      acc + table.fields.filter(f => f.primary_key).length, 0
                    )}
                  </div>
                  <div className="text-slate-600">Clés primaires</div>
                </div>
              </div>
            </div>

            {/* Options de génération */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Types d'artefacts à générer</h3>
                <div className="flex gap-2">
                  <Button onClick={selectAll} variant="outline" size="sm">
                    Tout sélectionner
                  </Button>
                  <Button onClick={selectNone} variant="outline" size="sm">
                    Tout désélectionner
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {artifactTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <Card 
                      key={type.key}
                      className={`cursor-pointer transition-all ${
                        options[type.key] ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-slate-50'
                      }`}
                      onClick={() => toggleOption(type.key)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={options[type.key]}
                            onChange={() => {}}
                            className="mt-1 pointer-events-none"
                          />
                          <div className={`p-2 rounded-lg bg-slate-100`}>
                            <IconComponent className={`h-5 w-5 ${type.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{type.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Bouton de génération */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || Object.values(options).every(v => !v)}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <FileCode className="h-5 w-5 mr-2" />
                    Générer les artefacts ({Object.values(options).filter(Boolean).length})
                  </>
                )}
              </Button>
              
              {Object.values(options).every(v => !v) && (
                <p className="text-sm text-slate-500 text-center mt-2">
                  Sélectionnez au moins un type d'artefact
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
