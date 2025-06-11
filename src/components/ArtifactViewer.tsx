import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, FileCode, Database, Globe, Settings } from 'lucide-react';
import { GeneratedArtifacts } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';

interface ArtifactViewerProps {
  artifacts: GeneratedArtifacts;
  tableName: string;
  onClose: () => void;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({
  artifacts,
  tableName,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('sql');
  const { toast } = useToast();

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copié !",
      description: `Le code ${type} a été copié dans le presse-papiers.`,
    });
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const artifacts_config = [
    {
      id: 'sql',
      title: 'PostgreSQL/Supabase',
      icon: Database,
      content: artifacts.sql,
      filename: `${tableName}.sql`,
      mimeType: 'text/sql',
      description: 'Script SQL complet avec tables, contraintes, index et policies RLS'
    },
    {
      id: 'astro',
      title: 'Astro ContentCollection',
      icon: FileCode,
      content: artifacts.astro_config,
      filename: `config.ts`,
      mimeType: 'text/typescript',
      description: 'Configuration Astro avec schéma Zod typé'
    },
    {
      id: 'astro-page',
      title: 'Page Astro [slug]',
      icon: Globe,
      content: artifacts.astro_page,
      filename: `[slug].astro`,
      mimeType: 'text/html',
      description: 'Page dynamique Astro pour affichage du contenu'
    },
    {
      id: 'acf',
      title: 'WordPress ACF',
      icon: Settings,
      content: artifacts.acf_json,
      filename: `${tableName}-acf.json`,
      mimeType: 'application/json',
      description: 'Configuration ACF WordPress prête à importer'
    },
    {
      id: 'csv',
      title: 'Export CSV',
      icon: FileCode,
      content: artifacts.csv_data,
      filename: `${tableName}.csv`,
      mimeType: 'text/csv',
      description: 'Export CSV documenté avec structure complète'
    },
    {
      id: 'docs',
      title: 'Documentation',
      icon: FileCode,
      content: artifacts.documentation,
      filename: `${tableName}-docs.md`,
      mimeType: 'text/markdown',
      description: 'Documentation technique complète en Markdown'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-800">
                Artefacts générés pour "{tableName}"
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Code prêt à utiliser pour vos projets
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 rounded-none">
              {artifacts_config.map(config => {
                const Icon = config.icon;
                return (
                  <TabsTrigger 
                    key={config.id} 
                    value={config.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Icon className="h-4 w-4" />
                    {config.title}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {artifacts_config.map(config => (
              <TabsContent 
                key={config.id} 
                value={config.id} 
                className="m-0 max-h-[calc(90vh-200px)] overflow-hidden"
              >
                <div className="p-4 border-b bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{config.title}</h3>
                      <p className="text-sm text-slate-600">{config.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(config.content, config.title)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copier
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadFile(config.content, config.filename, config.mimeType)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-auto max-h-[calc(90vh-300px)]">
                  <pre className="p-4 text-sm bg-slate-900 text-slate-100 overflow-x-auto">
                    <code>{config.content}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
