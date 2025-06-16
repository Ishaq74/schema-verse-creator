
import React, { useState } from "react";
import { Schema, Table } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Download, Copy, CheckCircle, Code, Database, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Step5GenerationProps {
  schema: Schema;
  onBack: () => void;
  onFinish: () => void;
}

export default function Step5Generation({
  schema,
  onBack,
  onFinish,
}: Step5GenerationProps) {
  const [activeTab, setActiveTab] = useState("sql");
  const [copied, setCopied] = useState<string | null>(null);

  const generateSQL = (dialect: 'mysql' | 'postgresql' | 'sqlite' = 'postgresql') => {
    let sql = `-- Schéma de base de données: ${schema.name}\n`;
    sql += `-- Généré le: ${new Date().toLocaleDateString('fr-FR')}\n`;
    sql += `-- Dialecte: ${dialect.toUpperCase()}\n\n`;

    schema.tables.forEach(table => {
      sql += `-- Table: ${table.name}\n`;
      if (table.description) {
        sql += `-- ${table.description}\n`;
      }
      
      sql += `CREATE TABLE ${table.name} (\n`;
      
      const fieldDefinitions = table.fields.map(field => {
        let definition = `  ${field.name} `;
        
        // Type SQL selon le dialecte
        switch (dialect) {
          case 'mysql':
            if (field.type_general === 'string') definition += field.required ? 'VARCHAR(255) NOT NULL' : 'VARCHAR(255)';
            else if (field.type_general === 'int') definition += field.primary_key ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INT';
            else if (field.type_general === 'bool') definition += 'BOOLEAN';
            else if (field.type_general === 'datetime') definition += 'DATETIME';
            else if (field.type_general === 'text') definition += 'TEXT';
            else if (field.type_general === 'float') definition += 'DECIMAL(10,2)';
            else if (field.type_general === 'uuid') definition += 'VARCHAR(36)';
            else if (field.type_general === 'json') definition += 'JSON';
            break;
          case 'postgresql':
            if (field.type_general === 'string') definition += field.required ? 'VARCHAR(255) NOT NULL' : 'VARCHAR(255)';
            else if (field.type_general === 'int') definition += field.primary_key ? 'SERIAL PRIMARY KEY' : 'INTEGER';
            else if (field.type_general === 'bool') definition += 'BOOLEAN';
            else if (field.type_general === 'datetime') definition += 'TIMESTAMP';
            else if (field.type_general === 'text') definition += 'TEXT';
            else if (field.type_general === 'float') definition += 'DECIMAL(10,2)';
            else if (field.type_general === 'uuid') definition += 'UUID';
            else if (field.type_general === 'json') definition += 'JSONB';
            break;
          case 'sqlite':
            if (field.type_general === 'string') definition += field.required ? 'TEXT NOT NULL' : 'TEXT';
            else if (field.type_general === 'int') definition += field.primary_key ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INTEGER';
            else if (field.type_general === 'bool') definition += 'BOOLEAN';
            else if (field.type_general === 'datetime') definition += 'DATETIME';
            else if (field.type_general === 'text') definition += 'TEXT';
            else if (field.type_general === 'float') definition += 'REAL';
            else if (field.type_general === 'uuid') definition += 'TEXT';
            else if (field.type_general === 'json') definition += 'TEXT';
            break;
        }
        
        if (!field.primary_key && field.required) definition += ' NOT NULL';
        if (field.unique && !field.primary_key) definition += ' UNIQUE';
        
        return definition;
      });
      
      sql += fieldDefinitions.join(',\n');
      sql += `\n);\n\n`;
      
      // Index pour les champs uniques
      table.fields.forEach(field => {
        if (field.unique && !field.primary_key) {
          sql += `CREATE UNIQUE INDEX idx_${table.name}_${field.name} ON ${table.name}(${field.name});\n`;
        }
      });
      
      sql += `\n`;
    });

    return sql;
  };

  const generateTypeScript = () => {
    let ts = `// Types TypeScript pour le schéma: ${schema.name}\n`;
    ts += `// Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

    schema.tables.forEach(table => {
      ts += `// Interface pour la table: ${table.name}\n`;
      if (table.description) {
        ts += `// ${table.description}\n`;
      }
      
      ts += `export interface ${table.name.charAt(0).toUpperCase() + table.name.slice(1)} {\n`;
      
      table.fields.forEach(field => {
        const tsType = field.type_general === 'string' ? 'string' :
                      field.type_general === 'text' ? 'string' :
                      field.type_general === 'int' ? 'number' :
                      field.type_general === 'float' ? 'number' :
                      field.type_general === 'bool' ? 'boolean' :
                      field.type_general === 'datetime' ? 'Date' :
                      field.type_general === 'uuid' ? 'string' :
                      field.type_general === 'json' ? 'any' : 'any';
        
        const optional = field.required ? '' : '?';
        ts += `  ${field.name}${optional}: ${tsType};\n`;
      });
      
      ts += `}\n\n`;
    });

    return ts;
  };

  const generatePrismaSchema = () => {
    let prisma = `// Schéma Prisma pour: ${schema.name}\n`;
    prisma += `// Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    prisma += `generator client {\n`;
    prisma += `  provider = "prisma-client-js"\n`;
    prisma += `}\n\n`;
    
    prisma += `datasource db {\n`;
    prisma += `  provider = "postgresql"\n`;
    prisma += `  url      = env("DATABASE_URL")\n`;
    prisma += `}\n\n`;

    schema.tables.forEach(table => {
      prisma += `model ${table.name.charAt(0).toUpperCase() + table.name.slice(1)} {\n`;
      
      table.fields.forEach(field => {
        let fieldDef = `  ${field.name} `;
        
        if (field.type_general === 'string') fieldDef += 'String';
        else if (field.type_general === 'text') fieldDef += 'String';
        else if (field.type_general === 'int') fieldDef += field.primary_key ? 'Int @id @default(autoincrement())' : 'Int';
        else if (field.type_general === 'float') fieldDef += 'Float';
        else if (field.type_general === 'bool') fieldDef += 'Boolean';
        else if (field.type_general === 'datetime') fieldDef += 'DateTime';
        else if (field.type_general === 'uuid') fieldDef += 'String @db.Uuid';
        else if (field.type_general === 'json') fieldDef += 'Json';
        
        if (!field.primary_key) {
          if (!field.required) fieldDef += '?';
          if (field.unique) fieldDef += ' @unique';
        }
        
        prisma += fieldDef + '\n';
      });
      
      prisma += `}\n\n`;
    });

    return prisma;
  };

  const generateDocumentation = () => {
    let doc = `# Documentation du Schéma: ${schema.name}\n\n`;
    doc += `Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    if (schema.description) {
      doc += `## Description\n${schema.description}\n\n`;
    }
    
    doc += `## Vue d'ensemble\n\n`;
    doc += `- **Nombre de tables**: ${schema.tables.length}\n`;
    doc += `- **Nombre total de champs**: ${schema.tables.reduce((acc, table) => acc + table.fields.length, 0)}\n\n`;
    
    doc += `## Tables\n\n`;
    
    schema.tables.forEach(table => {
      doc += `### ${table.name}\n\n`;
      if (table.description) {
        doc += `${table.description}\n\n`;
      }
      
      doc += `| Champ | Type | Requis | Unique | Clé Primaire | Description |\n`;
      doc += `|-------|------|--------|--------|--------------|-------------|\n`;
      
      table.fields.forEach(field => {
        doc += `| ${field.name} | ${field.type_general} | ${field.required ? '✅' : '❌'} | ${field.unique ? '✅' : '❌'} | ${field.primary_key ? '✅' : '❌'} | ${field.description || '-'} |\n`;
      });
      
      doc += `\n`;
    });

    return doc;
  };

  const generateMigrations = () => {
    let migration = `-- Migration pour ${schema.name}\n`;
    migration += `-- Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    migration += `-- Ordre de création des tables (respecte les dépendances)\n\n`;
    
    schema.tables.forEach((table, index) => {
      migration += `-- Étape ${index + 1}: Création de la table ${table.name}\n`;
      migration += generateSQL('postgresql').split('\n')
        .filter(line => line.includes(table.name) || line.includes('CREATE TABLE') || line.includes(table.fields[0]?.name))
        .join('\n');
      migration += `\n\n`;
    });
    
    return migration;
  };

  const generateAPIEndpoints = () => {
    let api = `// Endpoints API REST pour ${schema.name}\n`;
    api += `// Généré le: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
    
    schema.tables.forEach(table => {
      const modelName = table.name.charAt(0).toUpperCase() + table.name.slice(1);
      
      api += `// Routes pour ${table.name}\n`;
      api += `app.get('/api/${table.name}', async (req, res) => {\n`;
      api += `  // Récupérer tous les ${table.name}\n`;
      api += `});\n\n`;
      
      api += `app.get('/api/${table.name}/:id', async (req, res) => {\n`;
      api += `  // Récupérer un ${table.name} par ID\n`;
      api += `});\n\n`;
      
      api += `app.post('/api/${table.name}', async (req, res) => {\n`;
      api += `  // Créer un nouveau ${table.name}\n`;
      api += `});\n\n`;
      
      api += `app.put('/api/${table.name}/:id', async (req, res) => {\n`;
      api += `  // Mettre à jour un ${table.name}\n`;
      api += `});\n\n`;
      
      api += `app.delete('/api/${table.name}/:id', async (req, res) => {\n`;
      api += `  // Supprimer un ${table.name}\n`;
      api += `});\n\n`;
    });
    
    return api;
  };

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(type);
      toast({ title: "Copié!", description: `Le code ${type} a été copié dans le presse-papiers` });
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de copier dans le presse-papiers", variant: "destructive" });
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Téléchargé!", description: `Le fichier ${filename} a été téléchargé` });
  };

  const downloadAllFiles = () => {
    const files = [
      { content: generateSQL('postgresql'), filename: `${schema.name}_postgresql.sql` },
      { content: generateSQL('mysql'), filename: `${schema.name}_mysql.sql` },
      { content: generateSQL('sqlite'), filename: `${schema.name}_sqlite.sql` },
      { content: generateTypeScript(), filename: `${schema.name}_types.ts` },
      { content: generatePrismaSchema(), filename: 'schema.prisma' },
      { content: generateDocumentation(), filename: `${schema.name}_documentation.md` },
      { content: generateMigrations(), filename: `${schema.name}_migrations.sql` },
      { content: generateAPIEndpoints(), filename: `${schema.name}_api.js` },
      { content: JSON.stringify(schema, null, 2), filename: `${schema.name}_schema.json` }
    ];

    files.forEach(file => {
      setTimeout(() => downloadFile(file.content, file.filename, 'Archive'), 100);
    });

    toast({ title: "Archive téléchargée!", description: "Tous les fichiers ont été téléchargés" });
  };

  const sqlPostgreSQL = generateSQL('postgresql');
  const sqlMySQL = generateSQL('mysql');
  const sqlSQLite = generateSQL('sqlite');
  const typeScript = generateTypeScript();
  const prismaSchema = generatePrismaSchema();
  const documentation = generateDocumentation();
  const migrations = generateMigrations();
  const apiEndpoints = generateAPIEndpoints();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Génération et Export</h2>
          <p className="text-slate-600">Votre schéma est prêt ! Téléchargez les fichiers générés</p>
        </div>
        
        <Button onClick={downloadAllFiles} className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Télécharger Tout
        </Button>
      </div>

      {/* Statistiques finales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Database className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{schema.tables.length}</div>
            <div className="text-sm text-slate-600">Tables</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Code className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{schema.tables.reduce((acc, table) => acc + table.fields.length, 0)}</div>
            <div className="text-sm text-slate-600">Champs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">9</div>
            <div className="text-sm text-slate-600">Formats disponibles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-slate-600">Prêt</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour les différents formats */}
      <Card>
        <CardHeader>
          <CardTitle>Fichiers Générés</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-9 text-xs">
              <TabsTrigger value="sql">SQL</TabsTrigger>
              <TabsTrigger value="typescript">TypeScript</TabsTrigger>
              <TabsTrigger value="prisma">Prisma</TabsTrigger>
              <TabsTrigger value="doc">Docs</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="migrations">Migrations</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
              <TabsTrigger value="resume">Résumé</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sql" className="space-y-4">
              <div className="space-y-4">
                {/* PostgreSQL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">PostgreSQL</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(sqlPostgreSQL, 'PostgreSQL')}
                      >
                        {copied === 'PostgreSQL' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadFile(sqlPostgreSQL, `${schema.name}_postgresql.sql`, 'SQL')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={sqlPostgreSQL}
                    readOnly
                    className="font-mono text-sm h-40"
                  />
                </div>
                
                {/* MySQL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">MySQL</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(sqlMySQL, 'MySQL')}
                      >
                        {copied === 'MySQL' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadFile(sqlMySQL, `${schema.name}_mysql.sql`, 'SQL')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={sqlMySQL}
                    readOnly
                    className="font-mono text-sm h-40"
                  />
                </div>
                
                {/* SQLite */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">SQLite</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(sqlSQLite, 'SQLite')}
                      >
                        {copied === 'SQLite' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadFile(sqlSQLite, `${schema.name}_sqlite.sql`, 'SQL')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={sqlSQLite}
                    readOnly
                    className="font-mono text-sm h-40"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="typescript">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Interfaces TypeScript</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(typeScript, 'TypeScript')}
                  >
                    {copied === 'TypeScript' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadFile(typeScript, `${schema.name}_types.ts`, 'TypeScript')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={typeScript}
                readOnly
                className="font-mono text-sm h-96"
              />
            </TabsContent>
            
            <TabsContent value="prisma">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Schéma Prisma</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(prismaSchema, 'Prisma')}
                  >
                    {copied === 'Prisma' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadFile(prismaSchema, 'schema.prisma', 'Prisma')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={prismaSchema}
                readOnly
                className="font-mono text-sm h-96"
              />
            </TabsContent>
            
            <TabsContent value="doc">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Documentation Markdown</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(documentation, 'Documentation')}
                  >
                    {copied === 'Documentation' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadFile(documentation, `${schema.name}_documentation.md`, 'Markdown')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={documentation}
                readOnly
                className="font-mono text-sm h-96"
              />
            </TabsContent>
            
            <TabsContent value="json">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Schéma JSON</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(JSON.stringify(schema, null, 2), 'JSON')}
                  >
                    {copied === 'JSON' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadFile(JSON.stringify(schema, null, 2), `${schema.name}_schema.json`, 'JSON')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={JSON.stringify(schema, null, 2)}
                readOnly
                className="font-mono text-sm h-96"
              />
            </TabsContent>

            <TabsContent value="migrations">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Migrations SQL</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(migrations, 'Migrations')}
                  >
                    {copied === 'Migrations' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadFile(migrations, `${schema.name}_migrations.sql`, 'Migrations')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={migrations}
                readOnly
                className="font-mono text-sm h-96"
              />
            </TabsContent>

            <TabsContent value="api">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Endpoints API</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(apiEndpoints, 'API')}
                  >
                    {copied === 'API' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadFile(apiEndpoints, `${schema.name}_api.js`, 'API')}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={apiEndpoints}
                readOnly
                className="font-mono text-sm h-96"
              />
            </TabsContent>
            
            <TabsContent value="resume">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {schema.tables.map(table => (
                    <Card key={table.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{table.name}</CardTitle>
                        {table.description && (
                          <p className="text-sm text-slate-600">{table.description}</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {table.fields.map(field => (
                            <div key={field.name} className="flex items-center justify-between text-sm">
                              <span className={`${field.primary_key ? 'font-bold' : ''} ${field.required ? 'text-slate-900' : 'text-slate-600'}`}>
                                {field.name}
                              </span>
                              <div className="flex gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {field.type_general}
                                </Badge>
                                {field.primary_key && <Badge className="text-xs bg-blue-600">PK</Badge>}
                                {field.required && !field.primary_key && <Badge variant="secondary" className="text-xs">REQ</Badge>}
                                {field.unique && <Badge variant="secondary" className="text-xs">UNI</Badge>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Types de Champs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const typeCount: Record<string, number> = {};
                      schema.tables.forEach(table => {
                        table.fields.forEach(field => {
                          typeCount[field.type_general] = (typeCount[field.type_general] || 0) + 1;
                        });
                      });
                      return Object.entries(typeCount).map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center mb-2">
                          <span className="text-sm">{type}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ));
                    })()}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contraintes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Clés primaires</span>
                        <Badge variant="outline">
                          {schema.tables.reduce((acc, table) => acc + table.fields.filter(f => f.primary_key).length, 0)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Champs requis</span>
                        <Badge variant="outline">
                          {schema.tables.reduce((acc, table) => acc + table.fields.filter(f => f.required).length, 0)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Champs uniques</span>
                        <Badge variant="outline">
                          {schema.tables.reduce((acc, table) => acc + table.fields.filter(f => f.unique).length, 0)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Clés étrangères</span>
                        <Badge variant="outline">
                          {schema.tables.reduce((acc, table) => acc + table.fields.filter(f => f.foreign_key).length, 0)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Complexité</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Tables simples</span>
                        <Badge variant="outline">
                          {schema.tables.filter(t => t.fields.length <= 5).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tables moyennes</span>
                        <Badge variant="outline">
                          {schema.tables.filter(t => t.fields.length > 5 && t.fields.length <= 10).length}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tables complexes</span>
                        <Badge variant="outline">
                          {schema.tables.filter(t => t.fields.length > 10).length}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={onFinish} className="bg-green-600 hover:bg-green-700">
          Terminer le Projet
        </Button>
      </div>
    </div>
  );
}
