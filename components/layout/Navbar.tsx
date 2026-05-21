"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import { useDictionary } from "@/hooks/useDictionary";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, token, logout } = useAuth();

  /** Prestataire connecté : même liens + Déconnexion sur tout le site (pas seulement /provider/*) */
  const showProviderNav = user?.role === "provider" && !!token;
  const isProviderDashboard = pathname?.startsWith("/provider") ?? false;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useDictionary();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const navLinksPublic = [
    { name: t?.navigation?.home || "Accueil", href: "/" },
    { name: t?.navigation?.services || "Services", href: "/#services" },
    { name: t?.navigation?.providers || "Artisans", href: "/providers" },
    { name: t?.request?.title || "Demande", href: "/request" },
    { name: t?.navigation?.about || "À propos", href: "/about" },
    { name: t?.navigation?.contact || "Contact", href: "/contact" },
  ];

  const navLinksProvider = [
    { name: "Accueil", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "Artisans", href: "/providers" },
    { name: "Faire une demande", href: "/request" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const navLinks = showProviderNav ? navLinksProvider : navLinksPublic;

  const handleProviderLogout = () => {
    logout();
    closeMenu();
    router.push("/login");
  };

  // Sur le dashboard prestataire, barre lisible sur fond gris
  const navLooksSolid = isScrolled || isProviderDashboard;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        navLooksSolid
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo avec image */}
          <Link href="/" className="flex items-center group">
            <Image 
              src="/logo2.png" 
              alt="M3allam Connect" 
              width={400} 
              height={200} 
              className="h-18  w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation Desktop avec effets hover */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-lg font-bold transition-all duration-300 rounded-lg group ${
                  navLooksSolid
                    ? "text-[#4A4A4A] hover:text-[#0B2C5E] hover:bg-blue-50"
                    : "text-[#4A4A4A] hover:text-[#0B2C5E] hover:bg-white/50"
                }`}
              >
                {link.name}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#0B2C5E] to-[#0B2C5E] transition-all duration-300 group-hover:w-1/2 rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="hidden md:flex items-center space-x-3">
            {showProviderNav ? (
              <button
                type="button"
                onClick={handleProviderLogout}
                className="group relative flex items-center gap-2 px-5 py-2.5 bg-[#F27405] text-white text-base font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </span>
                <div className="absolute inset-0 bg-[#d96504] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-5 py-2.5 text-base font-bold rounded-xl transition-all duration-300 ${
                    navLooksSolid
                      ? "text-[#4A4A4A] hover:text-[#0B2C5E] hover:bg-blue-50"
                      : "text-[#4A4A4A] hover:text-[#0B2C5E] hover:bg-white/60 backdrop-blur-sm"
                  }`}
                >
                  {t?.navigation?.login || "Se connecter"}
                </Link>
                <Link
                  href="/register"
                  className="group relative px-5 py-2.5 bg-[#F27405] text-white text-base font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 animate-pulse text-white" />
                    {t?.navigation?.register || "S'inscrire"}
                  </span>
                  <div className="absolute inset-0 bg-[#d96504] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </>
            )}
          </div>

          {/* Bouton Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${
              navLooksSolid
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-700 hover:bg-white/50"
            }`}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile animé */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-lg border-b border-gray-100 shadow-xl transition-all duration-500 ease-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-6 space-y-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMenu}
              className="block px-4 py-3 text-lg font-bold text-[#4A4A4A] hover:text-[#0B2C5E] hover:bg-blue-50 rounded-xl transition-all duration-300"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
            {showProviderNav ? (
              <button
                type="button"
                onClick={handleProviderLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-lg font-bold text-center bg-[#F27405] text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-[#d96504] transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                Déconnexion
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-lg font-bold text-center text-[#4A4A4A] hover:text-[#0B2C5E] hover:bg-blue-50 rounded-xl transition-all duration-300"
                >
                  {t?.navigation?.login || "Se connecter"}
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-lg font-bold text-center bg-[#F27405] text-white rounded-xl shadow-lg hover:shadow-xl hover:bg-[#d96504] transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t?.navigation?.register || "S'inscrire"}
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
