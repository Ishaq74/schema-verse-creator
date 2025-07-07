
import React, { useState } from "react";
import { Schema, Table } from "@/types/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Link, CheckCircle, AlertTriangle, Database, Eye, Settings, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import RelationDiagram from './RelationDiagram';
import RelationSuggestions from './RelationSuggestions';

interface Relation {
  id: string;
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

interface Step4RelationsProps {
  schema: Schema;
  onBack: () => void;
  onNext: () => void;
  onUpdateSchema: (schema: Schema) => void;
}

export default function Step4Relations({
  schema,
  onBack,
  onNext,
  onUpdateSchema,
}: Step4RelationsProps) {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [newRelation, setNewRelation] = useState<Partial<Relation>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateSchema = () => {
    const errors: string[] = [];
    
    // Vérifier que chaque table a au moins un champ
    schema.tables.forEach(table => {
      if (table.fields.length === 0) {
        errors.push(`La table "${table.name}" n'a aucun champ`);
      }
      
      // Vérifier qu'il y a une clé primaire
      const hasPrimaryKey = table.fields.some(field => field.primary_key);
      if (!hasPrimaryKey) {
        errors.push(`La table "${table.name}" n'a pas de clé primaire`);
      }
      
      // Vérifier les noms de champs uniques
      const fieldNames = table.fields.map(f => f.name.toLowerCase());
      const duplicates = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
      if (duplicates.length > 0) {
        errors.push(`La table "${table.name}" a des champs en double: ${duplicates.join(', ')}`);
      }
    });
    
    // Vérifier les noms de tables uniques
    const tableNames = schema.tables.map(t => t.name.toLowerCase());
    const duplicateTables = tableNames.filter((name, index) => tableNames.indexOf(name) !== index);
    if (duplicateTables.length > 0) {
      errors.push(`Noms de tables en double: ${duplicateTables.join(', ')}`);
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const addRelation = (relationData?: Omit<Relation, 'id'>) => {
    const relation = relationData || newRelation;
    
    if (!relation.fromTable || !relation.fromField || !relation.toTable || !relation.toField || !relation.type) {
      toast({ title: "Relation incomplète", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    
    const newRelationObj: Relation = {
      id: `rel_${Date.now()}`,
      fromTable: relation.fromTable!,
      fromField: relation.fromField!,
      toTable: relation.toTable!,
      toField: relation.toField!,
      type: relation.type!
    };
    
    setRelations([...relations, newRelationObj]);
    if (!relationData) {
      setNewRelation({});
    }
    toast({ title: "Relation ajoutée", description: "La relation a été créée avec succès" });
  };

  const removeRelation = (id: string) => {
    setRelations(relations.filter(r => r.id !== id));
  };

  const getTableFields = (tableName: string) => {
    const table = schema.tables.find(t => t.name === tableName);
    return table ? table.fields : [];
  };

  const isValid = validationErrors.length === 0;

  React.useEffect(() => {
    validateSchema();
  }, [schema]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Relations et Validation</h2>
        <p className="text-slate-600">Définissez les relations entre vos tables et validez votre schéma</p>
      </div>

      {/* Validation du schéma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {isValid ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
            )}
            Validation du Schéma
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isValid ? (
            <div className="text-green-600">
              ✅ Votre schéma est valide et prêt à être exporté
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-red-600 font-medium">Erreurs détectées:</div>
              {validationErrors.map((error, index) => (
                <div key={index} className="text-red-600 text-sm">
                  • {error}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistiques du schéma */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{schema.tables.length}</div>
            <div className="text-sm text-slate-600">Tables</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {schema.tables.reduce((acc, table) => acc + table.fields.length, 0)}
            </div>
            <div className="text-sm text-slate-600">Champs au total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{relations.length}</div>
            <div className="text-sm text-slate-600">Relations</div>
          </CardContent>
        </Card>
      </div>

      {/* Relations suggérées */}
      <RelationSuggestions 
        schema={schema} 
        onAddRelation={addRelation}
      />

      {/* Interface avec onglets */}
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Éditeur de Relations
          </TabsTrigger>
          <TabsTrigger value="diagram" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Diagramme Visuel
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Relations entre Tables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Ajouter une nouvelle relation */}
              <div className="p-4 border rounded-lg bg-slate-50">
                <h3 className="font-medium mb-3">Ajouter une relation manuelle</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
                  <div>
                    <label className="text-sm text-slate-600">Table source</label>
                    <Select value={newRelation.fromTable} onValueChange={(value) => setNewRelation({...newRelation, fromTable: value, fromField: undefined})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Table" />
                      </SelectTrigger>
                      <SelectContent>
                        {schema.tables.map(table => (
                          <SelectItem key={table.id} value={table.name}>{table.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-600">Champ source</label>
                    <Select value={newRelation.fromField} onValueChange={(value) => setNewRelation({...newRelation, fromField: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Champ" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTableFields(newRelation.fromTable || '').map(field => (
                          <SelectItem key={field.name} value={field.name}>{field.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-600">Table cible</label>
                    <Select value={newRelation.toTable} onValueChange={(value) => setNewRelation({...newRelation, toTable: value, toField: undefined})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Table" />
                      </SelectTrigger>
                      <SelectContent>
                        {schema.tables.map(table => (
                          <SelectItem key={table.id} value={table.name}>{table.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-600">Champ cible</label>
                    <Select value={newRelation.toField} onValueChange={(value) => setNewRelation({...newRelation, toField: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Champ" />
                      </SelectTrigger>
                      <SelectContent>
                        {getTableFields(newRelation.toTable || '').map(field => (
                          <SelectItem key={field.name} value={field.name}>{field.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-600">Type</label>
                    <Select value={newRelation.type} onValueChange={(value: any) => setNewRelation({...newRelation, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-to-one">1:1</SelectItem>
                        <SelectItem value="one-to-many">1:N</SelectItem>
                        <SelectItem value="many-to-many">N:N</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="mt-3" onClick={() => addRelation()}>
                  Ajouter la relation
                </Button>
              </div>

              {/* Liste des relations */}
              <div className="space-y-2">
                {relations.map(relation => (
                  <div key={relation.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">{relation.fromTable}</Badge>
                      <span className="text-sm text-slate-600">{relation.fromField}</span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <Badge variant="outline" className="bg-green-50 text-green-700">{relation.toTable}</Badge>
                      <span className="text-sm text-slate-600">{relation.toField}</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          relation.type === 'one-to-many' ? 'bg-blue-100 text-blue-800' :
                          relation.type === 'one-to-one' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {relation.type === 'one-to-one' && '1:1'}
                        {relation.type === 'one-to-many' && '1:N'}
                        {relation.type === 'many-to-many' && 'N:N'}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeRelation(relation.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
                {relations.length === 0 && (
                  <div className="text-center text-slate-500 py-8">
                    <Link className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p>Aucune relation définie</p>
                    <p className="text-sm">Utilisez les suggestions ci-dessus ou créez une relation manuelle</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diagram">
          <RelationDiagram schema={schema} relations={relations} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          onClick={onNext}
          disabled={!isValid}
        >
          Générer et Exporter
        </Button>
      </div>
    </div>
  );
}
