import React from 'react';
import { ResultBy } from '../../types';

interface PerformanceCalendarProps {
  data: ResultBy<string>[];
}

// Helper to generate calendar days
const getCalendarDays = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  const firstDayOfWeek = date.getDay(); // 0 for Sunday, 1 for Monday, etc.

  // Adjust firstDayOfWeek to start from Monday (1) to Sunday (7)
  // If Sunday (0), make it 6 (last day of week)
  const adjustedFirstDayOfWeek = (firstDayOfWeek === 0) ? 6 : firstDayOfWeek - 1;


  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < adjustedFirstDayOfWeek; i++) {
    days.push({ day: null, result: null });
  }

  while (date.getMonth() === month) {
    days.push({ day: new Date(date), result: null });
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const PerformanceCalendar: React.FC<PerformanceCalendarProps> = ({ data }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString('pt-BR', { month: 'long' });

  const calendarDays = getCalendarDays(year, month);

  // Map results to calendar days
  const performanceMap = new Map(data.map(item => [item.key, item.result]));
  const daysWithResults = calendarDays.map(d => {
    if (!d.day) return d;
    // Create a timezone-safe date string key: YYYY-MM-DD
    const y = d.day.getFullYear();
    const m = String(d.day.getMonth() + 1).padStart(2, '0');
    const day = String(d.day.getDate()).padStart(2, '0');
    const dateString = `${y}-${m}-${day}`;
    return { ...d, result: performanceMap.get(dateString) ?? null };
  });

  const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']; // Start from Monday

  return (
    <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
      {/* Liquid Glass Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
      <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-4">Calendário de Performance</h3>
        <div className="space-y-3">
          <div className="text-xs text-gray-400 mb-2 capitalize">{monthName} {year}</div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
            {weekDays.map(day => <div key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mt-1">
            {daysWithResults.map((dayInfo, index) => {
              if (!dayInfo.day) return <div key={index} className="w-6 h-6"></div>; // Adjusted size for empty cells
              
              const dayNumber = dayInfo.day.getDate();
              const result = dayInfo.result ?? 0; // Use 0 if result is null

              let bgColor = 'bg-gray-700'; // No trading
              if (result > 0) {
                bgColor = result > 200 ? 'bg-[#28C780]' : result > 100 ? 'bg-[#28C780]/70' : 'bg-[#28C780]/40';
              } else if (result < 0) {
                bgColor = result < -150 ? 'bg-[#EA3943]' : result < -50 ? 'bg-[#EA3943]/70' : 'bg-[#EA3943]/40';
              }

              return (
                <div
                  key={index} // Use index as key for actual days
                  className={`w-6 h-6 ${bgColor} rounded text-xs text-white flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                  title={dayInfo.result === null ? 'Sem operações' : `R$ ${result.toFixed(2)}`}
                >
                  {dayNumber}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-400">Menos</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-700 rounded"></div>
              <div className="w-3 h-3 bg-[#EA3943]/40 rounded"></div>
              <div className="w-3 h-3 bg-[#EA3943]/70 rounded"></div>
              <div className="w-3 h-3 bg-[#EA3943] rounded"></div>
              <div className="w-3 h-3 bg-[#28C780]/40 rounded"></div>
              <div className="w-3 h-3 bg-[#28C780]/70 rounded"></div>
              <div className="w-3 h-3 bg-[#28C780] rounded"></div>
            </div>
            <span className="text-xs text-gray-400">Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
};