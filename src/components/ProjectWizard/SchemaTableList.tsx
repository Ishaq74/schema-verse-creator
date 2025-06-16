
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, Field } from '@/types/schema';
import { Database, Edit, Copy, Trash2, Eye, Key, Link } from 'lucide-react';

interface SchemaTableListProps {
  tables: Table[];
  selectedTableId: string | null;
  onSelectTable: (table: Table) => void;
  onEditTable: (table: Table) => void;
  onDuplicateTable: (table: Table) => void;
  onDeleteTable: (tableId: string) => void;
  searchTerm: string;
}

export default function SchemaTableList({
  tables,
  selectedTableId,
  onSelectTable,
  onEditTable,
  onDuplicateTable,
  onDeleteTable,
  searchTerm
}: SchemaTableListProps) {
  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.fields.some(field => field.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-3">
      {filteredTables.map((table) => {
        const primaryKeys = table.fields.filter(f => f.primary_key);
        const foreignKeys = table.fields.filter(f => f.foreign_key);
        const requiredFields = table.fields.filter(f => f.required);
        
        return (
          <Card 
            key={table.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTableId === table.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onSelectTable(table)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge variant="outline">{table.category || 'Général'}</Badge>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTable(table);
                    }}
                    title="Éditer la table"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateTable(table);
                    }}
                    title="Dupliquer la table"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTable(table.id);
                    }}
                    title="Supprimer la table"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mt-1">{table.description}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Database className="h-3 w-3 text-slate-500" />
                  <span>{table.fields.length} champs</span>
                </div>
                
                {primaryKeys.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Key className="h-3 w-3 text-yellow-600" />
                    <span>{primaryKeys.length} clé(s) primaire(s)</span>
                  </div>
                )}
                
                {foreignKeys.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Link className="h-3 w-3 text-purple-600" />
                    <span>{foreignKeys.length} relation(s)</span>
                  </div>
                )}
                
                {requiredFields.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">!</span>
                    <span>{requiredFields.length} requis</span>
                  </div>
                )}
              </div>
              
              {table.fields.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {table.fields.slice(0, 5).map((field) => (
                    <Badge key={field.name} variant="secondary" className="text-xs">
                      {field.name}
                    </Badge>
                  ))}
                  {table.fields.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{table.fields.length - 5} autres
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      
      {filteredTables.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            {searchTerm 
              ? `Aucune table trouvée pour "${searchTerm}"`
              : 'Aucune table. Commencez par en créer une.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
