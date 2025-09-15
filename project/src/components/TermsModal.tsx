import React from 'react';
import { X, FileText, Shield, AlertTriangle, Scale } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Términos y Condiciones</h2>
                <p className="text-purple-100">SkipIT - Plataforma de Precompra de Tragos</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          <div className="prose max-w-none">
            
            {/* Introducción */}
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-purple-900 mb-2">Bienvenido a SkipIT</h3>
                  <p className="text-purple-800 text-sm leading-relaxed">
                    Al utilizar nuestra plataforma, aceptas estos términos y condiciones. 
                    Te recomendamos leerlos detenidamente antes de usar nuestros servicios.
                  </p>
                </div>
              </div>
            </div>

            {/* 1. Definiciones */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Definiciones
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <ul className="space-y-3 text-gray-700">
                  <li><strong>"SkipIT":</strong> Se refiere a la plataforma digital de precompra de bebidas alcohólicas para eventos masivos.</li>
                  <li><strong>"Usuario":</strong> Persona mayor de 18 años que utiliza los servicios de SkipIT.</li>
                  <li><strong>"Evento":</strong> Actividad masiva donde se pueden canjear las bebidas precompradas.</li>
                  <li><strong>"Código QR":</strong> Código de barras bidimensional que permite el canje de bebidas.</li>
                  <li><strong>"Precompra":</strong> Adquisición anticipada de bebidas alcohólicas a través de la plataforma.</li>
                </ul>
              </div>
            </section>

            {/* 2. Aceptación de Términos */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Aceptación de Términos
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  Al acceder y utilizar SkipIT, el usuario acepta estar sujeto a estos términos y condiciones. 
                  Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios. 
                  Nos reservamos el derecho de modificar estos términos en cualquier momento, 
                  notificando a los usuarios a través de la plataforma.
                </p>
              </div>
            </section>

            {/* 3. Requisitos de Edad */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Requisitos de Edad y Verificación
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-semibold mb-2">IMPORTANTE: Solo mayores de 18 años</p>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• El usuario debe ser mayor de 18 años para utilizar SkipIT</li>
                      <li>• Se requiere verificación de edad al registrarse</li>
                      <li>• Está prohibida la venta de alcohol a menores de edad</li>
                      <li>• SkipIT se reserva el derecho de solicitar identificación en cualquier momento</li>
                      <li>• El incumplimiento resultará en la suspensión inmediata de la cuenta</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Descripción del Servicio */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Descripción del Servicio
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  SkipIT es una plataforma digital que permite a los usuarios precomprar bebidas alcohólicas 
                  para eventos masivos y canjearlas mediante códigos QR, evitando las filas en las barras.
                </p>
                <h4 className="font-bold text-gray-900 mb-2">El servicio incluye:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Catálogo de eventos disponibles</li>
                  <li>• Menú de bebidas por evento</li>
                  <li>• Sistema de precompra y pago</li>
                  <li>• Generación de códigos QR</li>
                  <li>• Canje en barras autorizadas</li>
                  <li>• Historial de compras</li>
                </ul>
              </div>
            </section>

            {/* 5. Registro y Cuenta de Usuario */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                Registro y Cuenta de Usuario
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3">Para crear una cuenta, el usuario debe:</h4>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• Proporcionar información veraz y actualizada</li>
                  <li>• Verificar su edad (mayor de 18 años)</li>
                  <li>• Mantener la confidencialidad de sus credenciales</li>
                  <li>• Notificar inmediatamente cualquier uso no autorizado</li>
                </ul>
                <p className="text-gray-700 leading-relaxed">
                  El usuario es responsable de todas las actividades que ocurran bajo su cuenta. 
                  SkipIT se reserva el derecho de suspender o eliminar cuentas que violen estos términos.
                </p>
              </div>
            </section>

            {/* 6. Proceso de Compra */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                Proceso de Compra y Canje
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Precompra:</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Selección de evento y bebidas</li>
                      <li>• Pago a través de medios seguros</li>
                      <li>• Generación automática de código QR</li>
                      <li>• Confirmación por email</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Canje:</h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Presentación del código QR en la barra</li>
                      <li>• Verificación de identidad si es requerida</li>
                      <li>• Entrega inmediata de las bebidas</li>
                      <li>• Código válido solo para el evento específico</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. Precios y Pagos */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                Precios y Pagos
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <ul className="space-y-3 text-gray-700">
                  <li>• Los precios incluyen IVA y están expresados en pesos chilenos</li>
                  <li>• Los precios pueden variar según el evento y la demanda</li>
                  <li>• El pago debe completarse antes de generar el código QR</li>
                  <li>• Aceptamos tarjetas de crédito, débito y transferencias bancarias</li>
                  <li>• No se aceptan pagos en efectivo a través de la plataforma</li>
                </ul>
              </div>
            </section>

            {/* 8. Política de Cancelación */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                Política de Cancelación y Reembolsos
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <h4 className="font-bold text-orange-900 mb-3">Cancelaciones:</h4>
                <ul className="space-y-2 text-orange-800 text-sm mb-4">
                  <li>• Cancelación gratuita hasta 24 horas antes del evento</li>
                  <li>• Cancelación con cargo del 50% entre 24-6 horas antes</li>
                  <li>• No se permiten cancelaciones 6 horas antes del evento</li>
                </ul>
                <h4 className="font-bold text-orange-900 mb-3">Reembolsos:</h4>
                <ul className="space-y-2 text-orange-800 text-sm">
                  <li>• Los reembolsos se procesan en 5-10 días hábiles</li>
                  <li>• Se reembolsa al mismo medio de pago utilizado</li>
                  <li>• En caso de cancelación del evento, reembolso del 100%</li>
                </ul>
              </div>
            </section>

            {/* 9. Responsabilidades del Usuario */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">9</span>
                Responsabilidades del Usuario
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  El usuario se compromete a:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Usar la plataforma de manera responsable y legal</li>
                  <li>• Proporcionar información veraz y actualizada</li>
                  <li>• Mantener la seguridad de su cuenta y código QR</li>
                  <li>• Consumir alcohol de manera responsable</li>
                  <li>• Respetar las normas del evento y del establecimiento</li>
                  <li>• No transferir o vender códigos QR a terceros</li>
                  <li>• Reportar cualquier problema o irregularidad</li>
                </ul>
              </div>
            </section>

            {/* 10. Limitaciones de Responsabilidad */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">10</span>
                Limitaciones de Responsabilidad
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <p className="text-yellow-800 leading-relaxed mb-4">
                  SkipIT no se hace responsable por:
                </p>
                <ul className="space-y-2 text-yellow-800 text-sm">
                  <li>• Cancelación o modificación de eventos por parte de terceros</li>
                  <li>• Problemas técnicos en el evento que impidan el canje</li>
                  <li>• Pérdida o robo del código QR por parte del usuario</li>
                  <li>• Comportamiento inadecuado del usuario en el evento</li>
                  <li>• Daños derivados del consumo excesivo de alcohol</li>
                  <li>• Fallas en la conectividad de internet del usuario</li>
                </ul>
              </div>
            </section>

            {/* 11. Privacidad y Datos */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">11</span>
                Privacidad y Protección de Datos
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <p className="text-blue-800 leading-relaxed mb-4">
                  SkipIT se compromete a proteger la privacidad de sus usuarios:
                </p>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Recopilamos solo la información necesaria para el servicio</li>
                  <li>• No compartimos datos personales con terceros sin consentimiento</li>
                  <li>• Utilizamos medidas de seguridad para proteger la información</li>
                  <li>• El usuario puede solicitar la eliminación de sus datos</li>
                  <li>• Cumplimos con la Ley de Protección de Datos Personales</li>
                </ul>
              </div>
            </section>

            {/* 12. Consumo Responsable */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">12</span>
                Consumo Responsable de Alcohol
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-red-800 font-semibold mb-3">
                      SkipIT promueve el consumo responsable de alcohol:
                    </p>
                    <ul className="space-y-2 text-red-700 text-sm">
                      <li>• El consumo excesivo de alcohol es dañino para la salud</li>
                      <li>• No conduzcas bajo los efectos del alcohol</li>
                      <li>• Conoce tus límites y respétalos</li>
                      <li>• Si tienes problemas con el alcohol, busca ayuda profesional</li>
                      <li>• SkipIT puede negarse a servir a personas en estado de ebriedad</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 13. Propiedad Intelectual */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">13</span>
                Propiedad Intelectual
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  Todos los contenidos de SkipIT, incluyendo pero no limitado a textos, gráficos, logos, 
                  iconos, imágenes, clips de audio, descargas digitales y software, son propiedad de SkipIT 
                  o sus proveedores de contenido y están protegidos por las leyes de derechos de autor 
                  chilenas e internacionales.
                </p>
              </div>
            </section>

            {/* 14. Modificaciones del Servicio */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">14</span>
                Modificaciones del Servicio
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 leading-relaxed">
                  SkipIT se reserva el derecho de modificar, suspender o discontinuar cualquier aspecto 
                  del servicio en cualquier momento, con o sin previo aviso. No seremos responsables 
                  ante el usuario o terceros por cualquier modificación, suspensión o discontinuación del servicio.
                </p>
              </div>
            </section>

            {/* 15. Ley Aplicable */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">15</span>
                Ley Aplicable y Jurisdicción
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start space-x-3">
                  <Scale className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-700 leading-relaxed">
                      Estos términos y condiciones se rigen por las leyes de la República de Chile. 
                      Cualquier disputa será resuelta en los tribunales competentes de Santiago, Chile. 
                      El usuario renuncia a cualquier objeción sobre la jurisdicción o el lugar de resolución de disputas.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 16. Contacto */}
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">16</span>
                Información de Contacto
              </h3>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <p className="text-purple-800 leading-relaxed mb-4">
                  Para consultas, reclamos o soporte técnico, puedes contactarnos:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-purple-900">Email:</p>
                    <p className="text-purple-700">soporte@skipit.cl</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">Teléfono:</p>
                    <p className="text-purple-700">+56 9 1234 5678</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">Horario:</p>
                    <p className="text-purple-700">Lunes a Viernes 9:00 - 18:00</p>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-900">Dirección:</p>
                    <p className="text-purple-700">Santiago, Chile</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white text-center">
              <p className="font-semibold mb-2">
                Última actualización: Enero 2025
              </p>
              <p className="text-purple-100 text-sm">
                Al utilizar SkipIT, confirmas que has leído, entendido y aceptado estos términos y condiciones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}