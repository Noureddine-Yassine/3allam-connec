"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  CheckCircle,
  User,
  Briefcase,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { publicApi, apiConfig } from "@/lib/api";

function profileImageUrl(path: string | undefined) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${apiConfig.baseURL}${path}`;
}

const CITY_LABELS: Record<string, string> = {
  casablanca: "Casablanca",
  rabat: "Rabat",
  marrakech: "Marrakech",
  fes: "Fès",
  fez: "Fès",
  tanger: "Tanger",
  agadir: "Agadir",
  meknes: "Meknès",
  meknès: "Meknès",
  oujda: "Oujda",
  tetouan: "Tétouan",
  tétouan: "Tétouan",
};

function formatCity(city: string | undefined | null): string {
  if (!city?.trim()) return "Ville non précisée";
  const key = city.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (CITY_LABELS[key]) return CITY_LABELS[key];
  return city
    .trim()
    .toLowerCase()
    .split(/[\s_]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const SERVICE_LABELS: Record<string, string> = {
  PLOMBERIE: "Plomberie",
  ELECTRICITE: "Électricité",
  ELECTRICITÉ: "Électricité",
  PEINTURE: "Peinture",
  MENUISERIE: "Menuiserie",
  NETTOYAGE: "Nettoyage",
  CLIMATISATION: "Climatisation",
  JARDINAGE: "Jardinage",
  DEMENAGEMENT: "Déménagement",
  DÉMÉNAGEMENT: "Déménagement",
};

function formatServiceLabel(service: string): string {
  const u = service.trim().toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (SERVICE_LABELS[u]) return SERVICE_LABELS[u];
  if (SERVICE_LABELS[service.trim()]) return SERVICE_LABELS[service.trim()];
  return service
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatExperienceYears(value: string | undefined | null): string {
  if (value == null || value === "") return "Expérience non précisée";
  const v = String(value).trim();
  const map: Record<string, string> = {
    LESS_THAN_1: "Moins d'un an",
    ONE_TO_3: "1 à 3 ans",
    THREE_TO_5: "3 à 5 ans",
    FIVE_TO_10: "5 à 10 ans",
    MORE_THAN_10: "Plus de 10 ans",
  };
  if (map[v]) return map[v];
  if (/^\d+$/.test(v)) return `${v} an${v === "1" ? "" : "s"} d'expérience`;
  return v.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProvider(params.id as string);
    }
  }, [params.id]);

  const fetchProvider = async (id: string) => {
    try {
      const data = await publicApi.getProviderProfile(id);
      setProvider(data);
    } catch (error) {
      console.error("Error fetching provider:", error);
      router.push("/providers");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="h-12 w-12 rounded-full border-2 border-gray-200 border-t-[#F27405] animate-spin" />
        <p className="text-gray-600 font-medium">Chargement du profil…</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
        <User className="h-16 w-16 text-gray-300" />
        <h3 className="text-xl font-bold text-gray-900">Artisan introuvable</h3>
        <Link
          href="/providers"
          className="font-semibold text-[#0B2C5E] hover:underline"
        >
          Retour aux artisans
        </Link>
      </div>
    );
  }

  const fullName =
    `${provider.firstName || ""} ${provider.lastName || ""}`.trim() ||
    "Artisan";
  const cityLabel = formatCity(provider.city);
  const experienceLabel = formatExperienceYears(provider.yearsOfExperience);
  const img = profileImageUrl(provider.profilePhotoUrl);
  const services: string[] = Array.isArray(provider.services)
    ? provider.services
    : [];

  return (
    <div className="flex flex-col">
      {/* Hero — thème aligné accueil / liste artisans */}
      <section
        className="border-b border-gray-100 px-4 pb-12 pt-6 md:pt-8"
        style={{
          background: "linear-gradient(90deg, #FFFFFF 55%, #FDF0E0 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <Link
            href="/providers"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0B2C5E] transition hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux artisans
          </Link>

          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <div className="relative shrink-0">
              {img ? (
                <img
                  src={img}
                  alt={fullName}
                  className="h-36 w-36 rounded-2xl object-cover shadow-lg ring-4 ring-white sm:h-40 sm:w-40"
                />
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B2C5E]/10 to-[#F27405]/15 shadow-inner ring-4 ring-white sm:h-40 sm:w-40">
                  <User className="h-16 w-16 text-[#0B2C5E]/35" />
                </div>
              )}
              <div
                className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-4 ring-white"
                title="Profil vérifié"
              >
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                {fullName}
              </h1>

              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm">
                  <MapPin className="h-4 w-4 shrink-0 text-[#0B2C5E]" />
                  {cityLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm">
                  <Briefcase className="h-4 w-4 shrink-0 text-[#F27405]" />
                  {experienceLabel}
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-[#F27405]/25 bg-[#F27405]/10 px-4 py-2 text-sm font-bold text-[#d96504] shadow-sm">
                  {provider.hourlyRate != null && provider.hourlyRate !== ""
                    ? `${provider.hourlyRate} MAD/h`
                    : "Tarif sur demande"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-10">
        {/* Services */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2C5E] text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Services proposés
            </h2>
          </div>
          {services.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {services.map((service: string, index: number) => (
                <span
                  key={`${service}-${index}`}
                  className="rounded-full border border-[#0B2C5E]/12 bg-[#0B2C5E]/6 px-4 py-2 text-sm font-semibold text-[#0B2C5E]"
                >
                  {formatServiceLabel(service)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun service renseigné.</p>
          )}
        </section>

        {/* Expérience + bio */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F27405]/15 text-[#d96504]">
              <Briefcase className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Expérience professionnelle
            </h2>
          </div>
          <p className="mb-4 text-lg font-semibold text-[#0B2C5E]">
            {experienceLabel}
          </p>
          {provider.bio ? (
            <p className="leading-relaxed text-gray-600">{provider.bio}</p>
          ) : (
            <p className="text-gray-500">Aucune présentation pour le moment.</p>
          )}
        </section>

        {/* Zone d'intervention */}
        {provider.interventionZone ? (
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5 flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-[#0B2C5E]">
                <MapPin className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-bold text-gray-900">
                Zone d&apos;intervention
              </h2>
            </div>
            <p className="leading-relaxed text-gray-700">
              {provider.interventionZone}
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
