"use client";

import { useState } from "react";
import { Search, Filter, Eye, UserCheck, UserX, ChevronDown, TrendingUp, Users, AlertCircle, BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("demandes");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous les statuts");

  // Mock data
  const kpiCards = [
    { title: "Total demandes", value: "247", color: "text-gray-900" },
    { title: "Ce mois-ci", value: "38", color: "text-orange-500", change: "+12% vs mois dernier" },
    { title: "Prestataires actifs", value: "89", color: "text-gray-900" },
    { title: "En attente validation", value: "5", color: "text-amber-500", note: "À traiter" }
  ];

  const demandes = [
    {
      id: 1,
      client: "Youssef Alami",
      phone: "06 12 34 56 78",
      service: "Plomberie",
      city: "Casablanca",
      urgency: "Standard",
      video: true,
      date: "10/04/2025",
      status: "Nouvelle"
    },
    {
      id: 2,
      client: "Fatima Benali",
      phone: "06 23 45 67 89",
      service: "Électricité",
      city: "Rabat",
      urgency: "Urgent",
      video: true,
      date: "10/04/2025",
      status: "En cours"
    },
    {
      id: 3,
      client: "Mohamed Idrissi",
      phone: "06 34 56 78 90",
      service: "Peinture",
      city: "Marrakech",
      urgency: "Standard",
      video: false,
      date: "09/04/2025",
      status: "Terminée"
    },
    {
      id: 4,
      client: "Samira Khattabi",
      phone: "06 45 67 89 01",
      service: "Nettoyage",
      city: "Tanger",
      urgency: "Très urgent",
      video: true,
      date: "09/04/2025",
      status: "Nouvelle"
    },
    {
      id: 5,
      client: "Abdelkader",
      phone: "06 56 78 90 12",
      service: "Climatisation",
      city: "Agadir",
      urgency: "Urgent",
      video: false,
      date: "08/04/2025",
      status: "En cours"
    },
    {
      id: 6,
      client: "Karim Bennani",
      phone: "06 67 89 01 23",
      service: "Menuiserie",
      city: "Fès",
      urgency: "Standard",
      video: true,
      date: "08/04/2025",
      status: "Terminée"
    },
    {
      id: 7,
      client: "Amina Rouhani",
      phone: "06 78 90 12 34",
      service: "Jardinage",
      city: "Meknès",
      urgency: "Standard",
      video: false,
      date: "07/04/2025",
      status: "Nouvelle"
    }
  ];

  const prestataires = [
    {
      id: 1,
      name: "Karim Benani",
      photo: "KB",
      skills: ["Plomberie", "Étanchéité"],
      city: "Casablanca",
      experience: "5-10 ans",
      rate: "150 MAD/h",
      documents: "Complet",
      status: "Validé"
    },
    {
      id: 2,
      name: "Youssef Amrani",
      photo: "YA",
      skills: ["Électricité", "Climatisation"],
      city: "Rabat",
      experience: "Plus de 10 ans",
      rate: "180 MAD/h",
      documents: "Complet",
      status: "En attente"
    },
    {
      id: 3,
      name: "Fatima Zahra",
      photo: "FZ",
      skills: ["Peinture", "Décoration"],
      city: "Marrakech",
      experience: "3-5 ans",
      rate: "120 MAD/h",
      documents: "Incomplet",
      status: "En attente"
    },
    {
      id: 4,
      name: "Mohamed El Idrissi",
      photo: "ME",
      skills: ["Menuiserie", "Agencement"],
      city: "Fès",
      experience: "Plus de 10 ans",
      rate: "200 MAD/h",
      documents: "Complet",
      status: "Validé"
    },
    {
      id: 5,
      name: "Samira Khattabi",
      photo: "SK",
      skills: ["Nettoyage", "Entretien"],
      city: "Tanger",
      experience: "5-10 ans",
      rate: "80 MAD/h",
      documents: "Complet",
      status: "Suspendu"
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Standard": return "bg-green-100 text-green-700";
      case "Urgent": return "bg-orange-100 text-orange-700";
      case "Très urgent": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Nouvelle": return "bg-blue-100 text-blue-700";
      case "En cours": return "bg-orange-100 text-orange-700";
      case "Terminée": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case "Complet": return "bg-green-100 text-green-700";
      case "Incomplet": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getProviderStatusColor = (status: string) => {
    switch (status) {
      case "Validé": return "bg-green-100 text-green-700";
      case "En attente": return "bg-orange-100 text-orange-700";
      case "Suspendu": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ADMIN NAVBAR */}
      <nav className="bg-white border-b border-gray-200 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900 ml-2">M3allam</span>
              <span className="text-xl font-bold text-orange-500 ml-1">Connect</span>
            </div>
            
            {/* Center */}
            <div className="text-gray-600 font-medium">
              Tableau de bord
            </div>
            
            {/* Right */}
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="text-gray-900 font-medium">Admin</span>
              <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((card, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className={`text-3xl font-bold ${card.color} mb-2`}>
                  {card.value}
                </div>
                <div className="text-gray-600 text-sm mb-2">{card.title}</div>
                {card.change && (
                  <div className="text-green-600 text-xs">{card.change}</div>
                )}
                {card.note && (
                  <div className="text-orange-600 text-xs">{card.note}</div>
                )}
              </div>
            ))}
          </div>

          {/* TAB NAVIGATION */}
          <div className="bg-white rounded-xl border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              {[
                { id: "demandes", label: "Demandes clients" },
                { id: "prestataires", label: "Prestataires" },
                { id: "statistiques", label: "Statistiques" }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* TAB CONTENT */}
          {activeTab === "demandes" && (
            <div className="bg-white rounded-xl border border-gray-200">
              {/* Top bar */}
              <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                    >
                      <option>Tous les statuts</option>
                      <option>Nouvelle</option>
                      <option>En cours</option>
                      <option>Terminée</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vidéo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {demandes.map((demande) => (
                      <tr key={demande.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {demande.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{demande.client}</div>
                            <div className="text-sm text-gray-500">{demande.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">
                            {demande.service}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {demande.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${getUrgencyColor(demande.urgency)}`}>
                            {demande.urgency}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {demande.video ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              Oui
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {demande.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(demande.status)}`}>
                            {demande.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-orange-600 hover:text-orange-900">
                              <UserCheck className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                <span className="text-sm text-gray-700 mb-4 md:mb-0">
                  Affichage 1-7 sur 247 demandes
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    Précédent
                  </button>
                  <button className="w-8 h-8 bg-orange-500 text-white rounded-full">1</button>
                  <button className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                  <button className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "prestataires" && (
            <div className="bg-white rounded-xl border border-gray-200">
              {/* Top bar */}
              <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="relative">
                    <select className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none">
                      <option>Toutes les villes</option>
                      <option>Casablanca</option>
                      <option>Rabat</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none">
                      <option>Tous les services</option>
                      <option>Plomberie</option>
                      <option>Électricité</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prestataire</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expérience</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarif</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {prestataires.map((prestataire) => (
                      <tr key={prestataire.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                              {prestataire.photo}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{prestataire.name}</div>
                              <div className="flex flex-wrap gap-1">
                                {prestataire.skills.map((skill, i) => (
                                  <span key={i} className="text-xs text-gray-500">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {prestataire.city}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {prestataire.experience}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {prestataire.rate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${getDocumentStatusColor(prestataire.documents)}`}>
                            {prestataire.documents === "Complet" ? "Complet" : "Incomplet"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${getProviderStatusColor(prestataire.status)}`}>
                            {prestataire.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            {prestataire.status === "En attente" && (
                              <button className="text-orange-600 hover:text-orange-900">
                                <UserCheck className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-gray-600 hover:text-gray-900">
                              <UserX className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                <span className="text-sm text-gray-700 mb-4 md:mb-0">
                  Affichage 1-5 sur 89 prestataires
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Précédent
                  </button>
                  <button className="w-8 h-8 bg-orange-500 text-white rounded-full">1</button>
                  <button className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "statistiques" && (
            <div className="space-y-6">
              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Demandes par mois</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique linéaire des demandes mensuelles</p>
                    </div>
                  </div>
                </div>

                {/* Horizontal bar chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Top services demandés</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique en barres horizontales</p>
                    </div>
                  </div>
                </div>

                {/* Donut chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition par ville</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique en donut</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="text-2xl font-bold text-orange-500 mb-2">94%</div>
                  <div className="text-gray-600 text-sm mb-3">Taux de satisfaction</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: "94%" }}></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">1h 45min</div>
                  <div className="text-gray-600 text-sm">Temps de réponse moyen</div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">67%</div>
                  <div className="text-gray-600 text-sm">Demandes avec vidéo</div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">78%</div>
                  <div className="text-gray-600 text-sm">Taux de conversion</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
