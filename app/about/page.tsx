import Link from "next/link";
import { Shield, Star, Zap, MapPin, Search, Form, Phone, ChevronRight } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Confiance",
      description: "Artisans vérifiés avec documents d'identité"
    },
    {
      icon: Star,
      title: "Qualité",
      description: "Chaque prestation évaluée par le client"
    },
    {
      icon: Zap,
      title: "Rapidité",
      description: "Réponse en 2h, intervention le jour même"
    },
    {
      icon: MapPin,
      title: "Local",
      description: "Artisans dans votre ville pour interventions rapides"
    }
  ];

  const cities = [
    { name: "Casablanca", artisans: 156, status: "Disponible" },
    { name: "Rabat", artisans: 98, status: "Disponible" },
    { name: "Marrakech", artisans: 87, status: "Disponible" },
    { name: "Fès", artisans: 65, status: "En expansion" },
    { name: "Tanger", artisans: 54, status: "Disponible" },
    { name: "Agadir", artisans: 43, status: "En expansion" },
    { name: "Meknès", artisans: 38, status: "En expansion" },
    { name: "Oujda", artisans: 29, status: "En expansion" },
    { name: "Tétouan", artisans: 25, status: "En expansion" }
  ];

  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Notre <span className="relative">
              mission
              <span className="absolute bottom-0 left-0 w-full h-3 bg-[#0B2C5E] opacity-30"></span>
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            M3allam Connect est né d'une idée simple: rendre l'accès aux artisans qualifiés 
            facile, rapide et fiable pour tous les Marocains
          </p>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre histoire</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Tout a commencé en 2023, lorsque trois amis marocains ont fait face à un problème 
                  commun: trouver un artisan fiable et disponible pour des travaux d'urgence. 
                  Après des heures de recherche et d'appels infructueux, ils ont réalisé que le 
                  problème touchait des milliers de familles à travers le pays.
                </p>
                <p>
                  M3allam Connect est né de cette expérience. Notre mission est de créer un 
                  pont numérique entre les clients qui ont besoin de services et les artisans 
                  qualifiés qui cherchent à développer leur activité. Nous croyons en la 
                  puissance de la technologie pour simplifier la vie quotidienne des Marocains.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers de connecter plus de 500 artisans vérifiés avec 
                  des milliers de clients dans 12 villes du Maroc. Chaque jour, nous travaillons 
                  pour étendre notre réseau et améliorer notre service pour rendre l'accès aux 
                  services à domicile encore plus simple.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="px-4 py-2 bg-blue-100 text-[#0B2C5E] rounded-full font-medium">
                  2023 Fondation
                </span>
                <span className="px-4 py-2 bg-blue-100 text-[#0B2C5E] rounded-full font-medium">
                  2024 500 artisans
                </span>
                <span className="px-4 py-2 bg-blue-100 text-[#0B2C5E] rounded-full font-medium">
                  2025 12 villes
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
                <span className="text-gray-400 text-6xl">⭐</span>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#0B2C5E] rounded-full flex items-center justify-center text-white font-bold text-xl">
                500+
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-[#0B2C5E] font-bold">
                12
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-16 px-4 bg-[#B8CDD1]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nos valeurs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center card-lift">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-[#0B2C5E]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Comment fonctionne la plateforme?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Pour les clients */}
            <div>
              <h3 className="text-xl font-bold text-[#0B2C5E] mb-6">Pour les clients</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#0B2C5E] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Choisissez votre service</h4>
                    <p className="text-gray-600">
                      Parcourez nos catégories et sélectionnez le service dont vous avez besoin
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#0B2C5E] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Remplissez le formulaire</h4>
                    <p className="text-gray-600">
                      Décrivez votre problème et ajoutez une vidéo pour un diagnostic plus précis
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#0B2C5E] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Soyez contacté rapidement</h4>
                    <p className="text-gray-600">
                      Un artisan qualifié proche de chez vous vous contacte dans les 2 heures
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pour les artisans */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Pour les artisans</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Inscrivez-vous gratuitement</h4>
                    <p className="text-gray-600">
                      Créez votre profil en quelques minutes et faites vérifier vos compétences
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Recevez des demandes</h4>
                    <p className="text-gray-600">
                      Accédez à des clients qualifiés dans votre zone d'intervention
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Développez votre activité</h4>
                    <p className="text-gray-600">
                      Bâtissez votre réputation avec les avis clients et augmentez vos revenus
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CITIES SECTION */}
      <section className="py-16 px-4 bg-[#B8CDD1]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Nos villes couvertes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-[#0B2C5E] card-lift">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{city.name}</h3>
                <p className="text-[#0B2C5E] font-medium mb-3">{city.artisans} artisans</p>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  city.status === "Disponible" 
                    ? "bg-[#0B2C5E] text-white" 
                    : "bg-blue-100 text-[#0B2C5E]"
                }`}>
                  {city.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-4 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Prêt à commencer?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Rejoignez des milliers de Marocains qui utilisent M3allam Connect 
            pour leurs besoins quotidiens
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/request"
              className="px-8 py-4 bg-[#0B2C5E] text-white rounded-lg hover:bg-[#081f45] transition-colors font-medium"
            >
              Demander un service
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 border border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors font-medium"
            >
              Devenir M3allam
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
