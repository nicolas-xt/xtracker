import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { KrackerLogo, KrackerName } from './components/ui/logo';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [timePeriod, setTimePeriod] = useState('month');

  // Mock user data
  const mockUser = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: 'JS'
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

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  // Login Screen Component
  const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleLogin(email, password);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#242424] to-[#1A1A1A] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[32px] border border-gray-500/20 rounded-[28px] shadow-md shadow-black/5 relative overflow-hidden">
          {/* Liquid Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/[0.08] rounded-[28px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[27px]"></div>
          
          <div className="relative text-center space-y-6 p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#00D0FF]/15 via-[#0099CC]/10 to-[#007799]/15 rounded-[24px] backdrop-blur-[16px] border border-[#00D0FF]/20 shadow-md shadow-[#00D0FF]/15 relative overflow-hidden">
                {/* Inner glass effect */}
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
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                    placeholder="seu@email.com"
                    required
                  />
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-white text-sm">Senha</label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full p-3 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#007799] text-white rounded-[16px] transition-all duration-300 shadow-md shadow-[#00D0FF]/20 hover:shadow-lg hover:shadow-[#00D0FF]/30 hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                <span className="relative">Entrar</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Header Component
  const Header = () => {
    const menuItems = [
      { key: 'dashboard', label: 'Dashboard' },
      { key: 'trades', label: 'Histórico' },
      { key: 'behavior', label: 'Comportamento' },
      { key: 'assets', label: 'Ativos' },
      { key: 'settings', label: 'Configurações' }
    ];

    return (
      <header className="bg-gradient-to-r from-[#242424]/70 via-[#2A2A2A]/60 to-[#242424]/70 backdrop-blur-[24px] border-b border-gray-500/20 px-6 py-4 shadow-md shadow-black/5 relative">
        {/* Liquid Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-[#00D0FF]/15 via-[#0099CC]/10 to-[#007799]/15 rounded-[16px] backdrop-blur-[12px] border border-[#00D0FF]/20 shadow-md shadow-[#00D0FF]/15 relative overflow-hidden">
                {/* Inner glass effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <KrackerLogo className="w-10 h-10" />
                </div>
              </div>
              <KrackerName className="h-7" />
            </div>
            
            <nav className="flex space-x-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleViewChange(item.key)}
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
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <select 
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
              >
                <option value="day">Hoje</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
                <option value="semester">Este Semestre</option>
                <option value="year">Este Ano</option>
              </select>
              <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.03] to-transparent rounded-[11px] pointer-events-none"></div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{mockUser.name}</p>
                <p className="text-xs text-gray-400">{mockUser.email}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-[#00D0FF] to-[#0099CC] rounded-full flex items-center justify-center shadow-md shadow-[#00D0FF]/20 border border-[#00D0FF]/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                <span className="relative text-white text-sm font-medium">{mockUser.avatar}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-gray-300 hover:text-white px-3 py-1 rounded-[10px] hover:bg-gradient-to-br hover:from-[#2A2A2A]/40 hover:to-[#242424]/60 hover:backdrop-blur-[8px] transition-all duration-300"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  };

  // Enhanced KPI Card Component with Sparkline
  const KPICard = ({ title, value, change, changeType, subtitle, sparklineData }: {
    title: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    subtitle?: string;
    sparklineData?: number[];
  }) => {
    const changeColor = changeType === 'positive' ? 'text-[#28C780]' : 
                       changeType === 'negative' ? 'text-[#EA3943]' : 'text-gray-400';

    return (
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md hover:shadow-lg hover:shadow-[#00D0FF]/8 transition-all duration-300 relative overflow-hidden group">
        {/* Liquid Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
        
        <div className="relative space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-gray-400">{title}</h3>
            {change && (
              <span className={`text-sm font-medium ${changeColor} px-2 py-1 rounded-[10px] bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-[8px] border border-gray-600/30`}>
                {change}
              </span>
            )}
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-semibold text-white">{value}</span>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
            
            {/* Sparkline */}
            {sparklineData && (
              <div className="w-16 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData.map((val, i) => ({ value: val, index: i }))}>
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke={changeColor.includes('28C780') ? '#28C780' : changeColor.includes('EA3943') ? '#EA3943' : '#00D0FF'}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Content
  const Dashboard = () => {
    const kpis = [
      {
        title: 'Resultado Líquido',
        value: 'R$ 4.600,00',
        change: '+15.2%',
        changeType: 'positive' as const,
        subtitle: 'Meta: R$ 5.000',
        sparklineData: [4200, 4100, 4350, 4280, 4420, 4380, 4600]
      },
      {
        title: 'Taxa de Acerto',
        value: '62.5%',
        change: '+2.5%',
        changeType: 'positive' as const,
        subtitle: '5 de 8 trades (hoje)',
        sparklineData: [58, 60, 55, 62, 59, 61, 62.5]
      },
      {
        title: 'Payoff',
        value: '2.1 : 1',
        change: '+0.3',
        changeType: 'positive' as const,
        subtitle: 'Gain Médio: R$ 1.320 | Loss Médio: R$ 633',
        sparklineData: [1.8, 1.9, 1.7, 2.0, 1.9, 2.0, 2.1]
      },
      {
        title: 'Fator de Lucro',
        value: '2.34',
        change: '+0.19',
        changeType: 'positive' as const,
        subtitle: 'Lucro: R$ 5.800 | Prejuízo: R$ 2.480',
        sparklineData: [2.1, 2.0, 1.9, 2.2, 2.1, 2.2, 2.34]
      },
      {
        title: 'Drawdown Máximo',
        value: 'R$ 1.200,00',
        change: '-R$ 200',
        changeType: 'positive' as const,
        subtitle: '4.2% do capital',
        sparklineData: [1400, 1350, 1500, 1300, 1250, 1400, 1200]
      },
      {
        title: 'Total de Operações',
        value: '8',
        change: '+3 vs. ontem',
        changeType: 'positive' as const,
        subtitle: 'Hoje',
        sparklineData: [4, 6, 3, 7, 5, 5, 8]
      }
    ];

    // Função para gerar dados baseados no período selecionado
    const getEquityData = () => {
      switch (timePeriod) {
        case 'day':
          return [
            { key: 0, label: 'Início', balance: 50000 },
            { key: 1, label: 'Op 1', balance: 51400 },
            { key: 2, label: 'Op 2', balance: 50600 },
            { key: 3, label: 'Op 3', balance: 53000 },
            { key: 4, label: 'Op 4', balance: 53800 },
            { key: 5, label: 'Op 5', balance: 53000 },
            { key: 6, label: 'Op 6', balance: 54200 },
            { key: 7, label: 'Op 7', balance: 53400 },
            { key: 8, label: 'Op 8', balance: 56200 },
          ];
        
        case 'week':
          return [
            { key: 0, label: '12/01', balance: 50000 },
            { key: 1, label: '13/01', balance: 49800 },
            { key: 2, label: '14/01', balance: 52100 },
            { key: 3, label: '15/01', balance: 53600 },
            { key: 4, label: '16/01', balance: 55200 },
            { key: 5, label: '17/01', balance: 54800 },
            { key: 6, label: '18/01', balance: 56200 },
          ];
        
        case 'month':
          return [
            { key: 0, label: '01/01', balance: 50000 },
            { key: 1, label: '05/01', balance: 48900 },
            { key: 2, label: '10/01', balance: 51200 },
            { key: 3, label: '15/01', balance: 53600 },
            { key: 4, label: '20/01', balance: 52400 },
            { key: 5, label: '25/01', balance: 55100 },
            { key: 6, label: '31/01', balance: 56200 },
          ];
        
        case 'semester':
          return [
            { key: 0, label: 'Jan', balance: 50000 },
            { key: 1, label: 'Fev', balance: 52300 },
            { key: 2, label: 'Mar', balance: 48900 },
            { key: 3, label: 'Abr', balance: 54200 },
            { key: 4, label: 'Mai', balance: 55800 },
            { key: 5, label: 'Jun', balance: 56200 },
          ];
        
        case 'year':
          return [
            { key: 0, label: 'Jan', balance: 50000 },
            { key: 1, label: 'Fev', balance: 52300 },
            { key: 2, label: 'Mar', balance: 48900 },
            { key: 3, label: 'Abr', balance: 54200 },
            { key: 4, label: 'Mai', balance: 55800 },
            { key: 5, label: 'Jun', balance: 56200 },
            { key: 6, label: 'Jul', balance: 58100 },
            { key: 7, label: 'Ago', balance: 57400 },
            { key: 8, label: 'Set', balance: 59600 },
            { key: 9, label: 'Out', balance: 61200 },
            { key: 10, label: 'Nov', balance: 59800 },
            { key: 11, label: 'Dez', balance: 62400 },
          ];
        
        default:
          return [
            { key: 0, label: 'Op 1', balance: 51400 },
            { key: 1, label: 'Op 2', balance: 50600 },
            { key: 2, label: 'Op 3', balance: 53000 },
            { key: 3, label: 'Op 4', balance: 53800 },
            { key: 4, label: 'Op 5', balance: 53000 },
            { key: 5, label: 'Op 6', balance: 54200 },
            { key: 6, label: 'Op 7', balance: 53400 },
            { key: 7, label: 'Op 8', balance: 56200 },
          ];
      }
    };

    const equityData = getEquityData();

    // Função para formatar o tooltip baseado no período
    const getTooltipLabel = (label: string) => {
      switch (timePeriod) {
        case 'day':
          return label === 'Início' ? 'Saldo Inicial' : label;
        case 'week':
        case 'month':
          return `Dia ${label}`;
        case 'semester':
        case 'year':
          return `Mês de ${label}`;
        default:
          return label;
      }
    };

    return (
      <div className="space-y-6">
        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Equity Curve */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            {/* Liquid Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-4">Curva de Patrimônio</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[16px] border border-gray-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent rounded-[16px]"></div>
                  <div className="relative">
                    <p className="text-sm text-gray-400 mb-1">Saldo Inicial</p>
                    <p className="text-lg font-semibold text-white">R$ 50.000,00</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[16px] border border-gray-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent rounded-[16px]"></div>
                  <div className="relative">
                    <p className="text-sm text-gray-400 mb-1">Saldo Atual</p>
                    <p className="text-lg font-semibold text-white">R$ 56.200,00</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[16px] border border-gray-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] to-transparent rounded-[16px]"></div>
                  <div className="relative">
                    <p className="text-sm text-gray-400 mb-1">Retorno Total</p>
                    <p className="text-lg font-semibold text-[#28C780]">R$ 6.200,00 (12.4%)</p>
                  </div>
                </div>
              </div>
              
              {/* Gráfico da Curva de Patrimônio */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={equityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis 
                      dataKey="label"
                      stroke="#9CA3AF"
                      fontSize={12}
                      angle={timePeriod === 'year' ? -45 : 0}
                      textAnchor={timePeriod === 'year' ? 'end' : 'middle'}
                      height={timePeriod === 'year' ? 60 : 40}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                      domain={['dataMin - 1000', 'dataMax + 1000']}
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#2A2A2A',
                        border: '1px solid #4B5563',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                      formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Saldo']}
                      labelFormatter={(label) => getTooltipLabel(label)}
                    />
                    {/* Linha de Capital Inicial */}
                    <Line 
                      type="monotone" 
                      dataKey={() => 50000}
                      stroke="#9CA3AF" 
                      strokeWidth={1}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Capital Inicial"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#00D0FF" 
                      strokeWidth={2}
                      dot={{ fill: '#00D0FF', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#00D0FF', strokeWidth: 2, fill: '#FFFFFF' }}
                      name="Patrimônio"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Performance Calendar Heatmap */}
          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            {/* Liquid Glass Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            
            <div className="relative">
              <h3 className="text-lg font-semibold text-white mb-4">Calendário de Performance</h3>
              <div className="space-y-3">
                <div className="text-xs text-gray-400 mb-2">Janeiro 2024</div>
                <div className="grid grid-cols-7 gap-1">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-xs text-gray-400 text-center p-1">{day}</div>
                  ))}
                  {/* Calendar Days with Performance Colors */}
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    // Mock performance data
                    const results = [
                      0, 150, -80, 200, 0, 0, 0,  // Week 1
                      300, -120, 180, 0, 250, 0, 0, // Week 2
                      -90, 400, 120, 0, -200, 0, 0, // Week 3
                      180, 0, -150, 300, 220, 0, 0, // Week 4
                      85, -60, 170 // Week 5 partial
                    ];
                    const result = results[i] || 0;
                    
                    let bgColor = 'bg-gray-700'; // No trading
                    if (result > 0) {
                      bgColor = result > 200 ? 'bg-[#28C780]' : result > 100 ? 'bg-[#28C780]/70' : 'bg-[#28C780]/40';
                    } else if (result < 0) {
                      bgColor = result < -150 ? 'bg-[#EA3943]' : result < -50 ? 'bg-[#EA3943]/70' : 'bg-[#EA3943]/40';
                    }
                    
                    return (
                      <div
                        key={day}
                        className={`w-6 h-6 ${bgColor} rounded text-xs text-white flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity`}
                        title={result === 0 ? 'Sem operações' : `R$ ${result.toFixed(2)}`}
                      >
                        {day}
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
        </div>
      </div>
    );
  };

  // Trades History Component
  const TradesHistory = () => {
    const [trades] = useState([
      {
        id: '1',
        asset: 'WDO',
        entryDate: '2024-01-18',
        entryTime: '09:15:00',
        entryPrice: 120500,
        exitDate: '2024-01-18',
        exitTime: '10:30:00',
        exitPrice: 121200,
        quantity: 2,
        duration: '1h 15m',
        result: 1400,
        type: 'gain',
        setup: 'Rompimento',
        tags: ['trend-following']
      },
      {
        id: '2',
        asset: 'WIN',
        entryDate: '2024-01-18',
        entryTime: '14:20:00',
        entryPrice: 112000,
        exitDate: '2024-01-18',
        exitTime: '15:45:00',
        exitPrice: 111200,
        quantity: 1,
        duration: '1h 25m',
        result: -800,
        type: 'loss',
        setup: 'Scalp',
        tags: ['reversal']
      },
      {
        id: '3',
        asset: 'WDO',
        entryDate: '2024-01-17',
        entryTime: '10:00:00',
        entryPrice: 119800,
        exitDate: '2024-01-17',
        exitTime: '11:15:00',
        exitPrice: 120600,
        quantity: 3,
        duration: '1h 15m',
        result: 2400,
        type: 'gain',
        setup: 'Pullback',
        tags: ['trend-following']
      },
      {
        id: '4',
        asset: 'WIN',
        entryDate: '2024-01-17',
        entryTime: '15:30:00',
        entryPrice: 111500,
        exitDate: '2024-01-17',
        exitTime: '16:00:00',
        exitPrice: 111900,
        quantity: 2,
        duration: '30m',
        result: 800,
        type: 'gain',
        setup: 'Scalp',
        tags: ['scalp']
      },
      {
        id: '5',
        asset: 'WDO',
        entryDate: '2024-01-16',
        entryTime: '09:30:00',
        entryPrice: 121000,
        exitDate: '2024-01-16',
        exitTime: '10:45:00',
        exitPrice: 120200,
        quantity: 1,
        duration: '1h 15m',
        result: -800,
        type: 'loss',
        setup: 'Rompimento',
        tags: ['trend-following']
      }
    ]);

    const [filterAsset, setFilterAsset] = useState('all');
    const [filterResult, setFilterResult] = useState('all');

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
      }).format(value);
    };

    const formatPrice = (value: number) => {
      return value.toLocaleString('pt-BR');
    };

    const filteredTrades = trades.filter(trade => {
      if (filterAsset !== 'all' && trade.asset !== filterAsset) return false;
      if (filterResult !== 'all' && trade.type !== filterResult) return false;
      return true;
    });

    const uniqueAssets = [...new Set(trades.map(trade => trade.asset))];

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            <div className="relative text-center">
              <p className="text-sm text-gray-400 mb-1">Eficiência MFE</p>
              <p className="text-2xl font-semibold text-[#28C780]">85.3%</p>
              <p className="text-xs text-gray-400 mt-1">Média do período</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            <div className="relative text-center">
              <p className="text-sm text-gray-400 mb-1">Eficiência MAE</p>
              <p className="text-2xl font-semibold text-[#EA3943]">72.1%</p>
              <p className="text-xs text-gray-400 mt-1">Controle de risco</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            <div className="relative text-center">
              <p className="text-sm text-gray-400 mb-1">R-Múltiplo</p>
              <p className="text-2xl font-semibold text-white">2.34x</p>
              <p className="text-xs text-gray-400 mt-1">Média das operações</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            <div className="relative text-center">
              <p className="text-sm text-gray-400 mb-1">Tempo Médio</p>
              <p className="text-2xl font-semibold text-white">58min</p>
              <p className="text-xs text-gray-400 mt-1">Duração das operações</p>
            </div>
          </div>
        </div>

        {/* Main History Table */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-6">
              <h3 className="text-lg font-semibold text-white">Histórico de Operações</h3>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <select 
                    value={filterAsset}
                    onChange={(e) => setFilterAsset(e.target.value)}
                    className="bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                  >
                    <option value="all">Todos os Ativos</option>
                    {uniqueAssets.map(asset => (
                      <option key={asset} value={asset}>{asset}</option>
                    ))}
                  </select>
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.03] to-transparent rounded-[11px] pointer-events-none"></div>
                </div>

                <div className="relative">
                  <select 
                    value={filterResult}
                    onChange={(e) => setFilterResult(e.target.value)}
                    className="bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[12px] border border-gray-500/25 text-white px-3 py-2 rounded-[12px] focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                  >
                    <option value="all">Todos os Resultados</option>
                    <option value="gain">Apenas Gains</option>
                    <option value="loss">Apenas Losses</option>
                  </select>
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.03] to-transparent rounded-[11px] pointer-events-none"></div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-500/20">
                    <th className="text-left text-sm text-gray-400 pb-3">Ativo</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Entrada</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Preço Entrada</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Saída</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Preço Saída</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Contratos</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Duração</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Setup</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Resultado</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {filteredTrades.map((trade, index) => (
                    <tr key={trade.id} className={`border-b border-gray-500/10 ${trade.type === 'gain' ? 'bg-green-500/5' : 'bg-red-500/5'} hover:bg-gray-500/10 transition-colors duration-200`}>
                      <td className="py-4">
                        <span className="text-white font-medium">{trade.asset}</span>
                      </td>
                      <td className="py-4">
                        <div className="text-white text-sm">
                          <div>{new Date(trade.entryDate).toLocaleDateString('pt-BR')}</div>
                          <div className="text-xs text-gray-400">{trade.entryTime}</div>
                        </div>
                      </td>
                      <td className="py-4 text-white">{formatPrice(trade.entryPrice)}</td>
                      <td className="py-4">
                        <div className="text-white text-sm">
                          <div>{new Date(trade.exitDate).toLocaleDateString('pt-BR')}</div>
                          <div className="text-xs text-gray-400">{trade.exitTime}</div>
                        </div>
                      </td>
                      <td className="py-4 text-white">{formatPrice(trade.exitPrice)}</td>
                      <td className="py-4 text-white">{trade.quantity}</td>
                      <td className="py-4 text-white">{trade.duration}</td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white text-sm">{trade.setup}</span>
                          {trade.tags && trade.tags.map(tag => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[8px] border border-gray-500/30 rounded-[8px] text-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <span className={trade.result >= 0 ? 'text-[#28C780] font-semibold' : 'text-[#EA3943] font-semibold'}>
                            {formatCurrency(trade.result)}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-[8px] ${
                            trade.type === 'gain' 
                              ? 'bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30' 
                              : 'bg-[#EA3943]/20 text-[#EA3943] border border-[#EA3943]/30'
                          }`}>
                            {trade.type === 'gain' ? 'Gain' : 'Loss'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Behavior Analysis Component
  const BehaviorAnalysis = () => {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    return (
      <div className="space-y-6">
        {/* Overtrading Widget */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#EA3943]/20 to-[#EA3943]/10 rounded-[12px] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#EA3943]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.126 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">Detector de Overtrading</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-[#EA3943]/10 to-[#EA3943]/5 border border-[#EA3943]/20 rounded-[16px] p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <p className="text-sm text-gray-300 mb-2">Resultado após 2+ Perdas</p>
                  <p className="text-2xl font-semibold text-[#EA3943]">{formatCurrency(-400)}</p>
                  <p className="text-xs text-gray-400">Resultado médio das próximas operações</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-[16px] p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <p className="text-sm text-gray-300 mb-2">Frequência de Overtrading</p>
                  <p className="text-2xl font-semibold text-yellow-500">25%</p>
                  <p className="text-xs text-gray-400">Das sessões com sequência de perdas</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 px-4 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20">
                <span className="text-gray-300 text-sm">Após 1 loss:</span>
                <span className="text-[#28C780] font-semibold">{formatCurrency(800)}</span>
              </div>
              <div className="flex justify-between items-center py-2 px-4 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[12px] border border-gray-500/20">
                <span className="text-gray-300 text-sm">Após 2 losses:</span>
                <span className="text-[#EA3943] font-semibold">{formatCurrency(-600)}</span>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-br from-[#00D0FF]/10 to-[#00D0FF]/5 border border-[#00D0FF]/20 rounded-[16px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
              <div className="relative text-sm text-gray-300">
                <p className="mb-2"><strong className="text-white">💡 Insight:</strong> Após sequências de perda, seu desempenho tende a ser negativo.</p>
                <p><strong className="text-white">🎯 Sugestão:</strong> Considere uma pausa após 2 losses consecutivos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Euphoria Widget */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#28C780]/20 to-[#28C780]/10 rounded-[12px] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#28C780]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-white">Detector de Euforia</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-[#EA3943]/10 to-[#EA3943]/5 border border-[#EA3943]/20 rounded-[16px] p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <p className="text-sm text-gray-300 mb-2">Devolução Detectada</p>
                  <p className="text-2xl font-semibold text-[#EA3943]">R$ 1.600</p>
                  <p className="text-xs text-gray-400">Lucro devolvido em 2 ocasiões</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-[16px] p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <p className="text-sm text-gray-300 mb-2">Frequência</p>
                  <p className="text-2xl font-semibold text-yellow-500">25%</p>
                  <p className="text-xs text-gray-400">Das sessões com devolução</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gradient-to-br from-[#00D0FF]/10 to-[#00D0FF]/5 border border-[#00D0FF]/20 rounded-[16px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
              <div className="relative text-sm text-gray-300">
                <p><strong className="text-white">💡 Insight:</strong> Você tende a devolver lucro após atingir picos. Considere definir metas de stop gain.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance by Setup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#28C780]/20 to-[#28C780]/10 rounded-[12px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#28C780]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-white">Maiores Ganhos</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#28C780]/10 to-[#28C780]/5 border border-[#28C780]/20 rounded-[12px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30 rounded-[6px]">#1</span>
                      <span className="font-medium text-white">WDO</span>
                      <span className="text-xs text-gray-400">Pullback</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">16/01/2024 • 1h 15m</p>
                  </div>
                  <span className="text-[#28C780] font-semibold">{formatCurrency(2400)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#28C780]/10 to-[#28C780]/5 border border-[#28C780]/20 rounded-[12px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30 rounded-[6px]">#2</span>
                      <span className="font-medium text-white">WDO</span>
                      <span className="text-xs text-gray-400">Swing</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">18/01/2024 • 1h 15m</p>
                  </div>
                  <span className="text-[#28C780] font-semibold">{formatCurrency(1600)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            
            <div className="relative">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#EA3943]/20 to-[#EA3943]/10 rounded-[12px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#EA3943]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-white">Maiores Perdas</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#EA3943]/10 to-[#EA3943]/5 border border-[#EA3943]/20 rounded-[12px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-[#EA3943]/20 text-[#EA3943] border border-[#EA3943]/30 rounded-[6px]">#1</span>
                      <span className="font-medium text-white">WDO</span>
                      <span className="text-xs text-gray-400">Rompimento</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">17/01/2024 • 1h 15m</p>
                  </div>
                  <span className="text-[#EA3943] font-semibold">{formatCurrency(-800)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-br from-[#EA3943]/10 to-[#EA3943]/5 border border-[#EA3943]/20 rounded-[12px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[12px]"></div>
                  <div className="relative">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-[#EA3943]/20 text-[#EA3943] border border-[#EA3943]/30 rounded-[6px]">#2</span>
                      <span className="font-medium text-white">WIN</span>
                      <span className="text-xs text-gray-400">Scalp</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">18/01/2024 • 17m</p>
                  </div>
                  <span className="text-[#EA3943] font-semibold">{formatCurrency(-600)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Asset Analysis Component
  const AssetAnalysis = () => {
    const mockAssetPerformance = [
      {
        asset: 'WDO',
        totalResult: 3200,
        winRate: 75,
        payoff: 2.5,
        totalTrades: 4,
        avgResult: 800,
        gains: 3,
        losses: 1,
        sector: 'Índice'
      },
      {
        asset: 'WIN',
        totalResult: 200,
        winRate: 33.3,
        payoff: 1.2,
        totalTrades: 3,
        avgResult: 66.7,
        gains: 1,
        losses: 2,
        sector: 'Índice'
      },
      {
        asset: 'ABEV3',
        totalResult: 800,
        winRate: 100,
        payoff: 0,
        totalTrades: 1,
        avgResult: 800,
        gains: 1,
        losses: 0,
        sector: 'Consumo'
      }
    ];

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    const formatPercent = (value: number) => {
      return `${value.toFixed(1)}%`;
    };

    // Treemap data for sector visualization
    const sectorData = [
      { name: 'Índice', value: 3400, color: '#00D0FF' },
      { name: 'Consumo', value: 800, color: '#28C780' },
    ];

    return (
      <div className="space-y-6">
        {/* Treemap por Setor */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Distribuição por Setor</h3>
            <div className="grid grid-cols-2 gap-4 h-32">
              <div 
                className="bg-gradient-to-br from-[#00D0FF]/20 to-[#00D0FF]/10 border border-[#00D0FF]/30 rounded-[16px] p-4 flex flex-col justify-between relative overflow-hidden hover:from-[#00D0FF]/30 hover:to-[#00D0FF]/15 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <p className="text-sm text-gray-300">Índice</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(3400)}</p>
                  <p className="text-xs text-gray-400">80.9% do total</p>
                </div>
              </div>
              <div 
                className="bg-gradient-to-br from-[#28C780]/20 to-[#28C780]/10 border border-[#28C780]/30 rounded-[16px] p-4 flex flex-col justify-between relative overflow-hidden hover:from-[#28C780]/30 hover:to-[#28C780]/15 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <div className="relative">
                  <p className="text-sm text-gray-300">Consumo</p>
                  <p className="text-lg font-semibold text-white">{formatCurrency(800)}</p>
                  <p className="text-xs text-gray-400">19.1% do total</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo por Ativo - Tabela */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Resumo por Ativo</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-500/20">
                    <th className="text-left text-sm text-gray-400 pb-3">Ativo</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Resultado Líquido</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Taxa de Acerto</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Payoff</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Operações</th>
                    <th className="text-left text-sm text-gray-400 pb-3">Resultado Médio</th>
                    <th className="text-left text-sm text-gray-400 pb-3">G/L</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAssetPerformance.map((asset, index) => (
                    <tr key={asset.asset} className="border-b border-gray-500/10 hover:bg-gray-500/10 transition-colors duration-200">
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 bg-[#00D0FF]/20 text-[#00D0FF] border border-[#00D0FF]/30 rounded-[6px]">
                            {asset.asset}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <span className={asset.totalResult >= 0 ? 'text-[#28C780] font-semibold' : 'text-[#EA3943] font-semibold'}>
                            {asset.totalResult >= 0 ? '↗' : '↙'}
                          </span>
                          <span className={asset.totalResult >= 0 ? 'text-[#28C780] font-semibold' : 'text-[#EA3943] font-semibold'}>
                            {formatCurrency(asset.totalResult)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{formatPercent(asset.winRate)}</span>
                        </div>
                      </td>
                      <td className="py-4 text-white">
                        {asset.payoff > 0 ? `${asset.payoff.toFixed(2)} : 1` : 'N/A'}
                      </td>
                      <td className="py-4 text-white">{asset.totalTrades}</td>
                      <td className="py-4">
                        <span className={asset.avgResult >= 0 ? 'text-[#28C780]' : 'text-[#EA3943]'}>
                          {formatCurrency(asset.avgResult)}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-1">
                          <span className="text-xs px-2 py-1 bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30 rounded-[6px]">
                            {asset.gains}G
                          </span>
                          <span className="text-xs px-2 py-1 bg-[#EA3943]/20 text-[#EA3943] border border-[#EA3943]/30 rounded-[6px]">
                            {asset.losses}L
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            
            <div className="relative text-center">
              <h4 className="text-sm text-gray-400 mb-3">Ativo Mais Lucrativo</h4>
              <span className="text-xs px-2 py-1 bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30 rounded-[6px] mb-2 inline-block">
                WDO
              </span>
              <p className="text-2xl font-semibold text-[#28C780] mb-1">
                {formatCurrency(3200)}
              </p>
              <p className="text-xs text-gray-400">75% de acerto</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            
            <div className="relative text-center">
              <h4 className="text-sm text-gray-400 mb-3">Maior Volume</h4>
              <span className="text-xs px-2 py-1 bg-[#00D0FF]/20 text-[#00D0FF] border border-[#00D0FF]/30 rounded-[6px] mb-2 inline-block">
                WDO
              </span>
              <p className="text-2xl font-semibold text-white mb-1">
                4 operações
              </p>
              <p className="text-xs text-gray-400">50% do total</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
            <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
            
            <div className="relative text-center">
              <h4 className="text-sm text-gray-400 mb-3">Melhor Consistência</h4>
              <span className="text-xs px-2 py-1 bg-[#28C780]/20 text-[#28C780] border border-[#28C780]/30 rounded-[6px] mb-2 inline-block">
                ABEV3
              </span>
              <p className="text-2xl font-semibold text-[#28C780] mb-1">
                100%
              </p>
              <p className="text-xs text-gray-400">Taxa de acerto</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <h4 className="text-lg font-semibold text-white mb-4">Insights por Ativo</h4>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-[#00D0FF]/10 to-[#00D0FF]/5 border border-[#00D0FF]/20 rounded-[16px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <p className="relative text-sm text-gray-300">
                  💡 <strong className="text-white">WDO</strong> é seu ativo mais lucrativo, representando 50% das operações com uma taxa de acerto de 75%.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-[16px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <p className="relative text-sm text-gray-300">
                  ⚠️ <strong className="text-white">WIN</strong> apresenta baixa performance com apenas 33% de acerto. Considere revisar a estratégia.
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-[#28C780]/10 to-[#28C780]/5 border border-[#28C780]/20 rounded-[16px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] to-transparent rounded-[16px]"></div>
                <p className="relative text-sm text-gray-300">
                  ✅ <strong className="text-white">ABEV3</strong> mostra 100% de acerto, mas com volume baixo. Considere aumentar a exposição.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings Component
  const Settings = () => {
    const [name, setName] = useState(mockUser.name);
    const [email, setEmail] = useState(mockUser.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [monitoredFolder, setMonitoredFolder] = useState('/Users/trader/Documents/Trades');

    const handleSaveProfile = () => {
      console.log('Profile saved:', { name, email });
      alert('Perfil salvo com sucesso!');
    };

    const handleChangePassword = () => {
      if (newPassword !== confirmPassword) {
        alert('Senhas não coincidem');
        return;
      }
      console.log('Password changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Senha alterada com sucesso!');
    };

    const handleSaveSettings = () => {
      console.log('Settings saved:', { isDarkMode, monitoredFolder });
      alert('Configurações salvas com sucesso!');
    };

    return (
      <div className="space-y-6 max-w-2xl">
        {/* Profile Section */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Perfil do Usuário</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm text-gray-300">Nome</label>
                  <div className="relative">
                    <input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                    />
                    <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-300">Email</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                    />
                    <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleSaveProfile}
                className="px-6 py-3 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#007799] text-white rounded-[16px] transition-all duration-300 shadow-md shadow-[#00D0FF]/20 hover:shadow-lg hover:shadow-[#00D0FF]/30 hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                <span className="relative">Salvar Perfil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Alterar Senha</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="text-sm text-gray-300">Senha Atual</label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                  />
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm text-gray-300">Nova Senha</label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                    />
                    <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm text-gray-300">Confirmar Nova Senha</label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                    />
                    <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleChangePassword}
                className="px-6 py-3 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#007799] text-white rounded-[16px] transition-all duration-300 shadow-md shadow-[#00D0FF]/20 hover:shadow-lg hover:shadow-[#00D0FF]/30 hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                <span className="relative">Alterar Senha</span>
              </button>
            </div>
          </div>
        </div>

        {/* Application Settings */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Configurações da Aplicação</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-[#2A2A2A]/50 to-[#242424]/60 backdrop-blur-[12px] rounded-[16px] border border-gray-500/20">
                <div className="space-y-1">
                  <label className="text-white">Tema Escuro</label>
                  <p className="text-sm text-gray-400">
                    Usar tema escuro para melhor visualização
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D0FF]"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label htmlFor="monitoredFolder" className="text-sm text-gray-300">Pasta Monitorada</label>
                <p className="text-sm text-gray-400">
                  Pasta onde o agente local monitora os arquivos de trade
                </p>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      id="monitoredFolder"
                      value={monitoredFolder}
                      onChange={(e) => setMonitoredFolder(e.target.value)}
                      className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                    />
                    <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                  </div>
                  <button className="px-4 py-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white hover:border-[#00D0FF]/40 transition-all duration-300">
                    Procurar
                  </button>
                </div>
              </div>

              <button 
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#007799] text-white rounded-[16px] transition-all duration-300 shadow-md shadow-[#00D0FF]/20 hover:shadow-lg hover:shadow-[#00D0FF]/30 hover:scale-[1.02] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                <span className="relative">Salvar Configurações</span>
              </button>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
          <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
          
          <div className="relative">
            <h3 className="text-lg font-semibold text-white mb-4">Sair da Aplicação</h3>
            <p className="text-gray-400 mb-4">
              Ao sair, você será desconectado e precisará fazer login novamente.
            </p>
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-[#EA3943] to-[#d63384] hover:from-[#d63384] hover:to-[#c21807] text-white rounded-[16px] transition-all duration-300 shadow-md shadow-[#EA3943]/20 hover:shadow-lg hover:shadow-[#EA3943]/30 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
              <span className="relative">Sair</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'trades':
        return <TradesHistory />;
      case 'behavior':
        return <BehaviorAnalysis />;
      case 'assets':
        return <AssetAnalysis />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#242424] to-[#1A1A1A] text-white">
      <Header />
      <main className="p-6">
        {renderCurrentView()}
      </main>
    </div>
  );
}