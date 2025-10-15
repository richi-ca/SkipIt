import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, User, Mail, MessageSquare, CheckCircle, Send } from 'lucide-react';

// --- Tipos y componente principal ---
interface IFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formSuccess, setFormSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setFocus,
    watch // Import watch
  } = useForm<IFormInput>({ mode: 'onBlur' });

  const messageValue = watch('message'); // Watch the message field value

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setFocus('name');
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      setTimeout(() => {
        reset();
        setFormSuccess('');
      }, 200);
    }
  }, [isOpen, onClose, reset, setFocus]);

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setFormSuccess('');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact_message_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFormSuccess('¡Mensaje enviado con éxito! Gracias por contactarnos.');
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Contáctanos</h2>
              <p className="text-purple-100 text-sm">¿Tienes alguna duda? Escríbenos.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors" aria-label="Cerrar modal">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[605px] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formSuccess && (
              <div role="alert" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">{formSuccess}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="name" type="text" autoComplete="name" {...register('name', { required: 'Tu nombre es obligatorio.' })} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Tu nombre completo" />
              </div>
              {errors.name && <p role="alert" className="text-sm text-red-600 mt-2">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email-contact" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input id="email-contact" type="email" autoComplete="email" {...register('email', { required: 'El email es obligatorio.', pattern: { value: /\S+@\S+\.\S+/, message: 'El formato del email no es válido.' } })} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="tu@email.com" />
              </div>
              {errors.email && <p role="alert" className="text-sm text-red-600 mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Asunto</label>
              <input id="subject" type="text" {...register('subject', { required: 'El asunto es obligatorio.' })} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`} placeholder="Motivo de tu consulta" />
              {errors.subject && <p role="alert" className="text-sm text-red-600 mt-2">{errors.subject.message}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
              <div className="relative">
                {!messageValue && (
                  <div className="absolute top-0 left-0 z-0 flex items-start px-4 py-3 pointer-events-none">
                    <MessageSquare className="relative top-[3px] w-5 h-5 text-gray-400 mr-1 flex-shrink-0" />
                    <span className="relative bottom-px text-gray-500">Escribe aquí tu mensaje...</span>
                  </div>
                )}
                <textarea 
                  id="message" 
                  {...register('message', { required: 'El mensaje no puede estar vacío.' })} 
                  className={`relative z-10 bg-transparent w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all h-32 resize-none custom-scrollbar ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                ></textarea>
              </div>
              {errors.message && <p role="alert" className="text-sm text-red-600 mt-2">{errors.message.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
