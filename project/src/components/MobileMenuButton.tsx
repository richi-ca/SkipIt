import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileMenuButtonProps {
  onClick: () => void;
}

export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  const { user } = useAuth();
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (user) {
      setShowGreeting(true);
      timer = setTimeout(() => {
        setShowGreeting(false);
      }, 3000);
    } else {
      setShowGreeting(false);
    }
    return () => clearTimeout(timer);
  }, [user]);

  return (
    <button onClick={onClick} className="flex items-center p-2 text-gray-700 hover:text-purple-600 transition-colors">
      {user && (
        <span className={`transition-all duration-1000 ease-out overflow-hidden whitespace-nowrap ${showGreeting ? 'max-w-xs opacity-100 mr-2' : 'max-w-0 opacity-0 mr-0'}`}>
          Hola, {user.name.split(' ')[0]}
        </span>
      )}
      <Menu className="w-6 h-6" />
    </button>
  );
}