"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Upload, X, Lock, CheckCircle, Play, Pause, MapPin, Loader2, Camera } from "lucide-react";
import GoogleMap from "@/components/GoogleMap";

export default function RequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    service: "",
    urgency: "Standard",
    description: "",
    location: null as { lat: number; lng: number } | null
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda"];
  const services = ["Plomberie", "Électricité", "Peinture", "Menuiserie", "Nettoyage", "Climatisation", "Jardinage", "Déménagement"];
  const urgencyLevels = [
    { value: "Standard", label: "Standard (2-3 jours)", color: "green" },
    { value: "Urgent", label: "Urgent (sous 24h)", color: "orange" },
    { value: "Très urgent", label: "Très urgent (aujourd'hui)", color: "red" }
  ];

  // Géolocalisation automatique
  const getUserLocation = () => {
    setLocationLoading(true);
    setLocationError("");
    
    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setFormData(prev => ({ ...prev, location }));
        setLocationLoading(false);
      },
      (error) => {
        setLocationError("Impossible d'obtenir votre position. Veuillez autoriser l'accès à votre localisation.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Demander la localisation au focus du formulaire
  useEffect(() => {
    const handleFocus = () => {
      if (!formData.location && !showLocationPrompt) {
        setShowLocationPrompt(true);
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, [formData.location, showLocationPrompt]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      if (file.size <= 50 * 1024 * 1024) { // 50MB limit
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
      } else {
        alert('La vidéo ne doit pas dépasser 50 Mo');
      }
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demander la localisation si pas encore obtenue
    if (!formData.location) {
      getUserLocation();
      return;
    }
    
    // Validation
    if (!formData.fullName || !formData.phone || !formData.city || !formData.service || !formData.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    // Phone validation for Morocco
    const phoneRegex = /^(06|07|05)\d{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      alert('Veuillez entrer un numéro de téléphone marocain valide');
      return;
    }
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Veuillez entrer une adresse email valide');
      return;
    }
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col">
        <div className="hero-gradient py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Demande envoyée avec succès!</h1>
            <p className="text-gray-600 mb-8">
              Nous avons reçu votre demande. Un artisan vous contactera sous 2 heures au numéro fourni.
            </p>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Prochaines étapes:</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                <div className="w-8 h-8 bg-[#0B2C5E] text-white rounded-full flex items-center justify-center font-bold mr-3">1</div>
                  <span>Analyse de votre demande</span>
                </div>
                <div className="flex items-center">
                <div className="w-8 h-8 bg-[#0B2C5E] text-white rounded-full flex items-center justify-center font-bold mr-3">2</div>
                  <span>Sélection du meilleur artisan</span>
                </div>
                <div className="flex items-center">
                <div className="w-8 h-8 bg-[#0B2C5E] text-white rounded-full flex items-center justify-center font-bold mr-3">3</div>
                  <span>Contact dans les 2 heures</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: "",
                    phone: "",
                    email: "",
                    city: "",
                    service: "",
                    urgency: "Standard",
                    description: "",
                    location: null
                  });
                  setVideoFile(null);
                  setVideoPreview("");
                }}
                className="px-6 py-3 bg-[#0B2C5E] text-white rounded-lg hover:bg-[#081f45] transition-colors font-medium"
              >
                Nouvelle demande
              </button>
              <Link
                href="/"
                className="px-6 py-3 border border-[#0B2C5E] text-[#0B2C5E] rounded-lg hover:bg-blue-100 transition-colors font-medium text-center"
              >
                Retour accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* PAGE HEADER */}
      <div className="hero-gradient py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-[#0B2C5E]">Accueil</Link>
            <span className="mx-2">&gt;</span>
            <span>Demande de service</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">Demandez votre service</h1>
          <p className="text-gray-600 text-center mb-8">
            Remplissez le formulaire. Notre équipe vous contacte dans les 2 heures.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-blue-100 text-[#0B2C5E] rounded-full text-sm font-medium">
              Réponse sous 2h
            </div>
            <div className="px-4 py-2 bg-blue-100 text-[#0B2C5E] rounded-full text-sm font-medium">
              Artisans vérifiés
            </div>
            <div className="px-4 py-2 bg-blue-100 text-[#0B2C5E] rounded-full text-sm font-medium">
              Vidéo acceptée
            </div>
            <div className="px-4 py-2 bg-blue-100 text-[#0B2C5E] rounded-full text-sm font-medium">
              Géolocalisation
            </div>
          </div>
        </div>
      </div>

      {/* PROMPT DE GÉOLOCALISATION */}
      {showLocationPrompt && !formData.location && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mb-4">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-blue-400 mr-3" />
            <div className="flex-1">
              <p className="text-blue-700 font-medium">Autorisez la localisation</p>
              <p className="text-blue-600 text-sm">Nous avons besoin de votre position pour vous trouver les artisans les plus proches.</p>
            </div>
            <button
              onClick={getUserLocation}
              disabled={locationLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Localisation...
                </>
              ) : (
                "Autoriser"
              )}
            </button>
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <div className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {/* SECTION 1 - INFORMATIONS PERSONNELLES */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 relative">
                Vos informations
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0B2C5E]"></span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom et nom *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Youssef Alami"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      +212
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="6 XX XX XX XX"
                      className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemple.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                    required
                  >
                    <option value="">Sélectionnez une ville</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2 - DÉTAILS DU SERVICE */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 relative">
                Votre besoin
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0B2C5E]"></span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de service *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                    required
                  >
                    <option value="">Sélectionnez un service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau d'urgence
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                  >
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description du problème *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ex: J'ai une fuite sous l'évier depuis hier, l'eau coule lentement..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E] resize-none"
                  required
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {formData.description.length} / 500 caractères
                </div>
              </div>
            </div>

            {/* SECTION 3 - VIDÉO ET CARTE */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2 relative">
                Vidéo (optionnel)
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0B2C5E]"></span>
              </h3>
              <p className="text-[#0B2C5E] text-sm mb-6">
                Les demandes avec vidéo sont traitées 3x plus rapidement par nos artisans
              </p>
              
              {!videoPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#0B2C5E] rounded-xl bg-blue-100 min-h-[160px] flex flex-col items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors mb-6"
                >
                  <Camera className="w-12 h-12 text-[#0B2C5E] mb-4" />
                  <p className="font-bold text-gray-900 mb-2">Filmez votre problème</p>
                  <p className="text-gray-600 text-sm mb-2">Cliquez ici ou glissez votre vidéo dans cette zone</p>
                  <p className="text-gray-500 text-xs mb-1">Formats acceptés: MP4, MOV, AVI - Taille maximum: 50 Mo</p>
                  <p className="text-[#0B2C5E] text-sm">Montrez la panne, la fuite, le mur...</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="w-full max-h-56 rounded-lg"
                      controls
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-green-600 font-medium">Vidéo ajoutée avec succès</span>
                      <span className="text-gray-500 text-sm">{videoFile?.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Supprimer la vidéo
                    </button>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </div>

            {/* SECTION 4 - CARTE DE LOCALISATION */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2 relative">
                Votre localisation
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0B2C5E]"></span>
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {formData.location ? 
                  "Position détectée. Les artisans proches de vous seront privilégiés." : 
                  "Autorisez la localisation pour voir votre position sur la carte."
                }
              </p>
              
              {locationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 text-sm">{locationError}</p>
                </div>
              )}
              
              <div className="h-64 bg-gray-100 rounded-lg overflow-hidden relative">
                {formData.location ? (
                  <GoogleMap 
                    location={formData.location}
                    className="w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                    <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center px-4">
                      Localisation non disponible.<br />
                      Autorisez l'accès à votre position pour voir la carte.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SUBMIT SECTION */}
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full py-4 bg-[#0B2C5E] text-white rounded-lg hover:bg-[#081f45] transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Localisation en cours...
                  </span>
                ) : (
                  "Envoyer ma demande"
                )}
              </button>
              
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Lock className="w-4 h-4 mr-2" />
                Vos données sont sécurisées et confidentielles - jamais partagées
              </div>
              
              <p className="text-center text-sm text-gray-500">
                * Champs obligatoires
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
