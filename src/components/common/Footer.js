import { Phone, Mail, Instagram, Facebook } from 'lucide-react';
import logo from '../../assets/logo.webp';

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-wider">CONTACTO</h2>
          <div className="space-y-2">
            <a 
              href="tel:+573202895405" 
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <Phone className="w-5 h-5" />
              +57 320 2895405
            </a>
            <a 
              href="mailto:nksfiltros@gmail.com" 
              className="flex items-center gap-2 hover:text-red-500 transition-colors"
            >
              <Mail className="w-5 h-5" />
              nksfiltros@gmail.com
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-wider">PRODUCTOS</h2>
          <p className="text-lg leading-relaxed">
            FILTROS DE AIRE DE ALTO FLUJO IDEALES PARA TU MOTO.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-wider">SIGUENOS</h2>
          <img 
            src={logo}
            alt="NKS Filtros Logo" 
            className="h-16 object-contain w-40"
            width="160" height="64"
          />

          <div className="flex gap-4">
            <a 
              href="https://www.instagram.com"
              className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a 
              href="https://www.facebook.com"
              className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a 
              href="https://www.tiktok.com"
              className="bg-red-600 p-2 rounded-full hover:bg-red-700 transition-colors"
              aria-label="TikTok"
            >
              <svg 
                className="w-6 h-6" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
