
import React, { useState, useRef, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import CustomDropdown from './CustomDropdown'; // Usar el nuevo componente

interface FilterPopoverProps {
  filtroEvento: string;
  setFiltroEvento: (value: string) => void;
  opcionesEvento: { id: number; name: string }[];
  filtroMes: string;
  setFiltroMes: (value: string) => void;
  opcionesMes: { value: string; label: string }[];
}

const FilterPopover = (props: FilterPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { 
    filtroEvento,
    setFiltroEvento,
    opcionesEvento,
    filtroMes,
    setFiltroMes,
    opcionesMes
  } = props;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverRef]);

  const activeFilterCount = [filtroEvento, filtroMes].filter(f => f !== 'todos').length;

  // Adaptar las opciones al formato de CustomDropdown
  const opcionesEventoFormato = [
    { value: 'todos', label: 'Todos los eventos' },
    ...opcionesEvento.map(e => ({ value: e.id.toString(), label: e.name }))
  ];

  const opcionesMesFormato = [
    { value: 'todos', label: 'Todos los meses' },
    ...opcionesMes
  ];

  return (
    <div className="relative" ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <Filter className="h-5 w-5 text-gray-600" />
        <span className="font-medium text-gray-700">Filtrar</span>
        {activeFilterCount > 0 && (
          <span className="bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Filtros</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
              <CustomDropdown
                value={filtroEvento}
                onChange={setFiltroEvento}
                options={opcionesEventoFormato}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mes</label>
              <CustomDropdown
                value={filtroMes}
                onChange={setFiltroMes}
                options={opcionesMesFormato}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPopover;
