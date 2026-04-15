"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Star, MapPin, Clock, CheckCircle, ChevronDown } from "lucide-react";

export default function ProvidersPage() {
  const [city, setCity] = useState("");
  const [service, setService] = useState("Tous");
  const [sortBy, setSortBy] = useState("Pertinence");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda"];
  const services = ["Tous", "Plomberie", "Électricité", "Peinture", "Menuiserie", "Nettoyage", "Climatisation", "Jardinage", "Déménagement"];
  const sortOptions = ["Pertinence", "Mieux notés", "Prix croissant", "Prix décroissant", "Plus expérimenté", "Disponible maintenant"];
  const quickFilters = ["Disponible maintenant", "Mieux notés", "Moins cher", "Plus expérimenté", "Urgent"];

  const providers = [
    {
      id: 1,
      name: "Karim Benani",
      skill: "Plomberie",
      rating: 4.8,
      reviews: 47,
      city: "Casablanca",
      responseTime: "~2h",
      skills: ["Plomberie", "Étanchéité", "Sanitaire"],
      rate: 150,
      experience: "5-10 ans",
      available: true,
      verified: true
    },
    {
      id: 2,
      name: "Youssef Amrani",
      skill: "Électricité",
      rating: 4.9,
      reviews: 62,
      city: "Rabat",
      responseTime: "~1h",
      skills: ["Électricité", "Climatisation", "Sécurité"],
      rate: 180,
      experience: "Plus de 10 ans",
      available: true,
      verified: true
    },
    {
      id: 3,
      name: "Fatima Zahra",
      skill: "Peinture",
      rating: 4.7,
      reviews: 34,
      city: "Marrakech",
      responseTime: "~3h",
      skills: ["Peinture", "Décoration", "Finitions"],
      rate: 120,
      experience: "3-5 ans",
      available: false,
      verified: true
    },
    {
      id: 4,
      name: "Mohamed El Idrissi",
      skill: "Menuiserie",
      rating: 4.9,
      reviews: 28,
      city: "Fès",
      responseTime: "~2h",
      skills: ["Menuiserie", "Agencement", "Restauration"],
      rate: 200,
      experience: "Plus de 10 ans",
      available: true,
      verified: true
    },
    {
      id: 5,
      name: "Samira Khattabi",
      skill: "Nettoyage",
      rating: 4.6,
      reviews: 55,
      city: "Tanger",
      responseTime: "~1h",
      skills: ["Nettoyage", "Entretien", "Déménagement"],
      rate: 80,
      experience: "5-10 ans",
      available: true,
      verified: true
    },
    {
      id: 6,
      name: "Abdelkader",
      skill: "Climatisation",
      rating: 4.8,
      reviews: 41,
      city: "Agadir",
      responseTime: "~4h",
      skills: ["Climatisation", "Chauffage", "VMC"],
      rate: 220,
      experience: "5-10 ans",
      available: false,
      verified: true
    }
  ];

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="flex flex-col">
      {/* HERO SEARCH SECTION */}
      <section className="hero-gradient py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trouvez votre artisan
          </h1>
          <p className="text-gray-600 mb-8">
            Recherchez parmi 500+ artisans vérifiés et disponibles partout au Maroc
          </p>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Entrez votre ville..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8B71]"
                />
                {city && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg mt-1 shadow-lg z-10">
                    {cities.filter(c => c.toLowerCase().includes(city.toLowerCase())).map(c => (
                      <div
                        key={c}
                        className="px-3 py-2 hover:bg-[#C2E0C6] cursor-pointer"
                        onClick={() => setCity(c)}
                      >
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8B71] appearance-none"
                >
                  {services.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              
              <button className="bg-[#0B3B24] text-white rounded-lg hover:bg-[#072a19] transition-colors font-medium flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {quickFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilters.includes(filter)
                      ? "bg-[#0B3B24] text-white"
                      : "bg-white border border-[#0B3B24] text-[#0B3B24] hover:bg-[#C2E0C6]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS SECTION */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <p className="text-gray-600 italic mb-4 md:mb-0">
              47 artisans trouvés à Casablanca pour Plomberie
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8B71] appearance-none"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>Trier par: {option}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map(provider => (
              <div
                key={provider.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#4A8B71] hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gray-200 rounded-full border-2 border-gray-300"></div>
                    {provider.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-gray-900 text-lg">{provider.name}</h3>
                    <p className="text-[#0B3B24] font-medium">{provider.skill}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(provider.rating) ? 'text-[#4A8B71] fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-bold text-gray-900">{provider.rating}</span>
                    <span className="text-gray-500 text-sm">({provider.reviews} avis)</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {provider.city}
                    <span className="mx-2">|</span>
                    <Clock className="w-4 h-4 mr-1" />
                    {provider.responseTime}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {provider.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-1 border border-[#0B3B24] text-[#0B3B24] rounded-full text-xs">
                        {skill}
                      </span>
                    ))}
                    {provider.skills.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 rounded-full text-xs">
                        +{provider.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">{provider.rate} MAD/h</span>
                    <span className="text-gray-500 text-sm">({provider.experience} exp.)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className={`w-full py-2 rounded-full text-center text-sm font-medium ${
                    provider.available
                      ? "bg-green-100 text-green-700"
                      : "bg-[#C2E0C6] text-[#0B3B24]"
                  }`}>
                    {provider.available ? "Disponible" : "Occupé jusqu'au 12/04"}
                  </div>
                  
                  <Link
                    href={`/providers/${provider.id}`}
                    className="block w-full py-3 border border-[#0B3B24] text-[#0B3B24] rounded-lg hover:bg-[#C2E0C6] transition-colors text-center font-medium"
                  >
                    Voir le profil
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              Affichage 1-6 sur 47 artisans
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                Précédent
              </button>
              <button className="w-8 h-8 bg-[#0B3B24] text-white rounded-full">1</button>
              <button className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
              <button className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
              <span className="px-2">...</span>
              <button className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50">8</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
