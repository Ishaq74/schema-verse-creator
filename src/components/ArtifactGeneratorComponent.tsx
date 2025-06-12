
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCode, Loader2, Download } from 'lucide-react';
import { Schema, GeneratedArtifacts } from '@/types/schema';
import { ArtifactGenerator } from './ArtifactGenerator';
import { useToast } from '@/hooks/use-toast';

interface ArtifactGeneratorComponentProps {
  schema: Schema;
  onGenerate: (artifacts: GeneratedArtifacts) => void;
}

export const ArtifactGeneratorComponent: React.FC<ArtifactGeneratorComponentProps> = ({
  schema,
  onGenerate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerateAll = async () => {
    if (schema.tables.length === 0) {
      toast({
        title: "Aucune table",
        description: "Ajoutez des tables à votre schéma avant de générer des artefacts.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate artifacts for the first table for now
      const firstTable = schema.tables[0];
      const artifacts = ArtifactGenerator.generateAll(firstTable);
      
      onGenerate(artifacts);
      
      toast({
        title: "Artefacts générés",
        description: `Code généré avec succès pour la table "${firstTable.name}".`,
      });
    } catch (error) {
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération des artefacts.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateTable = async (tableName: string) => {
    const table = schema.tables.find(t => t.name === tableName);
    if (!table) return;

    setIsGenerating(true);
    
    try {
      const artifacts = ArtifactGenerator.generateAll(table);
      onGenerate(artifacts);
      
      toast({
        title: "Artefacts générés",
        description: `Code généré avec succès pour la table "${table.name}".`,
      });
    } catch (error) {
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération des artefacts.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="h-5 w-5" />
          Générateur d'Artefacts
        </CardTitle>
        <p className="text-sm text-slate-600">
          Générez du code prêt à utiliser pour vos tables
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {schema.tables.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune table définie. Créez des tables pour générer des artefacts.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Tables disponibles ({schema.tables.length})</h3>
              <Button 
                onClick={handleGenerateAll}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Générer Tout
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              {schema.tables.map((table) => (
                <div key={table.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-medium">{table.name}</h4>
                      <p className="text-sm text-slate-600">{table.description}</p>
                    </div>
                    <Badge variant="secondary">{table.fields.length} champs</Badge>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleGenerateTable(table.name)}
                    disabled={isGenerating}
                    variant="outline"
                  >
                    Générer
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
