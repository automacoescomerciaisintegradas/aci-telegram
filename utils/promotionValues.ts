// Valores exatos da promoção de 20% de bônus
export const PROMOTION_VALUES: { [key: number]: { bonus: number; total: number } } = {
  50: { bonus: 10.00, total: 60.00 },
  97: { bonus: 19.40, total: 116.40 },
  197: { bonus: 39.40, total: 236.40 },
  397: { bonus: 79.40, total: 476.40 },
  697: { bonus: 139.40, total: 836.40 },
  999: { bonus: 199.80, total: 1198.80 },
};

export const PROMOTION_END_DATE = '27/08/2025';

export const getPromotionValues = (amount: number) => {
  return PROMOTION_VALUES[amount] || { 
    bonus: amount * 0.2, 
    total: amount + (amount * 0.2) 
  };
};

export const formatCurrency = (value: number) => {
  return `R$ ${value.toFixed(2)}`;
};

export const CREDIT_PLANS = [
  { value: 50, label: 'R$ 50,00', bonus: 10.00, total: 60.00 },
  { value: 97, label: 'R$ 97,00', bonus: 19.40, total: 116.40 },
  { value: 197, label: 'R$ 197,00', bonus: 39.40, total: 236.40 },
  { value: 397, label: 'R$ 397,00', bonus: 79.40, total: 476.40 },
  { value: 697, label: 'R$ 697,00', bonus: 139.40, total: 836.40 },
  { value: 999, label: 'R$ 999,00', bonus: 199.80, total: 1198.80 },
];