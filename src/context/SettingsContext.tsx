import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AppSettings {
  initialCapital?: number;
  monthlyGoal?: number;
  dailyLossLimit?: number;
  csvPathBR?: string;
  csvPathUS?: string;
  isDarkMode?: boolean;
  monitoredFolder?: string;
}

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  setSettings: (s: AppSettings) => void;
}

const defaultSettings: AppSettings = {
  initialCapital: 100000,
  monthlyGoal: 10000,
  dailyLossLimit: 1000,
  isDarkMode: true,
  monitoredFolder: '/Users/trader/Documents/Trades',
};

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  updateSettings: () => {},
  setSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    try {
      const raw = localStorage.getItem('appSettings');
      if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
    } catch (e) {
      console.error('Failed reading appSettings from localStorage', e);
    }
    return defaultSettings;
  });

  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed saving appSettings to localStorage', e);
    }
    // dispatch an event so any non-react consumer can react
    try {
      window.dispatchEvent(new CustomEvent('appSettingsChanged', { detail: settings }));
    } catch (e) {
      // ignore
    }
  }, [settings]);

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettingsState(prev => ({ ...prev, ...patch }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, setSettings: setSettingsState }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
