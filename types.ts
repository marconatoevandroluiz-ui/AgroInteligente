
export type FarmType = 'Propria' | 'Arrendada';

export interface Farm {
  id: string;
  name: string;
  type: FarmType;
  totalArea: number;
  productiveArea: number; 
  piquetesCount: number;
  livestockHeadCount: number;
  revenue: number; 
  expenses: number;
  location: string;
  mainCrops: string[];
  isLivestockActive: boolean;
}

export interface HerdLot {
  id: string;
  name: string;
  category: 'Cria' | 'Recria' | 'Engorda' | 'Touros' | 'Matrizes';
  breed: string;
  quantity: number;
  averageWeight: number;
  gmdExpected: number;
  farmId: string;
  lastWeighing: string;
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  status: 'Operacional' | 'Manutenção' | 'Parado';
  hoursWorked: number;
  fuelLevel: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Suplemento' | 'Medicamento' | 'Vacina' | 'Combustível' | 'Insumo' | 'Grão' | 'Semente';
  quantity: number;
  unit: string;
  minLevel: number;
}

export type AIAgentRole = 'Veterinário' | 'Nutricionista' | 'Mercado' | 'Pastagens' | 'Financeiro' | 'Agrônomo' | 'Pecuário' | 'Gestão' | 'Relatórios';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  agent?: AIAgentRole;
}

// Novos Tipos SaaS
export type PlanTier = 'Básico' | 'Profissional' | 'Premium';

export interface UserSubscription {
  plan: PlanTier;
  status: 'Ativo' | 'Inadimplente' | 'Trial';
  expiresAt: string;
  addOns: string[];
}
