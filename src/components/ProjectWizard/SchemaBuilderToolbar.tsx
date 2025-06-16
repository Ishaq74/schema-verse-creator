
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Download, Upload, Eye, Database, FileText, Zap, Save, RefreshCw } from 'lucide-react';

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
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Constructeur de Schéma
          </h2>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {tableCount} tables
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {fieldCount} champs
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'builder' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('builder')}
            className={mode === 'builder' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <Database className="h-4 w-4 mr-2" />
            Construction
          </Button>
          <Button
            variant={mode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('preview')}
            className={mode === 'preview' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Rechercher tables ou champs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes catégories</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="content">Contenu</SelectItem>
              <SelectItem value="general">Général</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={onAddTable} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Table
          </Button>

          <Button onClick={onGenerateFromDescription} variant="outline" className="bg-purple-50 border-purple-200 hover:bg-purple-100">
            <Zap className="h-4 w-4 mr-2" />
            Générer avec IA
          </Button>

          <div className="h-6 w-px bg-slate-300" />

          <Button onClick={onImportSchema} variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>

          <Button onClick={onExportSchema} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>

          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>
    </div>
  );
}
