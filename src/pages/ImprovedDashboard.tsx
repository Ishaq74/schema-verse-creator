
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Calendar,
  Database,
  Users,
  Download,
  Edit,
  Trash2,
  Copy,
  Eye,
  Star,
  Clock,
  TrendingUp,
  FileText,
  Sparkles,
  Settings
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "completed" | "archived";
  tablesCount: number;
  fieldsCount: number;
  lastModified: string;
  created: string;
  starred: boolean;
  modules: string[];
  size: "small" | "medium" | "large";
}

export default function ImprovedDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastModified");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data - en production, ceci viendrait d'une API
  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "E-commerce Fashion",
      description: "Plateforme de vente en ligne pour vêtements et accessoires avec gestion des stocks",
      status: "active",
      tablesCount: 12,
      fieldsCount: 89,
      lastModified: "2024-01-15",
      created: "2024-01-10",
      starred: true,
      modules: ["ecommerce", "blog", "users"],
      size: "large"
    },
    {
      id: "2", 
      name: "Blog Tech",
      description: "Blog technique avec système de commentaires et newsletter",
      status: "completed",
      tablesCount: 6,
      fieldsCount: 45,
      lastModified: "2024-01-12",
      created: "2024-01-08",
      starred: false,
      modules: ["blog", "newsletter"],
      size: "medium"
    },
    {
      id: "3",
      name: "Portfolio Créatif",
      description: "Site portfolio pour designer avec galerie et formulaire de contact",
      status: "draft",
      tablesCount: 4,
      fieldsCount: 23,
      lastModified: "2024-01-14",
      created: "2024-01-14",
      starred: true,
      modules: ["gallery", "contact"],
      size: "small"
    },
    {
      id: "4",
      name: "App Formation",
      description: "Plateforme de formation en ligne avec quiz et certificats",
      status: "active",
      tablesCount: 15,
      fieldsCount: 112,
      lastModified: "2024-01-13",
      created: "2024-01-05",
      starred: false,
      modules: ["learning", "users", "certificates"],
      size: "large"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "active": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "archived": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case "small": return "🔸";
      case "medium": return "🔶";
      case "large": return "🔴";
      default: return "🔸";
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: "Projets Totaux", value: projects.length, icon: Database, color: "text-blue-600" },
    { label: "Projets Actifs", value: projects.filter(p => p.status === "active").length, icon: TrendingUp, color: "text-green-600" },
    { label: "Tables Créées", value: projects.reduce((acc, p) => acc + p.tablesCount, 0), icon: FileText, color: "text-purple-600" },
    { label: "Favoris", value: projects.filter(p => p.starred).length, icon: Star, color: "text-yellow-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Mes Projets</h1>
          <p className="text-slate-600 mt-1">Gérez et organisez vos schémas de base de données</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Link to="/new-project">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Projet
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un projet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastModified">Dernière modification</SelectItem>
                  <SelectItem value="created">Date de création</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                  <SelectItem value="tablesCount">Nombre de tables</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getSizeIcon(project.size)}</span>
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status === "draft" && "Brouillon"}
                        {project.status === "active" && "Actif"}
                        {project.status === "completed" && "Terminé"}
                        {project.status === "archived" && "Archivé"}
                      </Badge>
                      {project.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="w-4 h-4 mr-2" />
                      Voir le détail
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="w-4 h-4 mr-2" />
                      Dupliquer
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4 line-clamp-2">
                {project.description}
              </CardDescription>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Database className="w-4 h-4 mr-1" />
                      {project.tablesCount} tables
                    </span>
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {project.fieldsCount} champs
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.modules.slice(0, 3).map((module, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {module}
                    </Badge>
                  ))}
                  {project.modules.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.modules.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Modifié le {new Date(project.lastModified).toLocaleDateString('fr-FR')}
                  </span>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/project/${project.id}`}>
                      Ouvrir
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Database className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun projet trouvé</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || statusFilter !== "all" 
                ? "Essayez de modifier vos filtres de recherche"
                : "Créez votre premier projet pour commencer"
              }
            </p>
            <Button asChild>
              <Link to="/new-project">
                <Plus className="w-4 h-4 mr-2" />
                Créer un projet
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
