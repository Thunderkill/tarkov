interface Trader {
  id: string;
  working: boolean;
  customizationSeller: boolean;
  name: string;
  surname: string;
  nickname: string;
  location: string;
  avatar: string;
  balanceRub: number;
  balanceDol: number;
  balanceEur: number;
  display: boolean;
  discount: number;
  discountEnd: number;
  buyerUp: boolean;
  currency: Currency;
  supplyNextTime: number;
  repair: Repair;
  insurance: Insurance;
  gridHeight: number;
  loyalty: Loyalty;
  sellCategory: any[];
}

interface Repair {
  availability: boolean;
  quality: string;
  excludedIdList: string[];
  excludedCategory: string[];
  currency?: string;
  currencyCoefficient?: number;
  priceRate: number;
}

interface Insurance {
  availability: boolean;
  minPayment: number;
  minReturnHour: number;
  maxReturnHour: number;
  maxStorageTime: number;
  excludedCategory: string[];
}

interface Loyalty {
  currentLevel: number;
  currentStanding: number;
  currentSalesSum: number;
  loyaltyLevels: Map<string, LoyaltyLevel>;
}

interface LoyaltyLevel {
  minLevel: number;
  minSalesSum: number;
  minStanding: number;
}

enum Currency {
  RUB,
  USD,
  EUR
}
