
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Schema, Table } from '@/types/schema';
import { Database, Key, Link, Eye, Download } from 'lucide-react';

interface SchemaPreviewProps {
  schema: Schema;
  onGenerateSQL: () => void;
  onExportDiagram: () => void;
}

export default function SchemaPreview({ schema, onGenerateSQL, onExportDiagram }: SchemaPreviewProps) {
  const totalFields = schema.tables.reduce((acc, table) => acc + table.fields.length, 0);
  const totalRelations = schema.tables.reduce((acc, table) => 
    acc + table.fields.filter(f => f.foreign_key).length, 0
  );
  const totalPrimaryKeys = schema.tables.reduce((acc, table) => 
    acc + table.fields.filter(f => f.primary_key).length, 0
  );

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu du Schéma
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{schema.tables.length}</div>
              <div className="text-sm text-slate-600">Tables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalFields}</div>
              <div className="text-sm text-slate-600">Champs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{totalPrimaryKeys}</div>
              <div className="text-sm text-slate-600">Clés primaires</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalRelations}</div>
              <div className="text-sm text-slate-600">Relations</div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button onClick={onGenerateSQL} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Générer SQL
            </Button>
            <Button onClick={onExportDiagram} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Exporter Diagramme
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diagramme simplifié */}
      <Card>
        <CardHeader>
          <CardTitle>Diagramme Relationnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schema.tables.map((table) => (
              <div key={table.id} className="border rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <h4 className="font-semibold">{table.name}</h4>
                    <Badge variant="outline" className="text-xs">{table.fields.length} champs</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {table.fields.map((field) => (
                    <div key={field.name} className="flex items-center gap-1 text-sm">
                      {field.primary_key && <Key className="h-3 w-3 text-yellow-600" />}
                      {field.foreign_key && <Link className="h-3 w-3 text-purple-600" />}
                      <span className={field.primary_key ? 'font-semibold' : ''}>{field.name}</span>
                      <Badge variant="secondary" className="text-xs">{field.type_general}</Badge>
                    </div>
                  ))}
                </div>
                
                {table.fields.filter(f => f.foreign_key).length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-slate-600 mb-1">Relations:</div>
                    <div className="flex flex-wrap gap-2">
                      {table.fields.filter(f => f.foreign_key).map((field) => (
                        <Badge key={field.name} variant="outline" className="text-xs">
                          {field.name} → {field.foreign_key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
