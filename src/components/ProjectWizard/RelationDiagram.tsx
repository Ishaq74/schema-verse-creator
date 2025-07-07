import React from 'react';
import { Schema, Table } from '@/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Database, Key } from 'lucide-react';

interface Relation {
  id: string;
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

interface RelationDiagramProps {
  schema: Schema;
  relations: Relation[];
}

export default function RelationDiagram({ schema, relations }: RelationDiagramProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Diagramme du Schéma
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schema.tables.map(table => (
            <div key={table.id} className="relative">
              <div className="border border-slate-200 rounded-lg bg-white shadow-sm">
                {/* En-tête de table */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-t-lg border-b">
                  <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    {table.name}
                  </h3>
                  {table.description && (
                    <p className="text-xs text-blue-700 mt-1">{table.description}</p>
                  )}
                </div>
                
                {/* Champs */}
                <div className="p-3 space-y-2">
                  {table.fields.map(field => (
                    <div 
                      key={field.name} 
                      className={`flex items-center justify-between text-sm p-2 rounded ${
                        field.primary_key ? 'bg-yellow-50 border border-yellow-200' : 
                        field.foreign_key ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {field.primary_key && <Key className="h-3 w-3 text-yellow-600" />}
                        <span className={field.primary_key ? 'font-semibold' : ''}>{field.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {field.type_general}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Relations sortantes */}
              {relations
                .filter(rel => rel.fromTable === table.name)
                .map(relation => (
                  <div key={relation.id} className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="flex items-center">
                      <div className="bg-white border border-slate-300 rounded-full p-1">
                        <ArrowRight className="h-3 w-3 text-slate-600" />
                      </div>
                      <div className="bg-white border border-slate-300 rounded px-2 py-1 ml-1 text-xs">
                        {relation.type === 'one-to-one' && '1:1'}
                        {relation.type === 'one-to-many' && '1:N'}
                        {relation.type === 'many-to-many' && 'N:N'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
        
        {schema.tables.length === 0 && (
          <div className="text-center text-slate-500 py-12">
            <Database className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>Aucune table définie</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}