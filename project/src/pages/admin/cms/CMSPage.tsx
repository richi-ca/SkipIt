import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { baseFetch } from '../../../services/api';

export default function CMSPage() {
    const [contents, setContents] = useState({
        quienes_somos: '',
        mision: '',
        vision: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        try {
            const data = await baseFetch<any>('/cms/');
            setContents(data);
        } catch (error) {
            console.error(error);
            toast.error('Error cargando contenidos');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (key: string, value: string) => {
        try {
            await baseFetch('/cms/', {
                method: 'POST',
                body: JSON.stringify({ [key]: value })
            });
            toast.success('Contenido guardado');
            setContents(prev => ({ ...prev, [key]: value }));
        } catch (error) {
            toast.error('Error al guardar');
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando CMS...</div>;

    const sections = [
        { key: 'quienes_somos', title: '¿Quiénes Somos?' },
        { key: 'mision', title: 'Nuestra Misión' },
        { key: 'vision', title: 'Nuestra Visión' }
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestor de Contenidos (CMS)</h1>

            {sections.map(section => (
                <div key={section.key} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-700">{section.title}</h2>
                        <button
                            onClick={() => handleSave(section.key, contents[section.key as keyof typeof contents])}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Save size={18} />
                            <span>Guardar</span>
                        </button>
                    </div>
                    <div>
                        <textarea
                            value={contents[section.key as keyof typeof contents]}
                            onChange={(e) => setContents(prev => ({ ...prev, [section.key]: e.target.value }))}
                            className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none font-mono text-sm"
                            placeholder="Escribe el contenido aquí (texto plano o HTML básico)..."
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
