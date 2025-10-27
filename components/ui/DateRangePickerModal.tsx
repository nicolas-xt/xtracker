import React from 'react';
import { Button } from './button';

interface DateRangePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
}

export const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({
  isOpen,
  onClose,
  onApply,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    onApply(startDate, endDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-[#242424]/80 via-[#2A2A2A]/70 to-[#242424]/80 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-lg text-white w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Selecione o Período</h2>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="start-date" className="w-1/4">Data Inicial:</label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-3/4 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
            />
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="end-date" className="w-1/4">Data Final:</label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-3/4 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <Button
            onClick={onClose}
            className="px-4 py-2 rounded-[10px] text-gray-300 hover:bg-gradient-to-br hover:from-[#2A2A2A]/50 hover:to-[#242424]/60 hover:text-white transition-all duration-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleApply}
            className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-[#00D0FF] to-[#0099CC] text-white shadow-md shadow-[#00D0FF]/20 hover:from-[#0099CC] hover:to-[#007799] transition-all duration-300"
          >
            Aplicar
          </Button>
        </div>
      </div>
    </div>
  );
};