"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, X, CheckCircle, User, Briefcase, FileText, Award, ArrowLeft, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";
import { toE212Phone, isValidE212Mobile } from "@/lib/moroccoPhone";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    city: "",
    experience: "",
    rate: "",
    services: [] as string[],
    bio: "",
    workArea: "",
    profilePhoto: null as File | null,
    cinDocument: null as File | null,
    certificate: null as File | null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const cinDocumentRef = useRef<HTMLInputElement>(null);
  const certificateRef = useRef<HTMLInputElement>(null);

  const cities = ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda"];
  const experienceLevels = ["Moins d'1 an", "1-3 ans", "3-5 ans", "5-10 ans", "Plus de 10 ans"];
  const services = [
    { id: "plomberie", name: "Plomberie", emoji: ">", icon: ">", },
    { id: "electricite", name: "Électricité", emoji: ">", icon: ">", },
    { id: "peinture", name: "Peinture", emoji: ">", icon: ">", },
    { id: "menuiserie", name: "Menuiserie", emoji: ">", icon: ">", },
    { id: "nettoyage", name: "Nettoyage", emoji: ">", icon: ">", },
    { id: "climatisation", name: "Climatisation", emoji: ">", icon: ">", },
    { id: "jardinage", name: "Jardinage", emoji: ">", icon: ">", },
    { id: "deménagement", name: "Déménagement", emoji: ">", icon: ">", }
  ];

  const steps = [
    { number: 1, label: "Informations" },
    { number: 2, label: "Compétences" },
    { number: 3, label: "Documents" },
    { number: 4, label: "Confirmation" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'profilePhoto' | 'cinDocument' | 'certificate') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [fileType]: file
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    // Validation
    if (currentStep === 1 && (!formData.fullName || !formData.phone || !formData.email || !formData.password || !formData.city)) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Password validation
    if (currentStep === 1 && formData.password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Email format validation
    if (currentStep === 1 && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Veuillez entrer une adresse email valide');
      return;
    }

    // Phone format validation
    if (currentStep === 1) {
      const phone = toE212Phone(formData.phone);
      if (!isValidE212Mobile(phone)) {
        alert(
          "Veuillez entrer un numéro marocain valide (ex. 06 XX XX XX XX ou 6 XX XX XX XX)"
        );
        return;
      }
    }

    if (currentStep === 2 && (formData.services.length === 0 || !formData.bio)) {
      alert('Veuillez sélectionner au moins un service et remplir votre présentation');
      return;
    }

    if (currentStep === 3 && (!formData.profilePhoto || !formData.cinDocument)) {
      alert('Veuillez télécharger votre photo de profil et votre CIN');
      return;
    }

    if (currentStep === 3) {
      // Submit to backend using proper multipart format
      try {
        const formDataToSend = new FormData();

        const phone = toE212Phone(formData.phone);

        // Backend expects a JSON "data" part matching ProviderRegisterDTO
        const dataPayload = {
          firstName: formData.fullName.split(' ')[0] || formData.fullName,
          lastName: formData.fullName.split(' ').slice(1).join(' ') || formData.fullName,
          phone: phone,
          email: formData.email,
          password: formData.password,
          city: formData.city.toUpperCase().replace('È', 'E').replace('É', 'E'),
          yearsOfExperience: formData.experience === "Moins d'1 an" ? 'LESS_THAN_1' :
                             formData.experience === '1-3 ans' ? 'ONE_TO_3' :
                             formData.experience === '3-5 ans' ? 'THREE_TO_5' :
                             formData.experience === '5-10 ans' ? 'FIVE_TO_10' :
                             formData.experience === 'Plus de 10 ans' ? 'MORE_THAN_10' : 'ONE_TO_3',
          hourlyRate: formData.rate ? parseFloat(formData.rate) : null,
          bio: formData.bio,
          interventionZone: formData.workArea || null,
          services: formData.services.map((s: string) => s.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace('É', 'E')),
        };
        formDataToSend.append('data', JSON.stringify(dataPayload));

        // Add files as separate parts
        if (formData.profilePhoto) {
          formDataToSend.append('profilePhoto', formData.profilePhoto);
        }
        if (formData.cinDocument) {
          formDataToSend.append('cinDocument', formData.cinDocument);
        }
        if (formData.certificate) {
          formDataToSend.append('certificate', formData.certificate);
        }

        console.log('Submitting registration data:', dataPayload);
        
        const response = await authApi.providerRegister(
          dataPayload,
          formData.profilePhoto ?? undefined,
          formData.cinDocument ?? undefined,
          formData.certificate ?? undefined
        );
        
        console.log('Registration response:', response);

        if (response.token || response.access_token) {
          console.log('Registration successful:', response);
          setIsSubmitted(true);
          setCurrentStep(4);
        } else {
          const error = response;
          let errorMessage = 'Erreur lors de l\'inscription';
          
          if (error.status === 409) {
            errorMessage = 'Un compte avec cet email ou ce numéro de téléphone existe déjà';
          } else if (error.status === 400) {
            if (error.message && error.message.includes('email')) {
              errorMessage = 'Cet email est déjà utilisé';
            } else if (error.message && error.message.includes('phone')) {
              errorMessage = 'Ce numéro de téléphone est déjà utilisé';
            } else if (error.message && error.message.includes('password')) {
              errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
            } else {
              errorMessage = error.message || 'Données invalides';
            }
          } else {
            errorMessage = error.message || 'Erreur inconnue';
          }
          
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Registration error:', error);
        alert('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } else {
      nextStep();
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  if (isSubmitted && currentStep === 4) {
    return (
      <div className="flex flex-col">
        <div className="hero-gradient py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-[#0B2C5E] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dossier soumis avec succès!</h1>
            <p className="text-gray-600 mb-8">
              Notre équipe vérifie votre dossier dans les 24 à 48 heures.
              Vous recevrez un email dès l'activation.
            </p>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4">Prochaines étapes:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-[#0B2C5E] text-white rounded-full flex items-center justify-center font-bold mr-3">1</span>
                  <span>Vérification de vos documents</span>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-[#0B2C5E] text-white rounded-full flex items-center justify-center font-bold mr-3">2</span>
                  <span>Activation de votre compte</span>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-[#0B2C5E] text-white rounded-full flex items-center justify-center font-bold mr-3">3</span>
                  <span>Réception de vos premières demandes</span>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="inline-block px-8 py-3 bg-[#0B2C5E] text-white rounded-lg hover:bg-[#081f45] transition-colors font-medium"
            >
              Retour à l'accueil
            </Link>

            <p className="text-gray-500 text-sm mt-4">
              Des questions?{' '}
              <Link href="/contact" className="text-[#0B2C5E] hover:text-[#0B2C5E]">
                Contactez-nous
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* PAGE HEADER */}
      <div className="hero-gradient py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez M3allam Connect</h1>
          <p className="text-gray-600 mb-6">
            Inscription gratuite - Validation sous 24h - Clients garantis
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 border border-[#0B2C5E] text-[#0B2C5E] rounded-full text-sm font-medium">
              Gratuit
            </div>
            <div className="px-4 py-2 border border-[#0B2C5E] text-[#0B2C5E] rounded-full text-sm font-medium">
              Validé sous 24h
            </div>
            <div className="px-4 py-2 border border-[#0B2C5E] text-[#0B2C5E] rounded-full text-sm font-medium">
              Clients directs
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="bg-white py-8 px-4 border-b">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep >= step.number
                        ? 'bg-[#0B2C5E] text-white'
                        : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 font-medium ${currentStep >= step.number ? 'text-[#0B2C5E]' : 'text-gray-600'
                      }`}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-1 mx-4 transition-colors ${currentStep > step.number ? 'bg-[#0B2C5E]' : 'bg-gray-200'
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="py-12 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            {/* STEP 1 - INFORMATIONS PERSONNELLES */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 relative">
                  Informations personnelles
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0B2C5E]"></span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom et nom *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        +212
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="6 ou 06 XX XX XX XX"
                        className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Minimum 6 caractères"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville d'intervention *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                    >
                      <option value="">Sélectionnez une ville</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Années d'expérience
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                    >
                      <option value="">Sélectionnez</option>
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarif horaire
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="rate"
                        value={formData.rate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        MAD/h
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full py-3 bg-[#0B2C5E] text-white rounded-lg hover:bg-[#081f45] transition-colors font-medium"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* STEP 2 - COMPÉTENCES */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 relative">
                    Sélectionnez vos services *
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0B2C5E]"></span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {services.map(service => (
                      <label
                        key={service.id}
                        className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${formData.services.includes(service.id)
                            ? 'border-[#0B2C5E] bg-[#0B2C5E]'
                            : 'border-gray-200 bg-white'
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.services.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="w-5 h-5 text-[#0B2C5E] border-gray-300 rounded focus:ring-[#0B2C5E] mr-3"
                        />
                        <span className="text-2xl mr-3">{service.icon}</span>
                        <span className="font-medium">{service.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Présentez-vous *
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre expérience, vos certifications, et votre façon de travailler avec les clients..."
                    rows={5}
                    maxLength={400}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E] resize-none"
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.bio.length} / 400
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zone d'intervention
                  </label>
                  <input
                    type="text"
                    name="workArea"
                    value={formData.workArea}
                    onChange={handleInputChange}
                    placeholder="Ex: Casablanca, Ain Diab, Maarif, Hay Hassani..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2C5E]"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Retour
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 py-3 bg-[#0B2C5E] text-white rounded-lg hover:bg-[#081f45] transition-colors font-medium"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 - DOCUMENTS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 relative">
                  Documents
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0B2C5E]"></span>
                </h3>

                {/* Photo de profil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo de profil *
                  </label>
                  <div
                    onClick={() => profilePhotoRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#0B2C5E] transition-colors"
                  >
                    {formData.profilePhoto ? (
                      <div className="space-y-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto border-4 border-[#0B2C5E]"></div>
                        <p className="text-sm text-gray-600">{formData.profilePhoto.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({ ...prev, profilePhoto: null }));
                          }}
                          className="text-[#0B2C5E] hover:text-[#0B2C5E] text-sm"
                        >
                          Changer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <User className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="font-medium text-gray-900">Ajoutez une photo professionnelle</p>
                          <p className="text-sm text-gray-500">JPG PNG max 5Mo</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={profilePhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                    className="hidden"
                  />
                </div>

                {/* Carte d'identité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Carte d'identité (CIN) *
                  </label>
                  <div
                    onClick={() => cinDocumentRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#0B2C5E] transition-colors"
                  >
                    {formData.cinDocument ? (
                      <div className="space-y-4">
                        <FileText className="w-12 h-12 text-[#0B2C5E] mx-auto" />
                        <p className="text-sm text-gray-600">{formData.cinDocument.name}</p>
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-[#0B2C5E] mr-2" />
                          <span className="text-[#0B2C5E] text-sm">Document ajouté</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="font-medium text-gray-900">Scannez votre CIN recto-verso</p>
                          <p className="text-sm text-gray-500">PDF JPG PNG max 10Mo - pour vérification</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={cinDocumentRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, 'cinDocument')}
                    className="hidden"
                  />
                </div>

                {/* Certificat professionnel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificat professionnel
                    <span className="ml-2 px-2 py-1 bg-[#0B2C5E] text-white rounded-full text-xs">
                      OPTIONNEL
                    </span>
                  </label>
                  <div
                    onClick={() => certificateRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-[#0B2C5E] transition-colors"
                  >
                    {formData.certificate ? (
                      <div className="space-y-4">
                        <Award className="w-12 h-12 text-[#0B2C5E] mx-auto" />
                        <p className="text-sm text-gray-600">{formData.certificate.name}</p>
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-[#0B2C5E] mr-2" />
                          <span className="text-[#0B2C5E] text-sm">Document ajouté</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Award className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="font-medium text-gray-900">Diplôme, attestation ou certification</p>
                          <p className="text-sm text-gray-500">PDF JPG PNG max 10Mo - optionnel</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={certificateRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e, 'certificate')}
                    className="hidden"
                  />
                </div>

                {/* Security info */}
                <div className="bg-[#0B2C5E] border-l-4 border-[#0B2C5E] p-4 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-white mr-3">🔒</span>
                    <p className="text-white text-sm">
                      Vos documents sont chiffrés et utilisés uniquement pour la vérification de votre identité. Jamais partagés.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={prevStep}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 bg-[#0B2C5E] text-white rounded-lg hover:bg-[#081f45] transition-colors font-medium"
                  >
                    Soumettre
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
