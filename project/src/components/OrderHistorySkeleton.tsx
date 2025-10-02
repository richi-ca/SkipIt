
import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white shadow-lg rounded-2xl p-6">
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="h-8 bg-gray-300 rounded w-24 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-20"></div>
        </div>
      </div>

      {/* Details */}
      <div className="border-t border-b border-gray-200 py-4 my-4">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-3"></div>
            <div className="h-4 bg-gray-300 rounded w-56"></div>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-300 rounded-full mr-3"></div>
            <div className="h-4 bg-gray-300 rounded w-48"></div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="h-5 bg-gray-300 rounded w-40 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>

      {/* Button */}
      <div className="mt-6">
        <div className="h-12 bg-gray-300 rounded-full w-full"></div>
      </div>
    </div>
  </div>
);

const OrderHistorySkeleton = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mi Historial de Pedidos</h1>
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

export default OrderHistorySkeleton;
