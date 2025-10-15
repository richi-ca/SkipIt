import React from 'react';
import { X, Shield, FileText, Database, Lock, Server, Cookie, Link as LinkIcon, UserCheck, Info } from 'lucide-react';

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PoliciesModal({ isOpen, onClose }: PoliciesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Políticas de Privacidad y Cookies</h2>
                <p className="text-blue-100">SkipIT - Plataforma de Precompra de Tragos</p>
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
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <p className="text-blue-800 text-sm leading-relaxed">
                    La presente Política de Privacidad y Cookies establece los términos en que SkipIT (en adelante, "La Empresa”) usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web y/o aplicación móvil (en adelante, "la Plataforma"). La Empresa está comprometida con la seguridad de los datos de sus usuarios. Cuando te pedimos llenar los campos de información personal con la cual puedes ser identificado, lo hacemos asegurando que sólo se empleará de acuerdo con los términos de este documento.
                </p>
            </div>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Información que es recogida
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p>Nuestra Plataforma podrá recoger información personal como tu nombre, y datos de contacto como tu dirección de correo electrónico y número telefónico. Así mismo, también es requerida información específica como tu dirección, si fuera necesaria para procesar tus pedidos o la ubicación del evento.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Uso de la información recogida
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p>Nuestra Plataforma emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un registro de usuarios, de pedidos, y mejorar nuestros productos y servicios.</p>
                <p>Es posible que sean enviados correos electrónicos periódicamente a través de nuestra Plataforma con ofertas especiales, nuevos productos y otra información publicitaria que consideremos relevante para ti o que pueda brindarte algún beneficio. Estos correos electrónicos serán enviados a la dirección que tú proporciones, y podrás desuscribirte en cualquier momento.</p>
                <p>La Empresa está altamente comprometida para cumplir con el compromiso de mantener tu información segura. Usamos los sistemas más avanzados y los actualizamos constantemente para asegurarnos que no exista ningún acceso no autorizado.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Confidencialidad
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p>Nuestra Plataforma asegura la confidencialidad de todos los datos personales de los usuarios que se registren en cualquiera de los formularios disponibles en [www.skipit.cl] y/o la App para tales efectos. Sin perjuicio de las facultades legales, utilizaremos los datos personales que hayan sido ingresados de manera voluntaria por los usuarios en los formularios mencionados solo para los fines indicados que estén dentro de las atribuciones y competencias de nuestra Plataforma.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Seguridad
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <p>Nuestra Plataforma posee un certificado SSL (Secure Sockets Layer) que permite asegurar la autenticidad del sitio y el cifrado de la información que nos proporciona el usuario.</p>
                <p>Cada vez que un usuario ingresa a nuestra Plataforma y proporciona su información personal con el fin de realizar una compra, el navegador web utilizado se conecta al sitio mediante el protocolo SSL, el cual certifica que el usuario está navegando en [www.skipit.cl] dentro de nuestros servidores. Esto permite que toda la información de tipo personal sea codificada previamente a su transferencia para que no pueda ser accedida cuando viaja a través de Internet.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                Cookies
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p>Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en tu computador. Al aceptar, dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas, las Plataformas pueden reconocerte individualmente y por tanto brindarte el mejor servicio personalizado de su web.</p>
                <p>Tú puedes eliminar las cookies en cualquier momento desde tu computador. Sin embargo, las cookies ayudan a proporcionar un mejor servicio de los sitios web, estas no dan acceso a información de tu computador ni de ti.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                Enlaces a Terceros
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <p>Esta Plataforma puede contener enlaces a otros sitios que pudieran ser de tu interés. Una vez que das clic en estos enlaces y abandonas nuestra página, ya no tenemos control sobre el sitio al que eres redirigido, y por lo tanto no somos responsables de los términos o privacidad ni de la protección de tus datos en esos otros sitios terceros. Dichos sitios están sujetos a sus propias políticas de privacidad por lo cual es recomendable que los consultes para confirmar que estás de acuerdo con ellas.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                Control de tu información personal
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p>Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin tu consentimiento, salvo que sea requerido por un juez con una orden judicial.</p>
                <p>La Empresa se reserva el derecho de cambiar los términos de la presente Política de Privacidad y Cookies en cualquier momento.</p>
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                Derecho de acceso a la información personal
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p>El usuario tiene derecho a obtener su información personal registrada en nuestra Plataforma, pudiendo además solicitar la rectificación, eliminación y/o cancelación de estos datos cuando lo desee, de acuerdo a la Ley N° 19.628 sobre Protección de la Vida Privada.</p>
                <p>Para ello deberá contactarse al teléfono al email [contacto@skipit.cl].</p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
