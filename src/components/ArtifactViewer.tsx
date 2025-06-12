
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Download, Copy, Eye, Code, FileText, 
  Database, Settings, CheckCircle, X 
} from 'lucide-react';
import { GeneratedArtifacts } from '@/types/schema';
import { useToast } from '@/hooks/use-toast';

interface ArtifactViewerProps {
  artifacts: GeneratedArtifacts;
  tableName: string;
  onClose: () => void;
}

interface ArtifactInfo {
  key: keyof GeneratedArtifacts;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  fileExtension: string;
  language: string;
  color: string;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({
  artifacts,
  tableName,
  onClose
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { toast } = useToast();

  const artifactInfo: ArtifactInfo[] = [
    {
      key: 'sql',
      title: 'Script SQL',
      description: 'Commandes CREATE TABLE et contraintes',
      icon: Database,
      fileExtension: 'sql',
      language: 'sql',
      color: 'text-blue-600'
    },
    {
      key: 'astro_config',
      title: 'Configuration Astro',
      description: 'Fichier de configuration astro.config.mjs',
      icon: Settings,
      fileExtension: 'mjs',
      language: 'javascript',
      color: 'text-purple-600'
    },
    {
      key: 'acf_json',
      title: 'Champs ACF',
      description: 'Configuration JSON pour WordPress ACF',
      icon: Code,
      fileExtension: 'json',
      language: 'json',
      color: 'text-green-600'
    },
    {
      key: 'csv_data',
      title: 'Données CSV',
      description: 'Données d\'exemple au format CSV',
      icon: FileText,
      fileExtension: 'csv',
      language: 'text',
      color: 'text-orange-600'
    },
    {
      key: 'astro_page',
      title: 'Page Astro',
      description: 'Page de présentation du schéma',
      icon: Code,
      fileExtension: 'astro',
      language: 'html',
      color: 'text-indigo-600'
    },
    {
      key: 'documentation',
      title: 'Documentation',
      description: 'Documentation complète en Markdown',
      icon: FileText,
      fileExtension: 'md',
      language: 'markdown',
      color: 'text-slate-600'
    }
  ];

  const availableArtifacts = artifactInfo.filter(info => artifacts[info.key] && artifacts[info.key].trim() !== '');

  const copyToClipboard = async (content: string, key: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
      
      toast({
        title: "Copié !",
        description: "Le contenu a été copié dans le presse-papiers.",
      });
    } catch (error) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier le contenu.",
        variant: "destructive"
      });
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Téléchargement",
      description: `Le fichier ${filename} a été téléchargé.`,
    });
  };

  const downloadAllAsZip = () => {
    // Pour une implémentation complète, vous pourriez utiliser une librairie comme JSZip
    // Ici, on télécharge tous les fichiers individuellement
    availableArtifacts.forEach(info => {
      const content = artifacts[info.key];
      if (content) {
        const filename = `${tableName}_${info.key}.${info.fileExtension}`;
        setTimeout(() => downloadFile(content, filename), 100);
      }
    });
    
    toast({
      title: "Téléchargement multiple",
      description: `${availableArtifacts.length} fichier(s) téléchargé(s).`,
    });
  };

  const getFileSize = (content: string): string => {
    const bytes = new Blob([content]).size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getLineCount = (content: string): number => {
    return content.split('\n').length;
  };

  if (availableArtifacts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-slate-500">Aucun artefact généré</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-green-600" />
              Artefacts générés
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">
              {availableArtifacts.length} fichier(s) prêt(s) pour {tableName}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={downloadAllAsZip} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Tout télécharger
            </Button>
            <Button onClick={onClose} variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Résumé des artefacts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{availableArtifacts.length}</div>
            <div className="text-xs text-slate-600">Fichiers générés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {availableArtifacts.reduce((acc, info) => acc + getLineCount(artifacts[info.key]), 0)}
            </div>
            <div className="text-xs text-slate-600">Lignes de code</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {availableArtifacts.reduce((acc, info) => {
                const size = new Blob([artifacts[info.key]]).size;
                return acc + size;
              }, 0) < 1024 ? 
                `${availableArtifacts.reduce((acc, info) => {
                  const size = new Blob([artifacts[info.key]]).size;
                  return acc + size;
                }, 0)} B` :
                `${(availableArtifacts.reduce((acc, info) => {
                  const size = new Blob([artifacts[info.key]]).size;
                  return acc + size;
                }, 0) / 1024).toFixed(1)} KB`
              }
            </div>
            <div className="text-xs text-slate-600">Taille totale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {new Set(availableArtifacts.map(info => info.language)).size}
            </div>
            <div className="text-xs text-slate-600">Langages</div>
          </div>
        </div>

        <Tabs defaultValue={availableArtifacts[0]?.key} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {availableArtifacts.map((info) => {
              const IconComponent = info.icon;
              return (
                <TabsTrigger key={info.key} value={info.key} className="flex items-center gap-2">
                  <IconComponent className={`h-4 w-4 ${info.color}`} />
                  <span className="hidden md:inline">{info.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {availableArtifacts.map((info) => {
            const content = artifacts[info.key];
            const IconComponent = info.icon;
            
            return (
              <TabsContent key={info.key} value={info.key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-100`}>
                      <IconComponent className={`h-5 w-5 ${info.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{info.title}</h3>
                      <p className="text-sm text-slate-600">{info.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getFileSize(content)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getLineCount(content)} lignes
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(content, info.key)}
                    variant="outline"
                    size="sm"
                  >
                    {copiedKey === info.key ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copiedKey === info.key ? 'Copié !' : 'Copier'}
                  </Button>
                  
                  <Button
                    onClick={() => downloadFile(content, `${tableName}_${info.key}.${info.fileExtension}`)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>

                <div className="border rounded-lg bg-slate-50">
                  <div className="p-3 border-b bg-slate-100 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-600">
                        {tableName}_{info.key}.{info.fileExtension}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {info.language}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 max-h-96 overflow-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{content}</pre>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
};
