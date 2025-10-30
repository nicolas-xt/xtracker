import React, { createContext, useContext, useEffect, useState } from 'react';

export interface AppSettings {
  initialCapital?: number;
  monthlyGoal?: number;
  dailyLossLimit?: number;
  // legacy single-path keys are still supported but prefer `accounts`
  csvPathBR?: string;
  csvPathUS?: string;
  // Multi-account support
  accounts?: Account[];
  activeAccountId?: string;
  isDarkMode?: boolean;
  monitoredFolder?: string;
}

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  setSettings: (s: AppSettings) => void;
  // Multi-account helpers
  addAccount: (account: Account) => void;
  updateAccount: (id: string, patch: Partial<Account>) => void;
  removeAccount: (id: string) => void;
  setActiveAccount: (id?: string) => void;
}

export interface Account {
  id: string;
  name: string; // e.g. 'BR PROFIT', 'US BLACK ARROW'
  platform?: string; // optional platform identifier
  csvPath?: string; // path to CSV for this account
}

const defaultAccounts: Account[] = [
  { id: 'br_profit', name: 'BR PROFIT', platform: 'br', csvPath: '' },
  { id: 'us_black_arrow', name: 'US BLACK ARROW', platform: 'us', csvPath: '' },
];

const defaultSettings: AppSettings = {
  initialCapital: 100000,
  monthlyGoal: 10000,
  dailyLossLimit: 1000,
  isDarkMode: true,
  monitoredFolder: '/Users/trader/Documents/Trades',
  accounts: defaultAccounts,
  activeAccountId: defaultAccounts[0].id,
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
      if (raw) {
        const parsed = JSON.parse(raw) as AppSettings;
        // migrate legacy single-path keys into accounts if necessary
        const migrated = { ...defaultSettings, ...parsed } as AppSettings;
        if ((!migrated.accounts || migrated.accounts.length === 0) && (parsed.csvPathBR || parsed.csvPathUS)) {
          const accounts: Account[] = [];
          if (parsed.csvPathBR) accounts.push({ id: 'br', name: 'BR Account', platform: 'br', csvPath: parsed.csvPathBR });
          if (parsed.csvPathUS) accounts.push({ id: 'us', name: 'US Account', platform: 'us', csvPath: parsed.csvPathUS });
          if (accounts.length > 0) {
            migrated.accounts = accounts;
            migrated.activeAccountId = migrated.activeAccountId ?? accounts[0].id;
          }
        }
        // ensure at least one account: fallback to defaultAccounts
        if (!migrated.accounts || migrated.accounts.length === 0) {
          migrated.accounts = defaultAccounts;
          migrated.activeAccountId = migrated.activeAccountId ?? defaultAccounts[0].id;
        }
        return migrated;
      }
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

  // Multi-account helpers
  const addAccount = (account: Account) => {
    setSettingsState(prev => {
      const accounts = [...(prev.accounts || []), account];
      return { ...prev, accounts };
    });
  };

  const updateAccount = (id: string, patch: Partial<Account>) => {
    setSettingsState(prev => {
      const accounts = (prev.accounts || []).map(a => a.id === id ? { ...a, ...patch } : a);
      return { ...prev, accounts };
    });
  };

  const removeAccount = (id: string) => {
    setSettingsState(prev => {
      const accounts = (prev.accounts || []).filter(a => a.id !== id);
      let activeAccountId = prev.activeAccountId;
      if (activeAccountId === id) activeAccountId = accounts.length > 0 ? accounts[0].id : undefined;
      return { ...prev, accounts, activeAccountId };
    });
  };

  const setActiveAccount = (id?: string) => {
    setSettingsState(prev => ({ ...prev, activeAccountId: id }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, setSettings: setSettingsState, addAccount, updateAccount, removeAccount, setActiveAccount }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
