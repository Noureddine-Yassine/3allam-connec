"use client";

import { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapPin, Loader2 } from "lucide-react";

// Clé API Google Maps
const GOOGLE_MAPS_API_KEY = "AIzaSyBU-JZ7GFKN4cx3o4tigGs-nxSFMde_aPA";

const render = (status: Status) => {
  if (status === Status.LOADING) return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
      <p className="text-gray-500 text-sm">Chargement de la carte...</p>
    </div>
  );
  if (status === Status.FAILURE) return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
      <MapPin className="w-12 h-12 text-gray-400 mb-4" />
      <p className="text-gray-500 text-center px-4">
        Impossible de charger la carte.<br />
        Veuillez vérifier votre connexion.
      </p>
    </div>
  );
  return <></>;
};

interface MapComponentProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ center, zoom }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || map) return;

    const newMap = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Ajouter un marker pour la position de l'utilisateur
    new google.maps.Marker({
      position: center,
      map: newMap,
      title: "Votre position",
      animation: google.maps.Animation.DROP,
      icon: {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#EF4444" stroke="white" stroke-width="4"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            <path d="M20 0 L20 40 M0 20 L40 20" stroke="#EF4444" stroke-width="1" opacity="0.3"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20)
      }
    });

    // Ajouter un cercle pour montrer la zone de couverture
    new google.maps.Circle({
      strokeColor: "#0B3B24",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4A8B71",
      fillOpacity: 0.1,
      map: newMap,
      center: center,
      radius: 2000 // 2km de rayon
    });

    setMap(newMap);
  }, [center, zoom, map]);

  return (
    <div ref={mapRef} className="w-full h-full" />
  );
};

interface GoogleMapProps {
  location: { lat: number; lng: number };
  className?: string;
}

export default function GoogleMap({ location, className = "" }: GoogleMapProps) {
  return (
    <div className={`relative ${className}`}>
      <Wrapper
        apiKey={GOOGLE_MAPS_API_KEY}
        render={render}
        libraries={["geometry", "places"]}
        language="fr"
        region="MA"
      >
        <MapComponent 
          center={location} 
          zoom={15}
        />
      </Wrapper>
      
      {/* Overlay d'informations */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs z-10">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-red-500" />
          <span className="font-medium">Votre position</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
        </p>
      </div>
      
      {/* Badge de statut */}
      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
        Localisation active
      </div>
    </div>
  );
}
