"use client";

import { useState, useEffect } from "react";

export default function DebugProvidersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Debug page - Starting fetch");
    
    fetch('http://localhost:8080/api/providers')
      .then(response => {
        console.log("Debug page - Response status:", response.status);
        return response.json();
      })
      .then(result => {
        console.log("Debug page - Raw data:", result);
        setData(result);
        
        // Extract providers from content
        const providers = Array.isArray(result) ? result : result.content || [];
        console.log("Debug page - Extracted providers:", providers);
        console.log("Debug page - Providers count:", providers.length);
      })
      .catch(err => {
        console.error("Debug page - Error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug - Loading...</h1>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug - Error</h1>
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  const providers = Array.isArray(data) ? data : data?.content || [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug - Providers Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-bold mb-2">Debug Information:</h2>
        <p>Loading: {loading.toString()}</p>
        <p>Error: {error || "None"}</p>
        <p>Data type: {typeof data}</p>
        <p>Is array: {Array.isArray(data).toString()}</p>
        <p>Providers count: {providers.length}</p>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-bold mb-2">Raw Data (first 200 chars):</h2>
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(data, null, 2).substring(0, 200)}...
        </pre>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="font-bold mb-2">First Provider:</h2>
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(providers[0] || "No providers", null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="font-bold">Providers ({providers.length}):</h2>
        {providers.map((provider: any, index: number) => (
          <div key={index} className="border p-4 rounded">
            <p><strong>Name:</strong> {provider.firstName} {provider.lastName}</p>
            <p><strong>City:</strong> {provider.city}</p>
            <p><strong>Services:</strong> {provider.services?.join(", ")}</p>
            <p><strong>Rate:</strong> {provider.hourlyRate} MAD/h</p>
          </div>
        ))}
      </div>
    </div>
  );
}
