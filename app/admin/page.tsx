"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Identifiants incorrects. Réessayez.");
      return;
    }

    // Simulate admin login attempt
    // In a real app, this would be an API call
    if (email === "admin@m3allamconnect.ma" && password === "admin123") {
      // Successful login - redirect to dashboard
      window.location.href = "/admin/dashboard";
    } else {
      setError("Identifiants incorrects. Réessayez.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* LOGIN CARD */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          {/* TOP */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">M3allam</span>
              <span className="text-xl font-bold text-orange-500">Connect</span>
            </div>

            <div className="inline-flex px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold mb-4">
              ADMIN
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Espace Administrateur</h2>
            <p className="text-gray-600 text-sm">
              Accès réservé à l'équipe M3allam Connect
            </p>

            <div className="border-t border-gray-200 mt-6"></div>
          </div>

          {/* ERROR STATE */}
          {error && (
            <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@m3allamconnect.ma"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Se connecter
            </button>
          </form>

          {/* LINKS */}
          <div className="text-center mt-8">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Mot de passe oublié?
            </a>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-400 text-xs">
                M3allam Connect Admin Panel © 2025
              </p>
            </div>
          </div>

          {/* SECURITY NOTE */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-xs flex items-center justify-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Connexion sécurisée HTTPS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
