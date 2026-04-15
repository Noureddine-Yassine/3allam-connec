"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, Form, Phone, Star, MapPin, Clock, CheckCircle, ArrowRight, ChevronRight, Wrench, Zap, Palette, Trees, Sparkles, Snowflake, Users, MapPin as MapPinIcon, TrendingUp, Edit } from "lucide-react";
import ServiceCarousel3D from '@/components/services3d/ServiceCarousel3D';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useDictionary } from '@/hooks/useDictionary';

export default function HomeContent() {
  const t = useDictionary();
  
  // Type explicite pour les clés de services
  type ServiceKey = 'plumbing' | 'electricity' | 'painting' | 'carpentry' | 'cleaning' | 'hvac';
  
  // Hook pour l'animation du compteur
  const [counters, setCounters] = useState({
    artisans: 0,
    cities: 0,
    rating: 0
  });
  
  useEffect(() => {
    const targetValues = {
      artisans: 500,
      cities: 12,
      rating: 48 // Pour 4.8
    };
    
    const duration = 2000; // 2 secondes
    const steps = 60;
    const increment = {
      artisans: targetValues.artisans / steps,
      cities: targetValues.cities / steps,
      rating: targetValues.rating / steps
    };
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounters({
        artisans: Math.min(Math.floor(increment.artisans * currentStep), targetValues.artisans),
        cities: Math.min(Math.floor(increment.cities * currentStep), targetValues.cities),
        rating: Math.min((increment.rating * currentStep) / 10, targetValues.rating / 10)
      });
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, []);
  
  // Hook pour l'animation du chemin SVG au scroll
  const [pathAnimated, setPathAnimated] = useState(false);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !pathAnimated) {
            setPathAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current);
    }
    
    return () => {
      if (howItWorksRef.current) {
        observer.unobserve(howItWorksRef.current);
      }
    };
  }, [pathAnimated]);
  
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <section className="pt-4 pb-20 px-4 overflow-hidden relative bg-transparent">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-20">
          <LanguageSwitcher />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Left side (Text) */}
            <div className="lg:w-1/2 text-center lg:text-left z-10 flex flex-col items-center lg:items-start">
              {/* Badge N°1 Platform - Micro-branding */}
              <div className="inline-flex items-center px-4 py-2 bg-blue-50/50 text-[#0B2C5E] rounded-full text-xs font-bold border border-blue-200 backdrop-blur-sm animate-pulse mb-8 shadow-sm relative overflow-hidden">
                {/* Animated gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B2C5E]/20 via-[#0B2C5E]/30 to-[#0B2C5E]/20 animate-spin-slow"></div>
                <div className="relative flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-[#0B2C5E]" />
                  {t.home.hero.badge}
                </div>
              </div>

              {/* Titre avec gradient sur M3allam */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 animate-fade-in leading-[1.1]">
                {t.home.hero.title.split('M3allam').map((part, index) => (
                  <span key={index}>
                    {part}
                    {index === 0 && (
                      <span className="bg-gradient-to-r from-[#0B2C5E] to-[#0B2C5E] bg-clip-text text-transparent">
                        M3allam
                      </span>
                    )}
                  </span>
                ))}
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 animate-fade-in font-medium leading-relaxed">
                {t.home.hero.subtitle}
              </p>

              {/* Boutons d'action avec hiérarchie claire */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14 w-full sm:w-auto">
                {/* Bouton Principal - Profondeur */}
                <Link
                  href="/request"
                  className="px-8 py-4 bg-[#F27405] text-white rounded-xl shadow-[0_10px_20px_rgba(242,116,5,0.2)] hover:shadow-[#F27405]/40 hover:-translate-y-1 transition-all duration-300 font-bold text-lg w-full sm:w-auto text-center animate-pulse-glow relative overflow-hidden group"
                >
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative">{t.home.hero.cta_primary}</span>
                </Link>
                
                {/* Bouton Secondaire - Glassmorphism */}
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-700 rounded-xl hover:border-[#0B2C5E] hover:text-[#0B2C5E] transition-all duration-300 font-bold text-lg hover:-translate-y-1 w-full sm:w-auto text-center shadow-sm hover:shadow-md"
                >
                  {t.home.hero.cta_secondary}
                </Link>
              </div>

              {/* Stats Section - Capsules avec animation */}
              <div className="flex flex-wrap sm:flex-nowrap justify-center lg:justify-start items-center gap-4 sm:gap-6">
                {/* Artisans Capsule */}
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#0B2C5E]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#0B2C5E] font-black text-2xl">{counters.artisans}+</span>
                    <span className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Artisans</span>
                  </div>
                </div>

                {/* Séparateur vertical */}
                <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>

                {/* Cities Capsule */}
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-blue-600 font-black text-2xl">{counters.cities}</span>
                    <span className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Villes</span>
                  </div>
                </div>

                {/* Séparateur vertical */}
                <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>

                {/* Rating Capsule */}
                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-yellow-600 font-black text-2xl">{counters.rating.toFixed(1)}/5</span>
                    <span className="text-slate-600 font-semibold text-xs uppercase tracking-wide">Note</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side (3D Carousel) */}
            <div className="lg:w-1/2 relative w-full h-[500px] lg:h-[600px] flex justify-center items-center mt-12 lg:mt-0">
              <ServiceCarousel3D />
            </div>

          </div>
        </div>
      </section>

      {/* SERVICES SECTION - BENTO BOX */}
      <section id="services" className="py-20 px-4 bg-gradient-to-br from-[#B8CDD1] to-[#A8C5C9] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #0B2C5E 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, #0B2C5E 0%, transparent 50%),
                             radial-gradient(circle at 40% 20%, #E8F4FD 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#0B2C5E]/20 rounded-full text-[#0B2C5E] text-sm font-medium mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 mr-2 text-[#0B2C5E]" />
              {t.home.services.subtitle}
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {t.home.services.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Des artisans experts pour chaque besoin, disponibles dans tout le Maroc
            </p>
          </div>

          {/* Bento Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Wrench className="w-8 h-8" />, key: "plumbing" as ServiceKey, color: "from-blue-500 to-blue-600" },
              { icon: <Zap className="w-8 h-8" />, key: "electricity" as ServiceKey, color: "from-yellow-500 to-orange-500" },
              { icon: <Palette className="w-8 h-8" />, key: "painting" as ServiceKey, color: "from-purple-500 to-pink-500" },
              { icon: <Trees className="w-8 h-8" />, key: "carpentry" as ServiceKey, color: "from-[#0B2C5E] to-[#0B2C5E]" },
              { icon: <Sparkles className="w-8 h-8" />, key: "cleaning" as ServiceKey, color: "from-cyan-500 to-blue-500" },
              { icon: <Snowflake className="w-8 h-8" />, key: "hvac" as ServiceKey, color: "from-indigo-500 to-purple-500" }
            ].map((service, index) => (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className={`relative mb-6 w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#0B2C5E] transition-colors">
                    {t.home.services[service.key].name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {t.home.services[service.key].description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-[#0B2C5E] bg-blue-100/50 px-3 py-1 rounded-full">
                      {t.home.services[service.key].providers}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <Link
                    href="/providers"
                    className="block w-full text-center bg-[#0B2C5E] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#081f45] transition-all duration-300 shadow-md hover:shadow-lg group-hover:scale-105"
                  >
                    Voir les Artisans
                  </Link>
                </div>
                
                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0B2C5E]/20 to-[#0B2C5E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION - MODERNE */}
      <section ref={howItWorksRef} className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50/30 relative overflow-hidden">
        {/* Background Pattern Subtil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, #0B2C5E 0%, transparent 50%),
                             radial-gradient(circle at 70% 80%, #0B2C5E 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-full text-[#0B2C5E] text-sm font-medium mb-6 shadow-sm">
              <CheckCircle className="w-4 h-4 mr-2 text-[#0B2C5E]" />
              Processus Simple
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              {t.home.howItWorks.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Trois étapes simples pour trouver l'artisan parfait pour vos projets
            </p>
          </div>

          {/* Stepping Path avec SVG */}
          <div className="relative mb-16">
            {/* SVG Path Animation */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 800 200"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M 133 100 L 400 100 L 667 100"
                stroke="url(#gradient)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className={pathAnimated ? "animate-draw-path" : ""}
                style={{ opacity: pathAnimated ? 1 : 0 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0B2C5E" />
                  <stop offset="100%" stopColor="#0B2C5E" />
                </linearGradient>
              </defs>
            </svg>

            {/* Étapes avec Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { 
                  icon: <Search className="w-8 h-8 text-[#0B2C5E] animate-search-sweep" />, 
                  step: "01", 
                  title: t.home.howItWorks.step1.title, 
                  description: t.home.howItWorks.step1.description,
                  color: "from-[#0B2C5E] to-[#0B2C5E]"
                },
                { 
                  icon: <Edit className="w-8 h-8 text-blue-600 animate-pencil-write" />, 
                  step: "02", 
                  title: t.home.howItWorks.step2.title, 
                  description: t.home.howItWorks.step2.description,
                  color: "from-blue-500 to-blue-600"
                },
                { 
                  icon: <Phone className="w-8 h-8 text-purple-600 animate-phone-shake" />, 
                  step: "03", 
                  title: t.home.howItWorks.step3.title, 
                  description: t.home.howItWorks.step3.description,
                  color: "from-purple-500 to-purple-600"
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="relative group"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Carte Glassmorphism */}
                  <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/60 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2">
                    {/* Cercle numéroté avec animation */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 animate-circle-pulse`}>
                        <div className="text-white font-black text-2xl">{item.step}</div>
                      </div>
                      {/* Icône animée */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                          {item.icon}
                        </div>
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0B2C5E] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Point de connexion au chemin */}
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-[#0B2C5E] rounded-full shadow-md z-20"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton CTA Amélioré */}
          <div className="text-center">
            <Link
              href="/request"
              className="inline-block px-10 py-4 bg-gradient-to-r from-[#F27405] to-[#d96504] text-white rounded-2xl hover:from-[#d96504] hover:to-[#F27405] transition-all duration-300 font-bold text-lg shadow-orange-500/30 shadow-lg hover:shadow-orange-500/50 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group"
            >
              {/* Effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center gap-2">
                {t.home.howItWorks.cta}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 px-4 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.home.testimonials.title}</h2>
            <p className="text-gray-600">{t.home.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 card-lift">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#F27405] fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "{t.home.testimonials.review1.text}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#0B2C5E] rounded-full flex items-center justify-center text-white font-bold mr-3">
                  YA
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.home.testimonials.review1.author}</p>
                  <p className="text-gray-600 text-sm">{t.home.testimonials.review1.location}</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-blue-100 text-[#0B2C5E] rounded-full text-sm">{t.home.testimonials.review1.service}</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 card-lift">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#F27405] fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "{t.home.testimonials.review2.text}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#0B2C5E] rounded-full flex items-center justify-center text-white font-bold mr-3">
                  FB
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.home.testimonials.review2.author}</p>
                  <p className="text-gray-600 text-sm">{t.home.testimonials.review2.location}</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-blue-100 text-[#0B2C5E] rounded-full text-sm">{t.home.testimonials.review2.service}</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 card-lift">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#F27405] fill-current" />
                ))}
              </div>
              <p className="text-gray-600 italic mb-6">
                "{t.home.testimonials.review3.text}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-[#0B2C5E] rounded-full flex items-center justify-center text-white font-bold mr-3">
                  HM
                </div>
                <div>
                  <p className="font-bold text-gray-900">{t.home.testimonials.review3.author}</p>
                  <p className="text-gray-600 text-sm">{t.home.testimonials.review3.location}</p>
                </div>
                <span className="ml-auto px-3 py-1 bg-blue-100 text-[#0B2C5E] rounded-full text-sm">{t.home.testimonials.review3.service}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER SECTION */}
      <section className="py-16 px-4 bg-[#1A1A1A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t.home.ctaBanner.title}</h2>
          <p className="text-gray-300 mb-8">
            {t.home.ctaBanner.subtitle}
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-[#F27405] text-white rounded-lg hover:bg-[#d96504] transition-colors font-medium mb-4"
          >
            {t.home.ctaBanner.cta}
          </Link>
          <p className="text-gray-400 text-sm">
            {t.home.ctaBanner.note}
          </p>
        </div>
      </section>
    </div>
  );
}
