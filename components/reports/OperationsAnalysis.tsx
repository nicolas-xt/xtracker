import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DetailedStats, ResultBy } from '../../types';

interface OperationsAnalysisProps {
  stats: DetailedStats;
}

const formatCurrency = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const formatPercent = (val: number) => `${(val * 100).toFixed(1).replace('.', ',')}%`;

const AnalysisTable = ({ title, data, headers }: { title: string; data: ResultBy<string>[]; headers: string[] }) => (
    <div className="bg-b-dark-2 border border-b-border rounded-md">
        <h3 className="text-lg font-semibold p-4 border-b border-b-border uppercase tracking-wider">{title}</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
                <thead className="text-b-text-2 uppercase">
                    <tr>
                        {headers.map(h => <th key={h} scope="col" className="px-6 py-3">{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.key} className="border-t border-b-border hover:bg-b-dark-2/50">
                            <td className="px-6 py-4 whitespace-nowrap">{row.key}</td>
                            <td className={`px-6 py-4 whitespace-nowrap ${row.result >= 0 ? 'text-b-green' : 'text-b-red'}`}>{formatCurrency(row.result)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.trades}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatPercent(row.winRate)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const OperationsAnalysis: React.FC<OperationsAnalysisProps> = ({ stats }) => {
    const daysOrder = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
    const dayOfWeekData = [...stats.resultsByDayOfWeek]
        .map(d => ({ ...d, name: d.key, Resultado: parseFloat(d.result.toFixed(2)) }))
        .sort((a,b) => daysOrder.indexOf(a.name) - daysOrder.indexOf(b.name));

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnalysisTable title="Resultado por Ativo" data={stats.resultsByAsset} headers={['Ativo', 'Resultado', 'Trades', 'Acerto (%)']} />
                <AnalysisTable title="Resultado por Tipo" data={stats.resultsByType} headers={['Tipo', 'Resultado', 'Trades', 'Acerto (%)']} />
            </div>
            <div className="bg-b-dark-2 border border-b-border rounded-md p-4 h-96">
                <h3 className="text-lg font-semibold mb-4 uppercase tracking-wider">Resultado por Dia da Semana</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={dayOfWeekData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                        <XAxis dataKey="name" stroke="#8b949e" />
                        <YAxis stroke="#8b949e" tickFormatter={(value) => `R$ ${value}`} />
                        <Tooltip
                            cursor={{fill: '#30363d50'}}
                            contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363d' }}
                            formatter={(value: number) => formatCurrency(value)}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px'}}/>
                        <Bar dataKey="Resultado" name="Resultado" fill="#2f81f7" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};