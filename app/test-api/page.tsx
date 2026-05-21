"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function TestApiPage() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // Récupérer le token du localStorage si disponible
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const testBackendConnection = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const response = await fetch('http://localhost:8080', {
        method: 'GET',
      });
      
      if (response.ok) {
        setResult("✅ Backend connecté avec succès!");
      } else {
        setResult("❌ Erreur de connexion au backend");
      }
    } catch (error) {
      setResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const testAdminLogin = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@m3allamconnect.ma',
          password: 'admin123',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.access_token);
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        setResult(`✅ Login admin réussi! User: ${JSON.stringify(data.user, null, 2)}`);
      } else {
        setResult(`❌ Erreur login: ${data.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const createAdminUser = async () => {
    setLoading(true);
    setResult("");
    
    try {
      const response = await fetch('http://localhost:8080/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Admin créé avec succès! ${data.message}\nEmail: ${data.email}\nPassword: ${data.password}`);
      } else {
        setResult(`❌ Erreur création admin: ${data.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const testFirebaseNotification = async () => {
    if (!token) {
      setResult("❌ Veuillez d'abord vous connecter");
      return;
    }
    
    setLoading(true);
    setResult("");
    
    try {
      const response = await fetch('http://localhost:8080/test-notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: 'test_token',
          message: 'Test notification depuis M3allam Connect!',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Notification envoyée avec succès! ${data.message}`);
      } else {
        setResult(`❌ Erreur notification: ${data.message || 'Erreur inconnue'}`);
      }
    } catch (error) {
      setResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test API M3allam Connect</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">État de la connexion</h2>
          <div className="space-y-2">
            <p><strong>Backend URL:</strong> http://localhost:8080</p>
            <p><strong>Token:</strong> {token ? "✅ Disponible" : "❌ Non disponible"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Test..." : "Tester Connexion Backend"}
          </button>
          
          <button
            onClick={createAdminUser}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer Admin User"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={testAdminLogin}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Login..." : "Tester Login Admin"}
          </button>
          
          <button
            onClick={testFirebaseNotification}
            disabled={loading}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Tester Notification Firebase"}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Résultat</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
