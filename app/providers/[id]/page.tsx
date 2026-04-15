"use client";

import Link from "next/link";
import { useState } from "react";
import { Star, MapPin, Clock, DollarSign, CheckCircle, Share2, Phone, MessageCircle, ChevronRight, Plus } from "lucide-react";
import ReviewForm from "@/components/ReviewForm";

export default function ProviderProfilePage() {
  // État pour le formulaire d'avis
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      initials: "YA",
      name: "Youssef A.",
      date: "15 Mars 2025",
      rating: 5,
      comment: "Excellent travail! Karim a résolu ma fuite rapidement et à un prix très raisonnable. Je recommande vivement.",
      service: "Plomberie"
    },
    {
      id: 2,
      initials: "FB",
      name: "Fatima B.",
      date: "8 Mars 2025",
      rating: 5,
      comment: "Très professionnel et ponctuel. Il a installé notre nouvelle salle de bain parfaitement. Merci encore!",
      service: "Installation sanitaire"
    },
    {
      id: 3,
      initials: "MA",
      name: "Mohamed A.",
      date: "1 Mars 2025",
      rating: 4,
      comment: "Bon travail dans l'ensemble, un peu cher mais la qualité est là. Sera à nouveau contacté pour d'autres travaux.",
      service: "Dépannage"
    },
    {
      id: 4,
      initials: "SA",
      name: "Samira K.",
      date: "22 Février 2025",
      rating: 5,
      comment: "Service impeccable! Intervention rapide et travail soigné. Karim est vraiment un artisan de confiance.",
      service: "Urgence"
    }
  ]);

  // Fonction pour ajouter un nouvel avis
  const handleReviewSubmit = (newReview: {
    rating: number;
    comment: string;
    service: string;
    customerName: string;
  }) => {
    const review = {
      id: reviews.length + 1,
      initials: newReview.customerName.split(' ').map(n => n[0]).join('').toUpperCase(),
      name: newReview.customerName,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      rating: newReview.rating,
      comment: newReview.comment,
      service: newReview.service
    };
    
    setReviews([review, ...reviews]);
  };

  // Mock provider data - in a real app, this would come from params and API
  const provider = {
    id: 1,
    name: "Karim Benani",
    skill: "Plomberie",
    rating: 4.8,
    reviewCount: 47,
    city: "Casablanca",
    responseTime: "~2 heures",
    experience: "5-10 ans",
    rate: 150,
    available: true,
    verified: true,
    skills: ["Plomberie", "Étanchéité", "Sanitaire", "Chauffage"],
    bio: "Artisan plombier avec plus de 8 ans d'expérience dans la région de Casablanca. Spécialisé dans les installations sanitaires, le dépannage d'urgence et les travaux de rénovation. Je suis certifié et assuré, et je m'engage à fournir un travail de qualité avec garantie sur toutes mes interventions.",
    traits: ["Ponctuel", "Propre", "Certifié", "Rapide"],
    stats: {
      responseTime: "~2 heures",
      acceptanceRate: "95%",
      interventions: 134,
      memberSince: "Janvier 2024"
    },
    reviews: [
      {
        id: 1,
        initials: "YA",
        name: "Youssef A.",
        date: "15 Mars 2025",
        rating: 5,
        comment: "Excellent travail! Karim a résolu ma fuite rapidement et à un prix très raisonnable. Je recommande vivement.",
        service: "Plomberie"
      },
      {
        id: 2,
        initials: "FB",
        name: "Fatima B.",
        date: "8 Mars 2025",
        rating: 5,
        comment: "Très professionnel et ponctuel. Il a installé notre nouvelle salle de bain parfaitement. Merci encore!",
        service: "Installation sanitaire"
      },
      {
        id: 3,
        initials: "MA",
        name: "Mohamed A.",
        date: "1 Mars 2025",
        rating: 4,
        comment: "Bon travail dans l'ensemble, un peu cher mais la qualité est là. Sera à nouveau contacté pour d'autres travaux.",
        service: "Dépannage"
      },
      {
        id: 4,
        initials: "SA",
        name: "Samira K.",
        date: "22 Février 2025",
        rating: 5,
        comment: "Service impeccable! Intervention rapide et travail soigné. Karim est vraiment un artisan de confiance.",
        service: "Urgence"
      }
    ]
  };

  const ratingBreakdown = [
    { stars: 5, count: 38, percentage: 82 },
    { stars: 4, count: 6, percentage: 12 },
    { stars: 3, count: 2, percentage: 4 },
    { stars: 2, count: 1, percentage: 1 },
    { stars: 1, count: 0, percentage: 1 }
  ];

  return (
    <div className="flex flex-col">
      {/* PROFILE HEADER CARD */}
      <div className="bg-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left side - Profile photo */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-28 h-28 bg-gray-200 rounded-full border-4 border-[#0B3B24]"></div>
                  {provider.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right side - Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.name}</h1>
                <p className="text-xl text-[#0B3B24] font-medium mb-4">{provider.skill}</p>
                
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(provider.rating) ? 'text-[#4A8B71] fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-2xl font-bold text-gray-900">{provider.rating}</span>
                  <span className="ml-2 text-gray-500">({provider.reviewCount} avis)</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {provider.city}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {provider.experience} exp
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {provider.rate} MAD/h
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    provider.available
                      ? 'bg-green-100 text-green-700'
                      : 'bg-[#C2E0C6] text-[#0B3B24]'
                  }`}>
                    <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                    {provider.available ? 'Disponible' : 'Occupé'}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {provider.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 border border-[#0B3B24] text-[#0B3B24] rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="bg-[#B8CDD1] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CONTENT COLUMN (70%) */}
            <div className="lg:col-span-2 space-y-8">
              {/* About section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 relative">
                  À propos
                  <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#4A8B71]"></span>
                </h3>
                <p className="text-gray-600 mb-4">{provider.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {provider.traits.map((trait, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#C2E0C6] text-[#0B3B24] rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Gallery section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 relative">
                  Galerie de travaux
                  <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#4A8B71]"></span>
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-gray-400 text-3xl">🖼</span>
                    </div>
                  ))}
                </div>
                <a href="#" className="text-[#0B3B24] hover:text-[#4A8B71] font-medium text-sm">
                  Voir plus
                </a>
              </div>

              {/* Reviews section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 relative">
                    Avis clients ({reviews.length})
                    <span className="absolute bottom-0 left-0 w-16 h-1 bg-[#4A8B71]"></span>
                  </h3>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0B3B24] text-white rounded-lg hover:bg-[#072a19] transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Laisser un avis
                  </button>
                </div>
                
                {/* Rating summary */}
                <div className="flex items-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-[#0B3B24]">{provider.rating}</div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(provider.rating) ? 'text-[#4A8B71] fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    {ratingBreakdown.map(item => (
                      <div key={item.stars} className="flex items-center gap-3 mb-1">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 w-8">{item.stars}{" "}</span>
                          <Star className="w-3 h-3 text-[#4A8B71] fill-current" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#0B3B24] h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Individual reviews */}
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#0B3B24] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                          {review.initials}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-bold text-gray-900">{review.name}</span>
                              <span className="text-gray-500 text-sm ml-2">{review.date}</span>
                            </div>
                            <span className="px-2 py-1 bg-[#C2E0C6] text-[#0B3B24] rounded-full text-xs">
                              {review.service}
                            </span>
                          </div>
                          <div className="flex mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-[#4A8B71] fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-3 border border-[#0B3B24] text-[#0B3B24] rounded-lg hover:bg-[#C2E0C6] transition-colors font-medium mt-6">
                  Charger plus d'avis
                </button>
              </div>
            </div>

            {/* SIDEBAR (30%) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 lg:sticky lg:top-4">
                <button className="w-full py-3 bg-[#0B3B24] text-white rounded-lg hover:bg-[#072a19] transition-colors font-medium mb-6">
                  Demander ce prestataire
                </button>
                
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">Statistiques rapides</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-500 w-8">✓</span>
                      <span className="text-gray-600">Temps de réponse:</span>
                      <span className="font-medium text-gray-900 ml-auto">{provider.stats.responseTime}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-green-500 w-8">✓</span>
                      <span className="text-gray-600">Taux d'acceptation:</span>
                      <span className="font-medium text-gray-900 ml-auto">{provider.stats.acceptanceRate}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-[#0B3B24] w-8">✓</span>
                      <span className="text-gray-600">Interventions:</span>
                      <span className="font-medium text-gray-900 ml-auto">{provider.stats.interventions} effectuées</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-blue-500 w-8">📅</span>
                      <span className="text-gray-600">Membre depuis:</span>
                      <span className="font-medium text-gray-900 ml-auto">{provider.stats.memberSince}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Partager:</span>
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </button>
                      <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <button className="w-full py-3 bg-[#0B3B24] text-white rounded-lg hover:bg-[#072a19] transition-colors font-medium">
          Demander ce prestataire
        </button>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          artisanId={provider.id.toString()}
          onReviewSubmit={handleReviewSubmit}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}
