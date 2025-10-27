import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trade } from '../../types';
import { X } from 'lucide-react';

// This interface will be used by the chart component as well
export interface HourlyPerformance {
  hour: number;
  totalResult: number;
  winRate: number;
  totalTrades: number;
}

interface HourDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hourData: HourlyPerformance | null;
  trades: Trade[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-700/30 rounded-lg p-3 text-center">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="text-md font-semibold text-white">{value}</div>
    </div>
);

export const HourDetailsModal: React.FC<HourDetailsModalProps> = ({ isOpen, onClose, hourData, trades }) => {
  if (!hourData) return null;

  const avgResult = hourData.totalTrades > 0 ? hourData.totalResult / hourData.totalTrades : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-gradient-to-br from-[#2A2A2A] to-[#1E1E1E] border border-gray-500/30 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b border-gray-500/30">
              <h2 className="text-lg font-semibold text-white">Detalhes do Horário - {hourData.hour}h às {hourData.hour + 1}h</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </header>
            
            {/* Summary Stats Section */}
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-gray-500/30">
                <StatCard label="Resultado Total" value={formatCurrency(hourData.totalResult)} />
                <StatCard label="Resultado Médio" value={formatCurrency(avgResult)} />
                <StatCard label="Taxa de Acerto" value={`${hourData.winRate.toFixed(0)}%`} />
                <StatCard label="Nº de Operações" value={hourData.totalTrades.toString()} />
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-3">
                {trades.length > 0 ? (
                  trades.map((trade) => (
                    <div key={trade.id} className={`p-3 rounded-lg border ${trade.result >= 0 ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-white">{trade.asset} <span className="text-xs font-normal text-gray-400 ml-2">{trade.setup}</span></div>
                        <div className={`font-bold ${trade.result >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(trade.result)}</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(trade.openTime).toLocaleString('pt-BR')} | Duração: {trade.duration}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">Nenhuma operação encontrada para este horário.</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};