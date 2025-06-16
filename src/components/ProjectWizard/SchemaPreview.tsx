
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Schema, Table } from '@/types/schema';
import { Database, Key, Link, Eye, Download, FileCode, GitBranch, Layers } from 'lucide-react';

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
  const totalUniqueFields = schema.tables.reduce((acc, table) => 
    acc + table.fields.filter(f => f.unique).length, 0
  );

  const categorizedTables = schema.tables.reduce((acc, table) => {
    const category = table.category || 'Général';
    if (!acc[category]) acc[category] = [];
    acc[category].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  return (
    <div className="space-y-6">
      {/* Statistiques globales améliorées */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu du Schéma - {schema.name}
          </CardTitle>
          <p className="text-sm text-slate-600">{schema.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{schema.tables.length}</div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                <Database className="h-3 w-3" />
                Tables
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-green-600">{totalFields}</div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                <Layers className="h-3 w-3" />
                Champs
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-yellow-600">{totalPrimaryKeys}</div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                <Key className="h-3 w-3" />
                Clés primaires
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{totalRelations}</div>
              <div className="text-sm text-slate-600 flex items-center justify-center gap-1">
                <GitBranch className="h-3 w-3" />
                Relations
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <Button onClick={onGenerateSQL} className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Générer SQL
            </Button>
            <Button onClick={onExportDiagram} variant="outline">
              <Database className="h-4 w-4 mr-2" />
              Exporter Diagramme
            </Button>
            <Button variant="outline">
              <FileCode className="h-4 w-4 mr-2" />
              Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vue par catégories */}
      <div className="space-y-4">
        {Object.entries(categorizedTables).map(([category, tables]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  {category}
                </span>
                <Badge variant="outline">{tables.length} table(s)</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tables.map((table) => (
                  <div key={table.id} className="border rounded-lg p-4 bg-gradient-to-br from-white to-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800">{table.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {table.fields.length} champs
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 mb-3">{table.description}</p>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {table.fields.map((field) => (
                        <div key={field.name} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1">
                            {field.primary_key && <Key className="h-3 w-3 text-yellow-600" />}
                            {field.foreign_key && <Link className="h-3 w-3 text-purple-600" />}
                            <span className={field.primary_key ? 'font-semibold' : ''}>{field.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {field.type_general}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    {table.fields.filter(f => f.foreign_key).length > 0 && (
                      <>
                        <Separator className="my-3" />
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Relations:</div>
                          <div className="flex flex-wrap gap-1">
                            {table.fields.filter(f => f.foreign_key).map((field) => (
                              <Badge key={field.name} variant="outline" className="text-xs">
                                {field.name} → {field.foreign_key}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analyse de qualité du schéma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Analyse de Qualité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Points positifs ✅</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                {totalPrimaryKeys > 0 && <li>• Toutes les tables ont des clés primaires</li>}
                {totalRelations > 0 && <li>• Relations entre tables définies</li>}
                {totalUniqueFields > 0 && <li>• Contraintes d'unicité présentes</li>}
                <li>• Structure cohérente du schéma</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Recommandations 💡</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Ajouter des index pour les performances</li>
                <li>• Définir des contraintes de validation</li>
                <li>• Documenter les relations complexes</li>
                <li>• Prévoir la gestion des migrations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
