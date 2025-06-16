
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Database, 
  Users, 
  Clock,
  Download,
  Star,
  Activity,
  Calendar,
  Target,
  Zap,
  FileText
} from "lucide-react";

export default function Analytics() {
  const metrics = [
    {
      title: "Projets Créés",
      value: "23",
      change: "+12%",
      trend: "up",
      icon: Database,
      description: "Ce mois-ci"
    },
    {
      title: "Tables Générées",
      value: "156",
      change: "+28%", 
      trend: "up",
      icon: FileText,
      description: "Total"
    },
    {
      title: "Temps Économisé",
      value: "47h",
      change: "+15%",
      trend: "up", 
      icon: Clock,
      description: "Cette semaine"
    },
    {
      title: "Exports Réalisés",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: Download,
      description: "Ce mois-ci"
    }
  ];

  const recentActivity = [
    { action: "Projet créé", name: "E-commerce Fashion", time: "Il y a 2h", type: "create" },
    { action: "Export SQL", name: "Blog Tech", time: "Il y a 4h", type: "export" },
    { action: "IA Génération", name: "Portfolio Créatif", time: "Il y a 6h", type: "ai" },
    { action: "Schéma validé", name: "App Formation", time: "Il y a 1j", type: "validate" },
  ];

  const topPresets = [
    { name: "E-commerce Complet", downloads: 1247, rating: 4.8 },
    { name: "Blog Premium", downloads: 892, rating: 4.6 },
    { name: "Portfolio Créatif", downloads: 567, rating: 4.7 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">Suivez vos performances et votre productivité</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                    <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{metric.change}</span>
                      <span className="text-sm text-slate-500 ml-1">{metric.description}</span>
                    </div>
                  </div>
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Activité Récente
            </CardTitle>
            <CardDescription>Vos dernières actions dans l'application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'create' ? 'bg-green-500' :
                      activity.type === 'export' ? 'bg-blue-500' :
                      activity.type === 'ai' ? 'bg-purple-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-medium text-slate-900">{activity.action}</p>
                      <p className="text-sm text-slate-600">{activity.name}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Presets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              Présets Populaires
            </CardTitle>
            <CardDescription>Les présets les plus téléchargés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPresets.map((preset, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{preset.name}</p>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-sm text-slate-600">
                        {preset.downloads.toLocaleString()} téléchargements
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm text-slate-600">{preset.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Insights d'Usage
          </CardTitle>
          <CardDescription>Optimisez votre workflow avec ces recommandations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Productivité</h3>
              <p className="text-sm text-slate-600 mb-3">
                Vous êtes 2.3x plus rapide qu'avant avec l'IA
              </p>
              <Button size="sm" variant="outline">Voir détails</Button>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Régularité</h3>
              <p className="text-sm text-slate-600 mb-3">
                Activité constante ces 30 derniers jours
              </p>
              <Button size="sm" variant="outline">Planifier</Button>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <BarChart3 className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Croissance</h3>
              <p className="text-sm text-slate-600 mb-3">
                +45% de projets créés ce mois
              </p>
              <Button size="sm" variant="outline">Analyser</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
