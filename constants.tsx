
import { Farm, Machine, InventoryItem, HerdLot } from './types';

export const MOCK_FARMS: Farm[] = [
  {
    id: 'f1',
    name: 'Fazenda Vale do Boi',
    type: 'Propria',
    totalArea: 1200,
    productiveArea: 1000,
    piquetesCount: 45,
    livestockHeadCount: 1500,
    revenue: 5800000,
    expenses: 3200000,
    location: 'Barretos, SP',
    mainCrops: ['Pasto', 'Milho'],
    isLivestockActive: true
  },
  {
    id: 'f2',
    name: 'Estância Pantaneira',
    type: 'Arrendada',
    totalArea: 2500,
    productiveArea: 2200,
    piquetesCount: 120,
    livestockHeadCount: 3200,
    revenue: 12400000,
    expenses: 8500000,
    location: 'Aquidauana, MS',
    mainCrops: ['Pasto', 'Soja'],
    isLivestockActive: true
  }
];

export const MOCK_HERD: HerdLot[] = [
  { id: 'l1', name: 'Lote Nelore 01', category: 'Engorda', breed: 'Nelore', quantity: 250, averageWeight: 480, gmdExpected: 0.950, farmId: 'f1', lastWeighing: '10/01/2025' },
  { id: 'l2', name: 'Bezerras Angus A2', category: 'Cria', breed: 'Angus', quantity: 180, averageWeight: 190, gmdExpected: 0.750, farmId: 'f1', lastWeighing: '15/02/2025' },
  { id: 'l3', name: 'Novilhas Recria 2024', category: 'Recria', breed: 'Nelore', quantity: 400, averageWeight: 320, gmdExpected: 0.600, farmId: 'f2', lastWeighing: '01/02/2025' }
];

export const MOCK_MACHINES: Machine[] = [
  { id: 'm1', name: 'Trator MF 4292 (Grade)', type: 'Trator', status: 'Operacional', hoursWorked: 1250, fuelLevel: 65 },
  { id: 'm2', name: 'Vagão Misturador Casale', type: 'Trato', status: 'Operacional', hoursWorked: 450, fuelLevel: 100 },
  { id: 'm3', name: 'Caminhonete Toyota Hilux', type: 'Ronda', status: 'Operacional', hoursWorked: 82000, fuelLevel: 45 }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Sal Mineral 80', category: 'Suplemento', quantity: 450, unit: 'sacos', minLevel: 100 },
  { id: 'i2', name: 'Proteinado Águas', category: 'Suplemento', quantity: 1200, unit: 'sacos', minLevel: 200 },
  { id: 'i3', name: 'Vacina Febre Aftosa', category: 'Vacina', quantity: 5000, unit: 'doses', minLevel: 1000 },
  { id: 'i4', name: 'Ivermectina 3.5%', category: 'Medicamento', quantity: 25, unit: 'frascos', minLevel: 5 },
  { id: 'i5', name: 'Semente Soja M-Soy', category: 'Semente', quantity: 1500, unit: 'bags', minLevel: 100 }
];
