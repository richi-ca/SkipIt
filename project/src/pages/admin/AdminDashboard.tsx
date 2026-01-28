import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    TrendingUp,
    AlertCircle,
    Calendar,
    DollarSign,
    Target
} from 'lucide-react';
import { baseFetch } from '../../services/api';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface DashboardStats {
    stats: {
        label: string;
        value: string;
        icon: string;
        change: string;
        color: string;
    }[];
    recentActivity: {
        action: string;
        user: string;
        time: string;
        type: string;
        alert?: boolean;
    }[];
}

const iconMap: Record<string, any> = {
    Users,
    DollarSign,
    Calendar,
    ShoppingBag,
    Target
};

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await baseFetch<DashboardStats>('/stats/dashboard');
                setData(response);
            } catch (error) {
                console.error("Error loading dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) return <div className="p-10 text-center">Cargando estadísticas...</div>;

    const stats = data?.stats || [];
    const recentActivity = data?.recentActivity || [];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>

            {/* Cards de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {stats.map((stat, index) => {
                    const Icon = iconMap[stat.icon] || AlertCircle;
                    return (
                        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                    <Icon size={24} />
                                </div>
                                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-gray-500'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de Ventas (Placeholder) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Resumen de Ventas</h2>
                        <select className="bg-gray-50 border border-gray-200 rounded-lg text-sm px-3 py-1 focus:ring-2 focus:ring-purple-500 outline-none">
                            <option>Esta semana</option>
                            <option>Este mes</option>
                            <option>Este año</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="text-center text-gray-400">
                            <TrendingUp size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Gráfico de ventas aquí</p>
                        </div>
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Actividad Reciente</h2>
                    <div className="space-y-4">
                        {recentActivity.length === 0 && <p className="text-gray-500 text-center">No hay actividad reciente.</p>}
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className={`mt-1 w-2 h-2 rounded-full ${activity.alert ? 'bg-red-500' : 'bg-purple-500'}`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-xs text-gray-500">
                                        {activity.user} • {formatDistanceToNow(parseISO(activity.time), { addSuffix: true, locale: es })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-center text-sm text-purple-600 font-medium hover:text-purple-700 py-2 border border-purple-100 rounded-lg hover:bg-purple-50 transition-colors">
                        Ver todo el historial
                    </button>
                </div>
            </div>
        </div>
    );
}
