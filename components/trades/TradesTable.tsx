
import React from 'react';
import { Trade } from '../../types';
import { useSortableData, SortConfig } from '../../hooks/useSortableData';

interface TradesTableProps {
  trades: Trade[];
}

const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

const Th = ({ children, onClick, sortConfig, sortKey }: { children: React.ReactNode, onClick: () => void, sortConfig: SortConfig<Trade> | null, sortKey: keyof Trade }) => {
  const isSorted = sortConfig?.key === sortKey;
  const direction = isSorted ? (sortConfig?.direction === 'ascending' ? ' ▲' : ' ▼') : '';
  return (
    <th scope="col" className="px-6 py-3 cursor-pointer hover:text-b-text-1 transition-colors" onClick={onClick}>
      {children} <span className="text-b-blue">{direction}</span>
    </th>
  );
};

export const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  const { items, requestSort, sortConfig } = useSortableData(trades, { key: 'openTime', direction: 'descending' });

  if (trades.length === 0) {
    return <div className="p-6 text-center text-b-text-2">Nenhum trade para exibir. Importe seus dados na aba 'Configurações'.</div>;
  }
  
  return (
    <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 uppercase tracking-wider">Diário de Trades</h2>
        <div className="overflow-x-auto bg-b-dark-2 border border-b-border rounded-md">
            <table className="min-w-full text-sm text-left">
                <thead className="border-b border-b-border text-b-text-2 uppercase">
                    <tr>
                        <Th onClick={() => requestSort('openTime')} sortConfig={sortConfig} sortKey="openTime">Abertura</Th>
                        <Th onClick={() => requestSort('asset')} sortConfig={sortConfig} sortKey="asset">Ativo</Th>
                        <Th onClick={() => requestSort('side')} sortConfig={sortConfig} sortKey="side">Lado</Th>
                        <Th onClick={() => requestSort('quantity')} sortConfig={sortConfig} sortKey="quantity">Quantidade</Th>
                        <Th onClick={() => requestSort('openPrice')} sortConfig={sortConfig} sortKey="openPrice">Preço Abertura</Th>
                        <Th onClick={() => requestSort('closePrice')} sortConfig={sortConfig} sortKey="closePrice">Preço Fechamento</Th>
                        <Th onClick={() => requestSort('result')} sortConfig={sortConfig} sortKey="result">Resultado</Th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((trade) => (
                        <tr key={trade.id} className="border-b border-b-border hover:bg-b-dark-2/50">
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(trade.openTime).toLocaleString('pt-BR')}</td>
                            <td className="px-6 py-4 font-medium">{trade.asset}</td>
                            <td className={`px-6 py-4 font-semibold ${trade.side === 'C' ? 'text-b-blue' : 'text-b-yellow'}`}>{trade.side === 'C' ? 'Compra' : 'Venda'}</td>
                            <td className="px-6 py-4">{trade.quantity}</td>
                            <td className="px-6 py-4">{formatCurrency(trade.openPrice)}</td>
                            <td className="px-6 py-4">{formatCurrency(trade.closePrice)}</td>
                            <td className={`px-6 py-4 font-semibold ${trade.result >= 0 ? 'text-b-green' : 'text-b-red'}`}>
                                {formatCurrency(trade.result)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};