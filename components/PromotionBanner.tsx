import React from 'react';
import { PROMOTION_END_DATE } from '../utils/promotionValues';

export const PromotionBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg mb-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">🎉</span>
          <h3 className="text-2xl font-bold">PROMOÇÃO ESPECIAL</h3>
          <span className="text-3xl">🎉</span>
        </div>
        
        <p className="text-lg font-semibold mb-4">
          Ganhe <span className="text-yellow-300 text-xl font-bold">20% de bônus</span> em qualquer recarga!
        </p>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
          <p className="text-sm">
            ⏰ Promoção válida até <span className="font-bold text-yellow-300">{PROMOTION_END_DATE}</span>
          </p>
        </div>
        
        <div className="mt-4 text-sm opacity-90">
          <p>💰 Quanto mais você recarrega, mais bônus você ganha!</p>
        </div>
      </div>
    </div>
  );
};