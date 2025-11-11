import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCountryCallingCode } from 'react-phone-number-input/input';

// The `options` prop passed by react-phone-number-input
interface CountryOption {
  value: string; // Country code like 'US', 'CL'
  label: string; // Country name like 'United States', 'Chile'
  divider?: boolean;
}

interface CustomCountrySelectProps {
  value?: string;
  onChange: (value?: string) => void;
  options: CountryOption[];
  disabled?: boolean;
  className?: string;
}

const CustomCountrySelect = React.forwardRef<HTMLButtonElement, CustomCountrySelectProps>(
  ({ value, onChange, options, disabled, className }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const selectedItemRef = useRef<HTMLLIElement>(null);

    // Hook to scroll to the selected item when the dropdown opens
    useEffect(() => {
      if (isOpen && selectedItemRef.current) {
        // Timeout to ensure the element is in the DOM before scrolling
        setTimeout(() => {
          selectedItemRef.current?.scrollIntoView({
            block: 'nearest',
            inline: 'start',
          });
        }, 0);
      }
    }, [isOpen, value]);

    // Hook to close the dropdown if a click occurs outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleSelect = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
    };

    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        {/* Main button showing the current selection */}
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="h-full flex items-center pl-3 pr-2 focus:outline-none"
        >
          {value && (
            <img
              alt={value}
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}
              className="w-6 h-auto"
            />
          )}
          <ChevronDown className={`h-5 w-5 ml-1 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {/* Dropdown options panel */}
        {isOpen && (
          <div className="absolute z-20 mt-4 w-80 max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg scrollbar-width-none [&::-webkit-scrollbar]:hidden">
            <ul className="py-1">
              {options
                .filter(option => option.value || option.divider)
                .map((option, index) => {
                  if (option.divider) {
                    return <hr key={`divider-${index}`} className="my-1 border-gray-200" />;
                  }
                  
                  const isSelected = option.value === value;

                  return (
                    <li
                      key={option.value}
                      ref={isSelected ? selectedItemRef : null}
                      onClick={() => handleSelect(option.value!)}
                      className={`px-4 py-2 cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <img
                          alt={option.label}
                          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${option.value}.svg`}
                          className="w-6 h-auto mr-3"
                        />
                        <span>{option.label}</span>
                      </div>
                      <span className={isSelected ? 'text-purple-600' : 'text-gray-500'}>
                        +{getCountryCallingCode(option.value! as any)}
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    );
  }
);

export default CustomCountrySelect;
