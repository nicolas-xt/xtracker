import { Trade } from '../types';

// Dados simulados baseados no trades.csv
export const mockTrades: Trade[] = [
  {
    id: '1',
    asset: 'WINZ25',
    openTime: '2025-10-16T09:04:34',
    closeTime: '2025-10-16T09:06:06',
    duration: '1min32s',
    quantity: 7,
    side: 'C', // Compra
    openPrice: 145725.00,
    closePrice: 145570.00,
    result: -217.00,
  },
  {
    id: '2',
    asset: 'WINZ25',
    openTime: '2025-10-16T09:06:54',
    closeTime: '2025-10-16T09:19:28',
    duration: '12min34s',
    quantity: 7,
    side: 'V', // Venda
    openPrice: 145645.00,
    closePrice: 145525.00,
    result: -168.00,
  },
  // Adicione mais trades simulados aqui para testes
  {
    id: '3',
    asset: 'WDOZ25',
    openTime: '2025-10-16T10:00:00',
    closeTime: '2025-10-16T10:05:00',
    duration: '5min00s',
    quantity: 10,
    side: 'C',
    openPrice: 5400.50,
    closePrice: 5405.00,
    result: 450.00,
  },
];
