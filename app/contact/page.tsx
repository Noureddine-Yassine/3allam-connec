"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, AlertTriangle, ChevronDown, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const subjects = [
    "Support client",
    "Devenir prestataire", 
    "Partenariat",
    "Signaler un problème",
    "Autre"
  ];

  const faqs = [
    {
      question: "Comment fonctionne M3allam Connect?",
      answer: "M3allam Connect est une plateforme qui met en relation des clients avec des artisans qualifiés. Vous remplissez un formulaire, et nous vous contactons sous 2 heures."
    },
    {
      question: "Le service est-il gratuit pour les clients?",
      answer: "Oui, la mise en relation est entièrement gratuite pour les clients. Vous ne payez que la prestation de l'artisan."
    },
    {
      question: "Comment devenir prestataire?",
      answer: "Inscrivez-vous via le bouton Devenir M3allam, soumettez vos documents, et votre profil sera validé sous 24-48 heures."
    },
    {
      question: "Combien de temps avant d'être contacté?",
      answer: "Notre équipe vous contacte dans les 2 heures suivant votre demande du lundi au samedi, et le lendemain matin pour les demandes du dimanche."
    },
    {
      question: "Mes données sont-elles protégées?",
      answer: "Oui, toutes vos données sont chiffrées et sécurisées. Nous respectons la loi 09-08 sur la protection des données personnelles au Maroc."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Veuillez entrer une adresse email valide');
      return;
    }
    
    setIsSubmitted(true);
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="flex flex-col">
      {/* PAGE HEADER */}
      <div className="hero-gradient py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-gray-600 mb-8">
            Notre équipe est disponible du lundi au samedi de 8h à 20h
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-[#C2E0C6] text-[#0B3B24] rounded-full text-sm font-medium flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Réponse rapide
            </div>
            <div className="px-4 py-2 bg-[#C2E0C6] text-[#0B3B24] rounded-full text-sm font-medium flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email sous 24h
            </div>
            <div className="px-4 py-2 bg-[#C2E0C6] text-[#0B3B24] rounded-full text-sm font-medium flex items-center">
              <span className="w-4 h-4 mr-2">📱</span>
              WhatsApp dispo
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SECTION */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* LEFT COLUMN - COORDONNÉES */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Nos coordonnées</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#4A8B71] mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Adresse</p>
                    <p className="text-gray-600">Casablanca, Maroc</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-[#4A8B71] mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Téléphone</p>
                    <p className="text-gray-600">+212 6XX XXX XXX</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-[#4A8B71] mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">contact@m3allamconnect.ma</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-[#4A8B71] mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Horaires</p>
                    <p className="text-gray-600">Lun-Sam, 8h00 - 20h00</p>
                  </div>
                </div>
              </div>
              
              {/* Urgency note */}
              <div className="bg-[#C2E0C6] border border-[#4A8B71] rounded-lg p-4 mt-8">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-[#0B3B24] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#0B3B24]">Pour une urgence</p>
                    <p className="text-[#0B3B24] text-sm">
                      Appelez directement le +212 6XX XXX XXX disponible 7j/7
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Social media */}
              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-4">Suivez-nous</h4>
                <div className="flex space-x-3">
                  <button className="w-10 h-10 bg-[#0B3B24] rounded-full flex items-center justify-center hover:bg-[#072a19] transition-colors">
                    <span className="text-white text-sm">f</span>
                  </button>
                  <button className="w-10 h-10 bg-[#0B3B24] rounded-full flex items-center justify-center hover:bg-[#072a19] transition-colors">
                    <span className="text-white text-sm">ig</span>
                  </button>
                  <button className="w-10 h-10 bg-[#0B3B24] rounded-full flex items-center justify-center hover:bg-[#072a19] transition-colors">
                    <span className="text-white text-sm">w</span>
                  </button>
                  <button className="w-10 h-10 bg-[#0B3B24] rounded-full flex items-center justify-center hover:bg-[#072a19] transition-colors">
                    <span className="text-white text-sm">in</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* RIGHT COLUMN - CONTACT FORM */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h3>
                
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8B71]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8B71]"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet
                      </label>
                      <div className="relative">
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8B71] appearance-none"
                          required
                        >
                          <option value="">Sélectionnez un sujet</option>
                          {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        maxLength={500}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A8B71] resize-none"
                        required
                      />
                      <div className="text-right text-sm text-gray-500 mt-1">
                        {formData.message.length} / 500
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#0B3B24] text-white rounded-lg hover:bg-[#072a19] transition-colors font-medium flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Envoyer le message
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-green-600 font-medium">Message envoye avec succes.</p>
                    <p className="text-gray-600 mt-2">Nous vous repondrons tres bientot.</p>
                  </div>
                )}
              </div>
          
              </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 ${
              expandedFAQ === index ? 'border-orange-500' : ''
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 border-t border-gray-200 flex items-center justify-between"
            >
              <h4 className="font-medium text-gray-900">{faq.question}</h4>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedFAQ === index ? 'rotate-180' : ''
              }`} />
            </button>
            {expandedFAQ === index && (
              <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}