
export interface Field {
  name: string;
  type_general: 'string' | 'text' | 'int' | 'float' | 'bool' | 'datetime' | 'enum' | 'relation' | 'image' | 'uuid' | 'json';
  type_sql: string;
  default_sql?: string;
  required: boolean;
  unique: boolean;
  primary_key: boolean;
  foreign_key?: string;
  relation_cardinality?: '1-1' | '1-N' | 'N-N';
  enum_values?: string[];
  description: string;
  example_value: string;
  category?: string;
  notes?: string;
  slug_compatible: boolean;
  acf_field_type: string;
  supabase_policy?: string;
  rpc_functions?: string[];
  index?: 'BTree' | 'GIN' | 'GIST';
  json_schema?: string;
  frontmatter_field?: string;
  ui_component: 'input' | 'select' | 'datepicker' | 'toggle' | 'textarea' | 'relation-picker' | 'image-picker';
}

export interface Table {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  slug_fields?: string[];
  category?: string;
  notes?: string;
}

export interface Schema {
  tables: Table[];
  name: string;
  description: string;
  version: string;
}

export interface GeneratedArtifacts {
  sql: string;
  astro_config: string;
  acf_json: string;
  csv_data: string;
  astro_page: string;
  documentation: string;
}
