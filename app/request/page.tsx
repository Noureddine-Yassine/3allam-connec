"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Lock,
  CheckCircle,
  MapPin,
  Loader2,
  Camera,
  User,
  ClipboardList,
  Video,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";
import GoogleMap from "@/components/GoogleMap";
import { publicApi } from "@/lib/api";
import { toE212Phone, isValidE212Mobile } from "@/lib/moroccoPhone";

const HERO_BG = "linear-gradient(90deg, #FFFFFF 55%, #FDF0E0 100%)";

export default function RequestPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    service: "",
    urgency: "Standard",
    description: "",
    location: null as { lat: number; lng: number } | null,
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const cities = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fès",
    "Tanger",
    "Agadir",
    "Meknès",
    "Oujda",
  ];
  const services = [
    "Plomberie",
    "Électricité",
    "Peinture",
    "Menuiserie",
    "Nettoyage",
    "Climatisation",
    "Jardinage",
    "Déménagement",
  ];
  const urgencyLevels = [
    { value: "Standard", label: "Standard (2-3 jours)", color: "green" },
    { value: "Urgent", label: "Urgent (sous 24h)", color: "orange" },
    { value: "Très urgent", label: "Très urgent (aujourd'hui)", color: "red" },
  ];

  const getUserLocation = () => {
    setLocationLoading(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError(
        "La géolocalisation n'est pas supportée par votre navigateur"
      );
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setFormData((prev) => ({ ...prev, location }));
        setLocationLoading(false);
      },
      () => {
        setLocationError(
          "Impossible d'obtenir votre position. Veuillez autoriser l'accès à votre localisation."
        );
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    const handleFocus = () => {
      if (!formData.location && !showLocationPrompt) {
        setShowLocationPrompt(true);
      }
    };

    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, [formData.location, showLocationPrompt]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      if (file.size <= 50 * 1024 * 1024) {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
      } else {
        alert("La vidéo ne doit pas dépasser 50 Mo");
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

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-[#0B2C5E] focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]/20";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.location) {
      getUserLocation();
      return;
    }

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.city ||
      !formData.service ||
      !formData.description
    ) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const phoneE212 = toE212Phone(formData.phone);
    if (!isValidE212Mobile(phoneE212)) {
      alert(
        "Veuillez entrer un numéro marocain valide (ex. 06 XX XX XX XX ou 6 XX XX XX XX)"
      );
      return;
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      alert("Veuillez entrer une adresse email valide");
      return;
    }

    try {
      const phone = phoneE212;

      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || formData.fullName;
      const lastName = nameParts.slice(1).join(" ") || "";

      const requestData = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: formData.email || null,
        city: formData.city.toUpperCase().replace("È", "E").replace("É", "E"),
        serviceType: formData.service
          .toUpperCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace("É", "E"),
        urgencyLevel:
          formData.urgency === "Standard"
            ? "STANDARD"
            : formData.urgency === "Urgent"
              ? "URGENT"
              : formData.urgency === "Très urgent"
                ? "VERY_URGENT"
                : "STANDARD",
        description: formData.description,
        latitude: formData.location ? formData.location.lat : null,
        longitude: formData.location ? formData.location.lng : null,
      };

      await publicApi.createRequest(requestData, videoFile || undefined);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erreur inconnue";
      console.error("Request submission error:", error);
      alert("Erreur lors de l'envoi de la demande: " + message);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col">
        <section
          className="border-b border-gray-100 px-4 py-14 md:py-20"
          style={{ background: HERO_BG }}
        >
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Demande{" "}
              <span className="bg-gradient-to-r from-[#F27405] to-[#d96504] bg-clip-text text-transparent">
                envoyée
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Nous avons bien reçu votre demande. Un artisan vous contactera
              sous 2 heures au numéro indiqué.
            </p>

            <div className="mt-10 rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm md:p-8">
              <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B2C5E] text-sm font-black text-white">
                  ✓
                </span>
                Prochaines étapes
              </h3>
              <ol className="space-y-4">
                {[
                  "Analyse de votre demande",
                  "Sélection du meilleur artisan",
                  "Contact dans les 2 heures",
                ].map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B2C5E] text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-1 font-medium text-gray-700">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
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
                    location: null,
                  });
                  setVideoFile(null);
                  setVideoPreview("");
                }}
                className="rounded-xl bg-[#F27405] px-6 py-3.5 text-base font-bold text-white shadow-md shadow-orange-500/20 transition hover:bg-[#d96504]"
              >
                Nouvelle demande
              </button>
              <Link
                href="/"
                className="rounded-xl border-2 border-[#0B2C5E] px-6 py-3.5 text-center text-base font-bold text-[#0B2C5E] transition hover:bg-[#0B2C5E]/5"
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section
        className="border-b border-gray-100 px-4 pb-12 pt-6 md:pb-16 md:pt-8"
        style={{ background: HERO_BG }}
      >
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="font-medium hover:text-[#0B2C5E]">
              Accueil
            </Link>
            <span className="mx-2 text-gray-300">&gt;</span>
            <span className="font-semibold text-gray-900">
              Demande de service
            </span>
          </nav>

          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50/90 px-4 py-2 text-xs font-bold text-[#F27405] shadow-sm">
            <Clock className="h-4 w-4 shrink-0" />
            Réponse sous 2 h
          </div>

          <h1 className="mt-6 text-center text-3xl font-black tracking-tight text-slate-900 sm:text-left md:text-5xl md:leading-[1.1]">
            Décrivez votre{" "}
            <span className="bg-gradient-to-r from-[#F27405] to-[#d96504] bg-clip-text text-transparent">
              besoin
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600 sm:mx-0 sm:text-left">
            Remplissez le formulaire : notre équipe vous recontacte rapidement
            pour vous mettre en relation avec un artisan vérifié.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
            {[
              { icon: ShieldCheck, label: "Artisans vérifiés" },
              { icon: Video, label: "Vidéo acceptée" },
              { icon: MapPin, label: "Géolocalisation" },
            ].map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm"
              >
                <Icon className="h-4 w-4 shrink-0 text-[#0B2C5E]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {showLocationPrompt && !formData.location && (
        <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-[#0B2C5E]/15 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-6">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0B2C5E]/10 text-[#0B2C5E]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Autoriser la position</p>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                  Pour proposer les artisans les plus proches, nous avons besoin
                  de votre localisation.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={getUserLocation}
              disabled={locationLoading}
              className="shrink-0 rounded-xl bg-[#0B2C5E] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#081f45] disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Localisation…
                </>
              ) : (
                "Autoriser"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-10"
          >
            <div className="mb-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B2C5E] text-white">
                  <User className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Vos informations
                  </h2>
                  <p className="text-sm text-gray-500">
                    Coordonnées pour être recontacté
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Prénom et nom *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Youssef Alami"
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Téléphone *
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                      +212
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="6 ou 06 XX XX XX XX"
                      className={`${inputClass} pl-[4.25rem]`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@exemple.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Ville *
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Sélectionnez une ville</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-10 border-t border-gray-100 pt-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F27405]/15 text-[#d96504]">
                  <ClipboardList className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Votre besoin
                  </h2>
                  <p className="text-sm text-gray-500">
                    Type d&apos;intervention et urgence
                  </p>
                </div>
              </div>
              <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Type de service *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Sélectionnez un service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-800">
                    Niveau d&apos;urgence
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    {urgencyLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Description du problème *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ex. : fuite sous l'évier depuis hier…"
                  rows={5}
                  maxLength={500}
                  className={`${inputClass} resize-none`}
                  required
                />
                <div className="mt-1.5 text-right text-xs font-medium text-gray-400">
                  {formData.description.length} / 500
                </div>
              </div>
            </div>

            <div className="mb-10 border-t border-gray-100 pt-10">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0B2C5E]/10 text-[#0B2C5E]">
                  <Video className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Vidéo{" "}
                    <span className="text-base font-semibold text-gray-500">
                      (optionnel)
                    </span>
                  </h2>
                </div>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">
                <Sparkles className="mr-1 inline h-4 w-4 text-[#F27405]" />
                Les demandes avec vidéo sont souvent traitées plus vite par nos
                équipes.
              </p>

              {!videoPreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[168px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#0B2C5E]/25 bg-gradient-to-br from-[#0B2C5E]/5 to-[#F27405]/10 px-4 py-8 text-center transition hover:border-[#F27405]/40 hover:from-[#0B2C5E]/8 hover:to-[#F27405]/15"
                >
                  <Camera className="mb-3 h-12 w-12 text-[#0B2C5E]" />
                  <p className="font-bold text-gray-900">Filmez le problème</p>
                  <p className="mt-1 text-sm text-gray-600">
                    MP4, MOV, AVI — max. 50 Mo
                  </p>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-black/5">
                    <video
                      ref={videoRef}
                      src={videoPreview}
                      className="max-h-56 w-full"
                      controls
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <CheckCircle className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-emerald-700">
                        Vidéo ajoutée
                      </span>
                      <span className="truncate text-gray-500">
                        {videoFile?.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Supprimer
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

            <div className="mb-10 border-t border-gray-100 pt-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#0B2C5E]">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Votre localisation
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formData.location
                      ? "Position enregistrée — artisans à proximité privilégiés."
                      : "Autorisez la géolocalisation pour afficher la carte."}
                  </p>
                </div>
              </div>

              {locationError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {locationError}
                  </p>
                </div>
              )}

              <div className="relative h-64 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-inner">
                {formData.location ? (
                  <GoogleMap
                    location={formData.location}
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <MapPin className="mb-3 h-12 w-12 text-gray-300" />
                    <p className="text-sm font-medium text-gray-600">
                      Carte disponible après autorisation de la position
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-8">
              <button
                type="submit"
                className="w-full rounded-xl bg-[#F27405] py-4 text-lg font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#d96504] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Localisation…
                  </span>
                ) : (
                  "Envoyer ma demande"
                )}
              </button>
              <p className="flex items-center justify-center gap-2 text-center text-sm text-gray-500">
                <Lock className="h-4 w-4 shrink-0 text-gray-400" />
                Données confidentielles, jamais revendues.
              </p>
              <p className="text-center text-xs text-gray-400">
                * Champs obligatoires
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
