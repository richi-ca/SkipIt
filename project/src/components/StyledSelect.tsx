
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

const StyledSelect = ({ children, ...props }: StyledSelectProps) => {
  return (
    <div className="relative w-full">
      <select
        {...props}
        className="appearance-none w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:border-gray-400 transition-all duration-200"
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown className="h-5 w-5" />
      </div>
    </div>
  );
};

export default StyledSelect;
