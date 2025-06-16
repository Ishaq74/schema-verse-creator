
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Upload, Eye, EyeOff, Database, FileText, Zap } from 'lucide-react';

interface SchemaBuilderToolbarProps {
  mode: 'builder' | 'preview';
  setMode: (mode: 'builder' | 'preview') => void;
  onAddTable: () => void;
  onImportSchema: () => void;
  onExportSchema: () => void;
  onGenerateFromDescription: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  tableCount: number;
  fieldCount: number;
}

export default function SchemaBuilderToolbar({
  mode,
  setMode,
  onAddTable,
  onImportSchema,
  onExportSchema,
  onGenerateFromDescription,
  searchTerm,
  setSearchTerm,
  tableCount,
  fieldCount
}: SchemaBuilderToolbarProps) {
  return (
    <div className="border-b bg-gradient-to-r from-slate-50 to-blue-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">Constructeur de Schéma</h2>
          <div className="flex gap-2">
            <Badge variant="secondary">{tableCount} tables</Badge>
            <Badge variant="secondary">{fieldCount} champs</Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'builder' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('builder')}
          >
            <Database className="h-4 w-4 mr-2" />
            Construction
          </Button>
          <Button
            variant={mode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('preview')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Rechercher tables ou champs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        
        <Button onClick={onAddTable} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Table
        </Button>

        <Button onClick={onGenerateFromDescription} variant="outline" className="bg-purple-50 border-purple-200">
          <Zap className="h-4 w-4 mr-2" />
          Générer avec IA
        </Button>

        <Button onClick={onImportSchema} variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Importer
        </Button>

        <Button onClick={onExportSchema} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>
    </div>
  );
}
