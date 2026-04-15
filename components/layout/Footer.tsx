import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#" },
    { name: "Providers", href: "/providers" },
    { name: "Request", href: "/request" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Social links will be added later with proper icons

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 - Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#0B3B24] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold">M3allam</span>
              <span className="text-xl font-bold text-[#C2E0C6]">Connect</span>
            </div>
            <p className="text-gray-300 text-sm">
              La plateforme N°1 au Maroc pour trouver des artisans qualifiés et vérifiés pour tous vos besoins à domicile.
            </p>
            <div className="text-gray-400 text-sm mt-4">
              Réseaux sociaux disponibles prochainement
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liens rapides</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-[#C2E0C6] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 - Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#4A8B71] mt-1 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Casablanca, Maroc
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#4A8B71] flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  +212 6XX XXX XXX
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#4A8B71] flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  contact@m3allamconnect.ma
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-[#4A8B71] flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  Lun-Sam: 8h00 - 20h00
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 M3allam Connect. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-[#C2E0C6] text-sm transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#C2E0C6] text-sm transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
