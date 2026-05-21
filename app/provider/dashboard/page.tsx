  "use client";

import { useState, useEffect } from "react";
import { providerApi } from "@/lib/api";

export default function ProviderDashboard() {
  const [mounted, setMounted] = useState(false);
  const [providerData, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadProviderData();
    }
  }, [mounted]);

  const loadProviderData = async () => {
    try {
      console.log('Loading provider data from backend...');
      const data = await providerApi.getProfile();
      console.log('Provider data from backend:', data);
      setProviderData(data);
    } catch (error) {
      console.error('Error loading provider data:', error);
      // Fallback to localStorage if API fails
      const userData = getUserData();
      setProviderData(userData);
    } finally {
      setLoading(false);
    }
  };

  // Get user data from localStorage directly
  const getUserData = () => {
    try {
      // Try multiple localStorage keys that might contain user data
      const userData = localStorage.getItem('userData');
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      
      console.log('localStorage data:', { userData, user, token });
      
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log('Parsed userData:', parsed);
        return parsed;
      }
      
      if (user) {
        const parsed = JSON.parse(user);
        console.log('Parsed user:', parsed);
        return parsed;
      }
      
      return null;
    } catch (e) {
      console.error('Error reading localStorage:', e);
      return null;
    }
  };

  const userData = providerData || getUserData();

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* CONTENT — navbar unique : components/layout/Navbar (layout racine) */}
      <section className="flex-1 py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Bonjour, {userData?.firstName || 'Prestataire'}! 👋
                </h2>
                <p className="text-gray-600 text-lg">
                  Bienvenue dans votre espace personnel
                </p>
              </div>
              <div className="bg-orange-100 rounded-full p-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {userData?.firstName?.[0]?.toUpperCase() || 'P'}
                  </span>
                </div>
              </div>
            </div>
          </div>


          {/* Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">👤</span>
                </div>
                Informations personnelles
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Nom complet</span>
                  <span className="text-gray-900 font-semibold">
                    {userData?.firstName || userData?.name || userData?.nom || 'Non'} {userData?.lastName || userData?.surname || 'spécifié'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Email</span>
                  <span className="text-gray-900">{userData?.email || userData?.emailAddress || 'Non spécifié'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Téléphone</span>
                  <span className="text-gray-900">{userData?.phone || userData?.phoneNumber || userData?.tel || userData?.telephone || 'Non spécifié'}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Ville</span>
                  <span className="text-gray-900">{userData?.city || userData?.location || userData?.address || userData?.ville || 'Non spécifié'}</span>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">💼</span>
                </div>
                Informations professionnelles
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Statut</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Actif
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Services</span>
                  <span className="text-gray-900">
                    {userData?.services?.[0] || userData?.service || userData?.profession || userData?.metier || userData?.specialty || 'Non spécifié'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Tarif horaire</span>
                  <span className="text-gray-900">
                    {userData?.hourlyRate || userData?.rate || userData?.price || userData?.tarif || userData?.prix ? 
                      `${userData?.hourlyRate || userData?.rate || userData?.price || userData?.tarif || userData?.prix} MAD/h` : 'Non spécifié'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Expérience</span>
                  <span className="text-gray-900">
                    {userData?.yearsOfExperience || userData?.experience || userData?.exp || 'Non spécifié'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
