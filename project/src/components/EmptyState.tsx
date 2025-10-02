
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Rocket } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  buttonText: string;
  buttonLink: string;
}

const EmptyState = ({ title, message, buttonText, buttonLink }: EmptyStateProps) => {
  return (
    <div className="text-center bg-gray-50 p-8 md:p-12 rounded-2xl">
      <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 mb-6">
        <ShoppingCart className="h-10 w-10 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">{message}</p>
      <Link
        to={buttonLink}
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
      >
        <Rocket className="w-5 h-5" />
        <span>{buttonText}</span>
      </Link>
    </div>
  );
};

export default EmptyState;
