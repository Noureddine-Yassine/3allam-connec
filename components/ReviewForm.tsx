"use client";

import { useState } from "react";
import { Star, Send, X } from "lucide-react";

interface ReviewFormProps {
  artisanId: string;
  onReviewSubmit: (review: {
    rating: number;
    comment: string;
    service: string;
    customerName: string;
  }) => void;
  onClose: () => void;
}

export default function ReviewForm({ artisanId, onReviewSubmit, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [service, setService] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    "Plomberie",
    "Électricité", 
    "Peinture",
    "Menuiserie",
    "Nettoyage",
    "Climatisation",
    "Autre"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0 || !comment.trim() || !service || !customerName.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simuler l'envoi de l'avis
    setTimeout(() => {
      onReviewSubmit({
        rating,
        comment: comment.trim(),
        service,
        customerName: customerName.trim()
      });
      
      // Reset form
      setRating(0);
      setComment("");
      setService("");
      setCustomerName("");
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Laisser un avis</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre nom *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A8B71] focus:border-[#4A8B71]"
                placeholder="Jean Dupont"
                required
              />
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service concerné *
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A8B71] focus:border-[#4A8B71]"
                required
              >
                <option value="">Sélectionner un service</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note *
              </label>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoveredRating(i + 1)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          i < (hoveredRating || rating)
                            ? 'text-[#4A8B71] fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {rating > 0 && (
                    <span>
                      {rating === 5 && 'Excellent'}
                      {rating === 4 && 'Très bon'}
                      {rating === 3 && 'Bon'}
                      {rating === 2 && 'Moyen'}
                      {rating === 1 && 'Décevant'}
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Commentaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre commentaire *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A8B71] focus:border-[#4A8B71] resize-none"
                placeholder="Décrivez votre expérience avec cet artisan..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {comment.length}/500 caractères
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || rating === 0 || !comment.trim() || !service || !customerName.trim()}
                className="flex-1 px-4 py-3 bg-[#0B3B24] text-white rounded-lg hover:bg-[#072a19] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer l'avis
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
