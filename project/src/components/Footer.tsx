import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import logoSkipIT from '../assets/images/Logo5.png';
import TermsModal from './TermsModal';
import PoliciesModal from './PoliciesModal'; // Import PoliciesModal
import ContactModal from './ContactModal'; // Import ContactModal

export default function Footer() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPoliciesModalOpen, setIsPoliciesModalOpen] = useState(false); // Add state for PoliciesModal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false); // Add state for ContactModal

  return (
    <>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          <Link to="/">
                            <img src={logoSkipIT} alt="Logo SkipIT" className="h-12" />
                          </Link>
                        </div>
                        <p className="text-gray-400">¡Sáltate la fila, y dedícate a disfrutar!</p>
                      </div>            <div>
              <h3 className="font-bold mb-4">Navegación</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Inicio</Link></li>
                <li><Link to="/events" className="hover:text-white">Eventos</Link></li>
                <li><a href="#quienes-somos" className="hover:text-white">¿Quiénes Somos?</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => setIsTermsModalOpen(true)} className="hover:text-white text-left">
                    Términos y Condiciones
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsPoliciesModalOpen(true)} className="hover:text-white text-left">
                    Políticas de Privacidad y Cookies
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsContactModalOpen(true)} className="hover:text-white text-left">
                    Contacto
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Síguenos</h3>
                                <div className="flex space-x-4">
                                  <a href="https://www.instagram.com/skipit.cl/" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white flex items-center gap-2">
                                    <Instagram className="w-5 h-5" />
                                    <span>Instagram</span>
                                  </a>
                                </div>
                                <div className="border-t border-gray-700 my-4"></div> {/* The new divider */}
                                <h3 className="font-bold mb-4">Métodos de Pago</h3>
                                <div>
                                  <img src="https://publico.transbank.cl/documents/20129/38535804/logo_tbk.svg" alt="Webpay" className="h-8 bg-white p-1 rounded" />
                                </div>            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SkipIT. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      <PoliciesModal isOpen={isPoliciesModalOpen} onClose={() => setIsPoliciesModalOpen(false)} />
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </>
  );
}
