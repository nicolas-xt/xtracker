import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from './src/context/SettingsContext';

import { useTrades } from './hooks/useTrades';
import { useTradeStats } from './hooks/useTradeStats';
import USMarketDashboard from './components/dashboard/USMarketDashboard';
import { Dashboard } from './components/dashboard/Dashboard';
import { Settings as AppSettings } from './components/settings/Settings';
import { Behavior } from './components/behavior/Behavior';
import { TradesHistory } from './components/trades/TradesHistory';
import { AssetAnalysis } from './components/reports/AssetAnalysis';
import { KrackerLogo, KrackerName } from './components/ui/logo';
import { Button } from './components/ui/button';
import { User } from './types';
import { DateRangePickerModal } from './components/ui/DateRangePickerModal';

type View = 'dashboard' | 'trades' | 'behavior' | 'assets' | 'settings' | 'usmarket';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [timePeriod, setTimePeriod] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  // Read csv path from settings so we can load the correct CSV and allow reloading when requested
  // useTrades returns a `refetch` function used by the Dashboard "Recarregar CSV" button
  const { settings: appSettings, setActiveAccount } = useSettings();
  const activeAccount = appSettings?.accounts?.find(a => a.id === appSettings?.activeAccountId);
  const csvPathForActive = activeAccount?.csvPath ?? appSettings?.csvPathBR;
  const { trades, isLoading, error, refetch } = useTrades(csvPathForActive);

  const previousPeriodTrades = useMemo(() => {
    if (!trades) return [];
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (timePeriod) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(now.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(now.getDate() - now.getDay() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case 'semester':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 6) * 6 - 6, 1);
        endDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 6) * 6, 0);
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        endDate = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        return [];
    }

    return trades.filter(trade => {
      const tradeDate = new Date(trade.openTime);
      return tradeDate >= startDate && tradeDate <= endDate;
    });
  }, [trades, timePeriod]);

  const filteredTrades = useMemo(() => {
    if (!trades) return [];
    const now = new Date();
    let startDate = new Date();

    switch (timePeriod) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'semester':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 6) * 6, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          
          return trades.filter(trade => {
            const tradeDate = new Date(trade.openTime);
            return tradeDate >= start && tradeDate <= end;
          });
        }
        return trades;
      default:
        return trades;
    }

    return trades.filter(trade => new Date(trade.openTime) >= startDate);
  }, [trades, timePeriod, customStartDate, customEndDate]);

  const { detailedStats } = useTradeStats(filteredTrades, previousPeriodTrades);

  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD'
  });

  useEffect(() => {
    const savedUserSettings = localStorage.getItem('userSettings');
    if (savedUserSettings) {
      const userSettings = JSON.parse(savedUserSettings);
      setUser(prevUser => ({
        ...prevUser,
        name: userSettings.name || prevUser.name,
        email: userSettings.email || prevUser.email,
        avatar: userSettings.avatar || prevUser.avatar,
      }));
    }
  }, []);

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUser }));
  };

  const handleLogin = (email: string, password: string) => {
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const handleCustomDateApply = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
    setDatePickerVisible(false);
  };

  const handleTimePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimePeriod = e.target.value;
    setTimePeriod(newTimePeriod);
    if (newTimePeriod === 'custom') {
      setTempStartDate(customStartDate || new Date().toISOString().split('T')[0]);
      setTempEndDate(customEndDate || new Date().toISOString().split('T')[0]);
      setDatePickerVisible(true);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
  };

  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleLogin(email, password);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#242424] to-[#1A1A1A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-[#242424]/60 via-[#2A2A1A]/40 to-[#242424]/60 backdrop-blur-[32px] border border-gray-500/20 rounded-[28px] shadow-md shadow-black/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/[0.08] rounded-[28px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[27px]"></div>
          <div className="relative text-center space-y-6 p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#00D0FF]/15 via-[#0099CC]/10 to-[#007799]/15 rounded-[24px] backdrop-blur-[16px] border border-[#00D0FF]/20 shadow-md shadow-[#00D0FF]/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.06] to-transparent rounded-[24px]"></div>
                <div className="relative">
                  <KrackerLogo className="w-20 h-20" />
                </div>
              </div>
              <KrackerName className="h-10" />
            </div>
          </div>
          <div className="relative p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-white text-sm">Email</label>
                <div className="relative">
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300" placeholder="seu@email.com" required />
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-white text-sm">Senha</label>
                <div className="relative">
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300" placeholder="••••••••" required />
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                </div>
              </div>
              <button type="submit" className="w-full p-3 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#007799] text-white rounded-[16px] transition-all duration-300 shadow-md shadow-[#00D0FF]/20 hover:shadow-lg hover:shadow-[#00D0FF]/30 hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                <span className="relative">Entrar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const Header = () => {
    const menuItems = [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'usmarket', label: 'Mercado Americano' },
      { key: 'trades', label: 'Histórico' },
      { key: 'behavior', label: 'Comportamento' },
      { key: 'assets', label: 'Ativos' },
      { key: 'settings', label: 'Configurações' }
    ];

    return (
      <header className="bg-gradient-to-r from-[#242424]/70 via-[#2A2A2A]/60 to-[#242424]/70 backdrop-blur-[24px] border-b border-gray-500/20 px-6 py-4 shadow-md shadow-black/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-[#00D0FF]/15 via-[#0099CC]/10 to-[#007799]/15 rounded-[10px] backdrop-blur-[12px] border border-[#00D0FF]/20 shadow-md shadow-[#00D0FF]/15 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[10px]"></div>
                <div className="relative">
                  <KrackerLogo className="w-4 h-4" />
                </div>
              </div>
              <KrackerName className="h-3" />
            </div>
            <nav className="flex space-x-1">
              {menuItems.map((item) => (
                <Button
                  key={item.key}
                  onClick={() => handleViewChange(item.key as View)}
                  className={`relative px-4 py-2 rounded-[14px] transition-all duration-300 overflow-hidden ${
                    currentView === item.key
                      ? 'bg-gradient-to-r from-[#00D0FF] to-[#0099CC] text-white shadow-md shadow-[#00D0FF]/20'
                      : 'text-gray-300 hover:bg-gradient-to-br hover:from-[#2A2A2A]/50 hover:to-[#242424]/60 hover:text-white hover:backdrop-blur-[8px]'
                  }`}
                >
                  {currentView === item.key && (
                    <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                  )}
                  <span className="relative">{item.label}</span>
                </Button>
              ))}
            </nav>
            {/* Accounts selector */}
            <div className="ml-4 flex items-center space-x-2">
              {(appSettings?.accounts || []).map(acc => (
                <button key={acc.id} onClick={() => { if (typeof setActiveAccount === 'function') setActiveAccount(acc.id); }} className={`px-4 py-1 rounded-full text-sm ${appSettings?.activeAccountId === acc.id ? 'bg-gradient-to-r from-[#00D0FF] to-[#0099CC] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                  {acc.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={timePeriod}
                onChange={handleTimePeriodChange}
                className="bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300 appearance-none custom-select"
              >
                <option value="day">Hoje</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="semester">Este Semestre</option>
                <option value="year">Este Ano</option>
                <option value="custom">Personalizado</option>
              </select>
              <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.03] to-transparent rounded-[11px] pointer-events-none"></div>
            </div>
            {timePeriod === 'custom' && customStartDate && customEndDate && (
              <div
                className="flex items-center space-x-2 cursor-pointer bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                onClick={() => setDatePickerVisible(true)}
              >
                <span>{`${formatDate(customStartDate)} - ${formatDate(customEndDate)}`}</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-[#00D0FF] to-[#0099CC] rounded-full flex items-center justify-center shadow-md shadow-[#00D0FF]/20 border border-[#00D0FF]/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                {user.avatar && user.avatar.startsWith('data:image') ? (
                  <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="relative text-white text-sm font-medium">{user.avatar || user.name.charAt(0)}</span>
                )}
              </div>
              <Button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white px-3 py-1 rounded-[10px] hover:bg-gradient-to-br hover:from-[#2A2A2A]/40 hover:to-[#242424]/60 hover:backdrop-blur-[8px] transition-all duration-300"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  const renderCurrentView = () => {
    if (isLoading) {
      return <div className="p-6 text-center text-white">Carregando dados...</div>;
    }
    if (error) {
      return <div className="p-6 text-center text-red-500">Erro: {error}</div>;
    }

    switch (currentView) {
      case 'dashboard':
        return detailedStats ? <Dashboard stats={detailedStats} trades={filteredTrades} timePeriod={timePeriod} selectedPeriod={timePeriod} /> : <div className="p-6 text-center text-white">Calculando...</div>;
      case 'usmarket':
        return <USMarketDashboard />;
      case 'trades':
        return <TradesHistory trades={filteredTrades} />;
      case 'behavior':
        return detailedStats ? <Behavior stats={detailedStats} /> : <div className="p-6 text-center text-white">Carregando...</div>;
      case 'assets':
        return <AssetAnalysis stats={detailedStats} />;
      case 'settings':
        return <AppSettings onRefresh={handleLogout} user={user} onUpdateUser={handleUpdateUser} />;
      default:
        return detailedStats ? <Dashboard stats={detailedStats} trades={filteredTrades} timePeriod={timePeriod} selectedPeriod={timePeriod} /> : <div className="p-6 text-center text-white">Calculando...</div>;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background)] via-[var(--background-mid)] to-[var(--background-end)] text-white">
      <Header />
      <main className="p-6">
        {/* pass refetch to Dashboard so users can force a CSV reload after choosing a file */}
        {currentView === 'dashboard' && detailedStats
          ? <Dashboard stats={detailedStats} trades={filteredTrades} timePeriod={timePeriod} selectedPeriod={timePeriod} onReload={refetch} />
          : renderCurrentView()
        }
      </main>
      <DateRangePickerModal
        isOpen={isDatePickerVisible}
        onClose={() => setDatePickerVisible(false)}
        onApply={handleCustomDateApply}
        startDate={tempStartDate}
        setStartDate={setTempStartDate}
        endDate={tempEndDate}
        setEndDate={setTempEndDate}
      />
    </div>
  );
}