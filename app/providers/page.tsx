"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  CheckCircle,
  User,
  Search,
  Filter,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { publicApi, apiConfig } from "@/lib/api";

function profileImageUrl(profilePhotoUrl: string | undefined) {
  if (!profilePhotoUrl) return null;
  if (profilePhotoUrl.startsWith("http")) return profilePhotoUrl;
  return `${apiConfig.baseURL}${profilePhotoUrl}`;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState("");
  const [searchService, setSearchService] = useState("");
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    let filtered = providers;

    if (searchCity) {
      filtered = filtered.filter((provider) =>
        provider.city?.toLowerCase().includes(searchCity.toLowerCase())
      );
    }

    if (searchService) {
      filtered = filtered.filter((provider) =>
        provider.services?.some((service: string) =>
          service.toLowerCase().includes(searchService.toLowerCase())
        )
      );
    }

    setFilteredProviders(filtered);
  }, [providers, searchCity, searchService]);

  const fetchProviders = async () => {
    try {
      const data = await publicApi.getProviders();
      const allProviders = Array.isArray(data)
        ? data
        : (data as any)?.content || (data as any)?.data || [];
      setProviders(allProviders);
      setFilteredProviders(allProviders);
    } catch (error) {
      console.error("Error fetching providers:", error);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero — même ambiance que l’accueil (blanc → crème) */}
      <section
        className="pt-6 pb-14 md:pb-20 px-4 overflow-hidden relative"
        style={{
          background: "linear-gradient(90deg, #FFFFFF 55%, #FDF0E0 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-[#0B2C5E] transition-colors">
              Accueil
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-900 font-semibold">Artisans</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-orange-200 bg-orange-50/90 text-[#F27405] shadow-sm mb-6">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Réseau vérifié M3allam Connect
            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-5 leading-[1.1]">
              Nos{" "}
              <span className="bg-gradient-to-r from-[#F27405] to-[#d96504] bg-clip-text text-transparent">
                artisans
              </span>{" "}
              près de chez vous
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Professionnels certifiés pour la plomberie, l&apos;électricité, la
              peinture et bien plus — partout au Maroc.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 shadow-sm">
                <UsersMini count={filteredProviders.length} loading={loading} />
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2.5 shadow-sm text-sm font-semibold text-[#0B2C5E]">
                <Sparkles className="w-4 h-4 text-[#F27405]" />
                Profils à jour
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-10 px-4 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B2C5E] text-white">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Affiner la recherche
                </h2>
                <p className="text-sm text-gray-500">
                  Ville ou type de prestation
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0B2C5E]/50" />
                <input
                  type="text"
                  placeholder="Ville (ex. Casablanca)"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]/25 focus:border-[#0B2C5E]"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0B2C5E]/50" />
                <input
                  type="text"
                  placeholder="Service (ex. Plomberie)"
                  value={searchService}
                  onChange={(e) => setSearchService(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]/25 focus:border-[#0B2C5E]"
                />
              </div>
            </div>
            {(searchCity || searchService) && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-5">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-[#0B2C5E]">
                    {filteredProviders.length}
                  </span>{" "}
                  résultat{filteredProviders.length !== 1 ? "s" : ""}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchCity("");
                    setSearchService("");
                  }}
                  className="text-sm font-semibold text-[#F27405] hover:text-[#d96504] transition-colors"
                >
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Résultats */}
      <section className="py-14 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-24">
              <div className="h-12 w-12 rounded-full border-2 border-gray-200 border-t-[#F27405] animate-spin" />
              <p className="text-gray-600 text-lg font-medium">
                Chargement des artisans…
              </p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-20 max-w-lg mx-auto">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0B2C5E]/5 text-[#0B2C5E]">
                <Search className="w-10 h-10 opacity-70" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucun artisan trouvé
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {searchCity || searchService
                  ? "Modifiez vos critères ou élargissez la recherche."
                  : "Revenez plus tard ou passez par une demande depuis l’accueil."}
              </p>
              {(searchCity || searchService) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchCity("");
                    setSearchService("");
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-[#F27405] px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-[#d96504]"
                >
                  Effacer les filtres
                </button>
              )}
              <div className="mt-8">
                <Link
                  href="/request"
                  className="inline-flex items-center gap-2 font-semibold text-[#0B2C5E] hover:underline"
                >
                  Faire une demande
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProviders.map((provider: any) => {
                const img = profileImageUrl(provider.profilePhotoUrl);
                return (
                  <article
                    key={provider.id}
                    className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0B2C5E]/15 hover:shadow-xl"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative shrink-0">
                        {img ? (
                          <img
                            src={img}
                            alt={`${provider.firstName} ${provider.lastName}`}
                            className="h-24 w-24 rounded-2xl object-cover ring-2 ring-[#0B2C5E]/10 shadow-md"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B2C5E]/8 to-[#F27405]/15 ring-2 ring-[#0B2C5E]/10">
                            <User className="h-11 w-11 text-[#0B2C5E]/40" />
                          </div>
                        )}
                        <div
                          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-white"
                          title="Profil vérifié"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <h3 className="truncate text-xl font-bold text-gray-900">
                          {`${provider.firstName || ""} ${provider.lastName || ""}`.trim() ||
                            "Artisan"}
                        </h3>
                        <p className="mt-1 text-sm font-semibold text-[#F27405]">
                          {provider.services?.[0] || "Services multiples"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 flex flex-col gap-3 text-sm text-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0B2C5E]/8">
                          <MapPin className="h-4 w-4 text-[#0B2C5E]" />
                        </span>
                        <span className="font-medium">
                          {provider.city || "Ville non précisée"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F27405]/10 text-xs font-bold text-[#d96504]">
                          MAD
                        </span>
                        <span className="font-medium">
                          {provider.hourlyRate
                            ? `${provider.hourlyRate} MAD/h`
                            : "Tarif sur demande"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#0B2C5E]">
                          ⏱
                        </span>
                        <span className="font-medium">
                          {provider.yearsOfExperience != null &&
                          provider.yearsOfExperience !== ""
                            ? `${provider.yearsOfExperience} ans d’expérience`
                            : "Expérience non indiquée"}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {Array.isArray(provider.services) &&
                        provider.services.slice(0, 3).map((service: string, index: number) => (
                          <span
                            key={index}
                            className="rounded-full border border-[#0B2C5E]/10 bg-[#0B2C5E]/5 px-3 py-1 text-xs font-semibold text-[#0B2C5E]"
                          >
                            {service}
                          </span>
                        ))}
                      {provider.services?.length > 3 && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          +{provider.services.length - 3}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/providers/${provider.id}`}
                      className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F27405] py-3.5 text-center text-base font-bold text-white shadow-md shadow-orange-500/15 transition hover:bg-[#d96504] group-hover:gap-3"
                    >
                      Voir le profil
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function UsersMini({ count, loading }: { count: number; loading: boolean }) {
  return (
    <>
      <User className="w-4 h-4 text-[#0B2C5E]" />
      <span className="text-sm font-semibold text-gray-800">
        {loading ? "…" : `${count} artisan${count !== 1 ? "s" : ""}`}
      </span>
    </>
  );
}
