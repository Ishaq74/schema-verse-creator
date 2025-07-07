import React from 'react';
import { Schema } from '@/types/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, ArrowRight } from 'lucide-react';

interface SuggestedRelation {
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

interface RelationSuggestionsProps {
  schema: Schema;
  onAddRelation: (relation: Omit<SuggestedRelation, 'confidence' | 'reason'>) => void;
}

export default function RelationSuggestions({ schema, onAddRelation }: RelationSuggestionsProps) {
  const generateSuggestions = (): SuggestedRelation[] => {
    const suggestions: SuggestedRelation[] = [];
    
    schema.tables.forEach(table => {
      table.fields.forEach(field => {
        // Détection de clés étrangères potentielles par convention de nommage
        if (field.name.endsWith('_id') && field.type_general === 'uuid') {
          const referencedTableName = field.name.replace('_id', 's');
          const referencedTable = schema.tables.find(t => 
            t.name === referencedTableName || 
            t.name === field.name.replace('_id', '')
          );
          
          if (referencedTable) {
            const referencedField = referencedTable.fields.find(f => f.primary_key);
            if (referencedField) {
              suggestions.push({
                fromTable: table.name,
                fromField: field.name,
                toTable: referencedTable.name,
                toField: referencedField.name,
                type: 'one-to-many',
                confidence: 'high',
                reason: `Le champ "${field.name}" semble référencer la table "${referencedTable.name}"`
              });
            }
          }
        }
        
        // Détection de relations par nom de champ similaire
        if (field.name === 'user_id' || field.name === 'author_id' || field.name === 'owner_id') {
          const userTable = schema.tables.find(t => t.name === 'users' || t.name === 'user');
          if (userTable) {
            const userPK = userTable.fields.find(f => f.primary_key);
            if (userPK) {
              suggestions.push({
                fromTable: table.name,
                fromField: field.name,
                toTable: userTable.name,
                toField: userPK.name,
                type: 'one-to-many',
                confidence: 'high',
                reason: `Relation utilisateur standard détectée`
              });
            }
          }
        }
      });
    });
    
    // Relations many-to-many détectées (tables de jonction)
    schema.tables.forEach(table => {
      if (table.fields.length === 3) { // id + 2 foreign keys
        const foreignKeys = table.fields.filter(f => f.name.endsWith('_id') && !f.primary_key);
        if (foreignKeys.length === 2) {
          const table1Name = foreignKeys[0].name.replace('_id', 's');
          const table2Name = foreignKeys[1].name.replace('_id', 's');
          const table1 = schema.tables.find(t => t.name === table1Name);
          const table2 = schema.tables.find(t => t.name === table2Name);
          
          if (table1 && table2) {
            suggestions.push({
              fromTable: table1.name,
              fromField: table1.fields.find(f => f.primary_key)?.name || 'id',
              toTable: table2.name,
              toField: table2.fields.find(f => f.primary_key)?.name || 'id',
              type: 'many-to-many',
              confidence: 'medium',
              reason: `Table de jonction "${table.name}" détectée`
            });
          }
        }
      }
    });
    
    return suggestions.slice(0, 6); // Limiter à 6 suggestions
  };
  
  const suggestions = generateSuggestions();
  
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Relations Suggérées
        </CardTitle>
        <p className="text-sm text-slate-600">
          Basées sur l'analyse de vos tables et conventions de nommage
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">{suggestion.fromTable}</Badge>
                <span className="text-sm text-slate-600">{suggestion.fromField}</span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <Badge variant="outline" className="text-xs">{suggestion.toTable}</Badge>
                <span className="text-sm text-slate-600">{suggestion.toField}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    suggestion.type === 'one-to-many' ? 'bg-blue-100 text-blue-800' :
                    suggestion.type === 'one-to-one' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}
                >
                  {suggestion.type === 'one-to-one' && '1:1'}
                  {suggestion.type === 'one-to-many' && '1:N'}
                  {suggestion.type === 'many-to-many' && 'N:N'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">{suggestion.reason}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={suggestion.confidence === 'high' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {suggestion.confidence === 'high' ? 'Confiance élevée' : 
                 suggestion.confidence === 'medium' ? 'Confiance moyenne' : 'Confiance faible'}
              </Badge>
              <Button
                size="sm"
                onClick={() => onAddRelation({
                  fromTable: suggestion.fromTable,
                  fromField: suggestion.fromField,
                  toTable: suggestion.toTable,
                  toField: suggestion.toField,
                  type: suggestion.type
                })}
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}