import React from 'react';
import { Table, Field, GeneratedArtifacts } from '@/types/schema';

export class ArtifactGenerator {
  static generateSQL(table: Table, dialect: "postgres" | "sqlite" = "postgres"): string {
    const tableName = table.name;
    let sql = `-- Table: ${tableName}\n`;
    sql += `-- Description: ${table.description}\n\n`;

    if (dialect === "sqlite") {
      sql += `CREATE TABLE IF NOT EXISTS "${tableName}" (\n`;
      const fieldDefinitions = table.fields.map(field => {
        let def = `"${field.name}" ${field.type_sql}`;
        if (field.primary_key) {
          def += " PRIMARY KEY";
        }
        if (field.unique && !field.primary_key) {
          def += " UNIQUE";
        }
        if (field.required && !field.primary_key) {
          def += " NOT NULL";
        }
        return def;
      });
      sql += fieldDefinitions.join(",\n");
      sql += "\n);\n";
      // Ajoute les foreign keys à la suite
      table.fields.forEach(field => {
        if (field.foreign_key) {
          sql += `-- FK: ${field.name} REFERENCES ${field.foreign_key}\n`;
        }
      });
      return sql;
    }

    // CREATE TABLE
    sql += `CREATE TABLE ${tableName} (\n`;
    
    const fieldDefinitions = table.fields.map(field => {
      let definition = `  ${field.name} ${field.type_sql}`;
      
      if (field.primary_key) {
        definition += ' PRIMARY KEY';
      }
      
      if (field.required && !field.primary_key) {
        definition += ' NOT NULL';
      }
      
      if (field.unique && !field.primary_key) {
        definition += ' UNIQUE';
      }
      
      if (field.default_sql) {
        definition += ` DEFAULT ${field.default_sql}`;
      }
      
      return definition;
    });

    sql += fieldDefinitions.join(',\n');
    sql += '\n);\n\n';

    // Commentaires sur les colonnes
    table.fields.forEach(field => {
      if (field.description) {
        sql += `COMMENT ON COLUMN ${tableName}.${field.name} IS '${field.description}';\n`;
      }
    });

    // Index
    table.fields.forEach(field => {
      if (field.index) {
        const indexName = `idx_${tableName}_${field.name}`;
        sql += `\nCREATE INDEX ${indexName} ON ${tableName} USING ${field.index} (${field.name});`;
      }
    });

    // Foreign keys
    table.fields.forEach(field => {
      if (field.foreign_key) {
        const constraintName = `fk_${tableName}_${field.name}`;
        sql += `\nALTER TABLE ${tableName} ADD CONSTRAINT ${constraintName} FOREIGN KEY (${field.name}) REFERENCES ${field.foreign_key};`;
      }
    });

    // RLS Policies pour Supabase
    const fieldsWithPolicies = table.fields.filter(f => f.supabase_policy);
    if (fieldsWithPolicies.length > 0) {
      sql += `\n\n-- Row Level Security\nALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;\n`;
      
      fieldsWithPolicies.forEach(field => {
        const policyName = `${tableName}_${field.name}_policy`;
        sql += `\nCREATE POLICY ${policyName} ON ${tableName}\n  FOR ALL USING (${field.supabase_policy});`;
      });
    }

    return sql;
  }

  static generateAstroConfig(table: Table): string {
    const zodFields = table.fields.map(field => {
      let zodType = 'z.string()';
      
      switch (field.type_general) {
        case 'int':
          zodType = 'z.number().int()';
          break;
        case 'float':
          zodType = 'z.number()';
          break;
        case 'bool':
          zodType = 'z.boolean()';
          break;
        case 'datetime':
          zodType = 'z.date()';
          break;
        case 'enum':
          if (field.enum_values && field.enum_values.length > 0) {
            const enumValues = field.enum_values.map(v => `'${v}'`).join(', ');
            zodType = `z.enum([${enumValues}])`;
          }
          break;
        case 'json':
          zodType = 'z.record(z.any())';
          break;
        case 'uuid':
          zodType = 'z.string().uuid()';
          break;
      }
      
      if (!field.required) {
        zodType += '.optional()';
      }
      
      return `  ${field.name}: ${zodType}`;
    });

    return `// Astro Content Collection Configuration
// File: src/content/config.ts

import { defineCollection, z } from 'astro:content';

const ${table.name}Collection = defineCollection({
  type: 'content',
  schema: z.object({
${zodFields.join(',\n')}
  }),
});

export const collections = {
  ${table.name}: ${table.name}Collection,
};`;
  }

  static generateACFJSON(table: Table): string {
    const acfFields = table.fields.map((field, index) => ({
      key: `field_${field.name}`,
      label: field.description || field.name,
      name: field.name,
      type: field.acf_field_type,
      instructions: field.notes || '',
      required: field.required ? 1 : 0,
      conditional_logic: 0,
      wrapper: {
        width: '',
        class: '',
        id: ''
      },
      default_value: field.example_value || '',
      placeholder: field.example_value || '',
      prepend: '',
      append: '',
      maxlength: field.type_general === 'string' ? 255 : ''
    }));

    const acfGroup = {
      key: `group_${table.name}`,
      title: table.description || table.name,
      fields: acfFields,
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
      description: table.notes || ''
    };

    return JSON.stringify(acfGroup, null, 2);
  }

  static generateCSV(table: Table): string {
    const headers = [
      'Nom du champ',
      'Type général',
      'Type SQL',
      'Requis',
      'Unique',
      'Clé primaire',
      'Clé étrangère',
      'Description',
      'Exemple',
      'Catégorie',
      'Notes'
    ];

    const rows = table.fields.map(field => [
      field.name,
      field.type_general,
      field.type_sql,
      field.required ? 'Oui' : 'Non',
      field.unique ? 'Oui' : 'Non',
      field.primary_key ? 'Oui' : 'Non',
      field.foreign_key || '',
      field.description,
      field.example_value,
      field.category || '',
      field.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static generateAstroPage(table: Table): string {
    const slugField = table.fields.find(f => f.slug_compatible) || table.fields[0];
    
    return `---
// File: src/pages/${table.name}/[slug].astro
// Dynamic page for ${table.description || table.name}

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const ${table.name}Entries = await getCollection('${table.name}');
  return ${table.name}Entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

type Props = {
  entry: CollectionEntry<'${table.name}'>;
};

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{entry.data.${slugField?.name || 'title'}} | ${table.name}</title>
    <meta name="description" content={entry.data.description || "${table.description}"} />
  </head>
  <body>
    <main>
      <article>
        <header>
          <h1>{entry.data.${slugField?.name || 'title'}}</h1>
          ${table.fields.filter(f => f.name !== slugField?.name).slice(0, 3).map(field => 
            `<p><strong>${field.description}:</strong> {entry.data.${field.name}}</p>`
          ).join('\n          ')}
        </header>
        
        <Content />
      </article>
    </main>
  </body>
</html>`;
  }

  static generateDocumentation(table: Table): string {
    const requiredFields = table.fields.filter(f => f.required);
    const uniqueFields = table.fields.filter(f => f.unique);
    const relationFields = table.fields.filter(f => f.type_general === 'relation');
    const enumFields = table.fields.filter(f => f.type_general === 'enum');

    return `# Documentation: ${table.name}

## Description
${table.description}

${table.notes ? `## Notes techniques\n${table.notes}\n` : ''}

## Statistiques
- **Nombre de champs**: ${table.fields.length}
- **Champs requis**: ${requiredFields.length}
- **Champs uniques**: ${uniqueFields.length}
- **Relations**: ${relationFields.length}
- **Enums**: ${enumFields.length}

## Structure des champs

| Nom | Type | SQL | Description | Contraintes |
|-----|------|-----|-------------|-------------|
${table.fields.map(field => {
  const constraints = [];
  if (field.required) constraints.push('Requis');
  if (field.unique) constraints.push('Unique');
  if (field.primary_key) constraints.push('Clé primaire');
  if (field.foreign_key) constraints.push(`FK: ${field.foreign_key}`);
  
  return `| ${field.name} | ${field.type_general} | \`${field.type_sql}\` | ${field.description} | ${constraints.join(', ')} |`;
}).join('\n')}

${enumFields.length > 0 ? `## Enums\n\n${enumFields.map(field => 
  `### ${field.name}\nValeurs possibles: ${field.enum_values?.join(', ')}\n`
).join('\n')}` : ''}

${relationFields.length > 0 ? `## Relations\n\n${relationFields.map(field => 
  `### ${field.name}\n- **Table cible**: ${field.foreign_key}\n- **Cardinalité**: ${field.relation_cardinality}\n`
).join('\n')}` : ''}

## Exemples de données

${table.fields.map(field => 
  `- **${field.name}**: ${field.example_value}`
).join('\n')}
`;
  }

  static generateAll(table: Table): GeneratedArtifacts {
    return {
      sql: this.generateSQL(table),
      astro_config: this.generateAstroConfig(table),
      acf_json: this.generateACFJSON(table),
      csv_data: this.generateCSV(table),
      astro_page: this.generateAstroPage(table),
      documentation: this.generateDocumentation(table)
    };
  }
}
