
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Download, 
  Eye, 
  Copy,
  Star,
  ShoppingCart,
  FileText,
  Camera,
  Users,
  BookOpen,
  Briefcase,
  Heart,
  Music,
  Home,
  Gamepad2,
  Sparkles
} from "lucide-react";

interface SchemaPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  tablesCount: number;
  fieldsCount: number;
  complexity: "simple" | "intermediate" | "advanced";
  tags: string[];
  downloads: number;
  rating: number;
  icon: any;
  preview: string[];
  useCase: string;
}

export default function PresetLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [complexityFilter, setComplexityFilter] = useState("all");

  const presets: SchemaPreset[] = [
    {
      id: "ecommerce-complete",
      name: "E-commerce Complet",
      description: "Schéma complet pour boutique en ligne avec gestion produits, commandes, paiements et stock",
      category: "E-commerce",
      tablesCount: 15,
      fieldsCount: 120,
      complexity: "advanced",
      tags: ["Stripe", "Inventaire", "SEO", "Multi-langue"],
      downloads: 1247,
      rating: 4.8,
      icon: ShoppingCart,
      preview: ["products", "orders", "customers", "payments", "inventory"],
      useCase: "Boutique en ligne, marketplace, dropshipping"
    },
    {
      id: "blog-premium",
      name: "Blog Premium",
      description: "Blog avancé avec commentaires, newsletter, SEO et système de tags",
      category: "Content",
      tablesCount: 8,
      fieldsCount: 65,
      complexity: "intermediate",
      tags: ["SEO", "Newsletter", "Commentaires", "Tags"],
      downloads: 892,
      rating: 4.6,
      icon: FileText,
      preview: ["posts", "comments", "categories", "tags", "subscribers"],
      useCase: "Blog personnel, magazine, site d'actualités"
    },
    {
      id: "portfolio-creative",
      name: "Portfolio Créatif",
      description: "Site portfolio pour designers et artistes avec galerie et formulaires de contact",
      category: "Portfolio",
      tablesCount: 6,
      fieldsCount: 42,
      complexity: "simple",
      tags: ["Galerie", "Contact", "SEO"],
      downloads: 567,
      rating: 4.7,
      icon: Camera,
      preview: ["projects", "galleries", "contacts", "testimonials"],
      useCase: "Portfolio designer, photographe, artiste"
    },
    {
      id: "learning-platform",
      name: "Plateforme de Formation",
      description: "LMS complet avec cours, quiz, certificats et suivi des progrès",
      category: "Education",
      tablesCount: 18,
      fieldsCount: 145,
      complexity: "advanced",
      tags: ["LMS", "Quiz", "Certificats", "Vidéo"],
      downloads: 734,
      rating: 4.9,
      icon: BookOpen,
      preview: ["courses", "lessons", "quizzes", "certificates", "progress"],
      useCase: "Formation en ligne, université, corporate training"
    },
    {
      id: "social-network",
      name: "Réseau Social",
      description: "Plateforme sociale avec profils, posts, messages et système d'amis",
      category: "Social",
      tablesCount: 12,
      fieldsCount: 95,
      complexity: "advanced",
      tags: ["Chat", "Notifications", "Amis", "Timeline"],
      downloads: 456,
      rating: 4.5,
      icon: Users,
      preview: ["users", "posts", "messages", "friendships", "notifications"],
      useCase: "Réseau social, communauté, forum"
    },
    {
      id: "restaurant-management",
      name: "Gestion Restaurant",
      description: "Système complet pour restaurant avec menu, réservations et commandes",
      category: "Business",
      tablesCount: 10,
      fieldsCount: 78,
      complexity: "intermediate",
      tags: ["Réservations", "Menu", "POS", "Livraison"],
      downloads: 323,
      rating: 4.4,
      icon: Briefcase,
      preview: ["menu", "reservations", "orders", "tables", "staff"],
      useCase: "Restaurant, café, food truck"
    }
  ];

  const categories = ["all", "E-commerce", "Content", "Portfolio", "Education", "Social", "Business"];
  const complexities = ["all", "simple", "intermediate", "advanced"];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case "simple": return "Simple";
      case "intermediate": return "Intermédiaire";
      case "advanced": return "Avancé";
      default: return complexity;
    }
  };

  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || preset.category === categoryFilter;
    const matchesComplexity = complexityFilter === "all" || preset.complexity === complexityFilter;
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Bibliothèque de Présets
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Démarrez rapidement avec nos schémas prêts à l'emploi, 
          testés et optimisés pour différents types de projets
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher un préset..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Toutes les catégories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={complexityFilter} onValueChange={setComplexityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Complexité" />
                </SelectTrigger>
                <SelectContent>
                  {complexities.map(complexity => (
                    <SelectItem key={complexity} value={complexity}>
                      {complexity === "all" ? "Toutes complexités" : getComplexityLabel(complexity)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map((preset) => {
          const Icon = preset.icon;
          return (
            <Card key={preset.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{preset.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{preset.category}</Badge>
                        <Badge className={getComplexityColor(preset.complexity)}>
                          {getComplexityLabel(preset.complexity)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {preset.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{preset.tablesCount} tables</span>
                    <span>{preset.fieldsCount} champs</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      {preset.rating}
                    </div>
                  </div>

                  {/* Preview Tables */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-2">Tables principales :</p>
                    <div className="flex flex-wrap gap-1">
                      {preset.preview.slice(0, 4).map((table, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {table}
                        </Badge>
                      ))}
                      {preset.preview.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{preset.preview.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-2">Fonctionnalités :</p>
                    <div className="flex flex-wrap gap-1">
                      {preset.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {preset.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{preset.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Use Case */}
                  <div className="bg-slate-50 p-3 rounded text-xs">
                    <p className="font-medium text-slate-700 mb-1">Cas d'usage :</p>
                    <p className="text-slate-600">{preset.useCase}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Utiliser
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Downloads counter */}
                  <div className="text-xs text-slate-500 text-center pt-2 border-t">
                    {preset.downloads.toLocaleString()} téléchargements
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredPresets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Sparkles className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun préset trouvé</h3>
            <p className="text-slate-600 mb-6">
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
              setComplexityFilter("all");
            }}>
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
