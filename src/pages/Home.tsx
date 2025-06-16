
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Database, 
  Zap, 
  Shield, 
  Code, 
  Download,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Globe
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "IA Générative Avancée",
      description: "Génération automatique de schémas complets avec Gemini AI",
      color: "text-purple-600"
    },
    {
      icon: Database,
      title: "Multi-Formats",
      description: "Export SQL, JSON, YAML, XML, CSV avec documentation",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Interface Drag & Drop",
      description: "Mindmap interactive pour visualiser et éditer vos schémas",
      color: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Validation Experte",
      description: "Diagnostic et validation automatique des schémas",
      color: "text-green-600"
    },
    {
      icon: Code,
      title: "Génération de Code",
      description: "ACF WordPress, Supabase, Astro intégrés",
      color: "text-indigo-600"
    },
    {
      icon: Globe,
      title: "SEO Optimisé",
      description: "Optimisation automatique pour le référencement",
      color: "text-red-600"
    }
  ];

  const stats = [
    { label: "Projets Créés", value: "1,247", icon: Database },
    { label: "Schémas Générés", value: "5,891", icon: Sparkles },
    { label: "Utilisateurs Actifs", value: "342", icon: Users },
    { label: "Temps Économisé", value: "2,450h", icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Lead Developer",
      company: "TechCorp",
      content: "SchemaVerse a révolutionné notre processus de conception de base de données. L'IA génère des schémas parfaits en quelques minutes.",
      rating: 5
    },
    {
      name: "Alex Martin",
      role: "CTO",
      company: "StartupInc",
      content: "L'export multi-format et la génération de code nous font gagner des heures de développement à chaque projet.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              🚀 Nouveau : Génération IA batch pour toutes les tables
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6">
              Créez des{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                schémas parfaits
              </span>{" "}
              en quelques clics
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Plateforme intelligente de conception de bases de données avec IA générative, 
              mindmapping interactif et export multi-format professionnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
                <Link to="/new-project">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Créer un Projet
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Play className="w-5 h-5 mr-2" />
                Voir la Démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour créer des schémas de base de données professionnels
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 bg-slate-100`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Processus Simple en 4 Étapes
            </h2>
            <p className="text-xl text-slate-600">
              De l'idée au code en quelques minutes
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Définir le Projet", desc: "Nom, description et contexte" },
              { step: "2", title: "Choisir les Modules", desc: "Blog, e-commerce, galerie..." },
              { step: "3", title: "IA Analysis", desc: "Génération automatique avec IA" },
              { step: "4", title: "Mindmap & Export", desc: "Édition visuelle et export" }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold rounded-full mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Ce que disent nos utilisateurs
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role} • {testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à révolutionner vos schémas ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des centaines de développeurs qui ont choisi SchemaVerse
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-3">
              <Link to="/new-project">
                <Sparkles className="w-5 h-5 mr-2" />
                Commencer Gratuitement
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600">
              <Download className="w-5 h-5 mr-2" />
              Voir les Exemples
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
