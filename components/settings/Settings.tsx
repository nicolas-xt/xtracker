import React, { useState, useEffect } from 'react';
import { User } from '../../types'; // Assuming User type is defined here
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from '@tauri-apps/api/fs';
import { useSettings } from '../../src/context/SettingsContext';

interface SettingsProps {
  onRefresh: () => void;
  // Add user prop to receive current user data
  user: User;
  // Add a function to update user data (e.g., name, email, avatar)
  onUpdateUser: (updatedUser: Partial<User>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onRefresh, user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true); // Assuming dark mode is default
  const [monitoredFolder, setMonitoredFolder] = useState('/Users/trader/Documents/Trades'); // Mock value
  const [csvPathBR, setCsvPathBR] = useState('/data/trades.csv');
  const [csvPathUS, setCsvPathUS] = useState('/data/us_trades.csv');
  const { settings: contextSettings, updateSettings } = useSettings();

  // Selecionar arquivo CSV BR
  const handleSelectCsvBR = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    });
    if (selected) {
      const path = selected as string;
      setCsvPathBR(path);
      try {
        updateSettings({ csvPathBR: path });
      } catch (e) {
        console.error('Failed to update settings context', e);
      }
    }
  };

  // Selecionar arquivo CSV US
  const handleSelectCsvUS = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    });
    if (selected) {
      const path = selected as string;
      setCsvPathUS(path);
      try {
        updateSettings({ csvPathUS: path });
      } catch (e) {
        console.error('Failed to update settings context', e);
      }
    }
  };
  const [initialCapital, setInitialCapital] = useState(100000);
  const [monthlyGoal, setMonthlyGoal] = useState(10000);
  const [dailyLossLimit, setDailyLossLimit] = useState(1000);
  // Removed complex goals: only monthlyGoal and dailyLossLimit should be edited in this section

  useEffect(() => {
    const savedAppSettings = localStorage.getItem('appSettings');
    if (savedAppSettings) {
        const settings = JSON.parse(savedAppSettings);
        setInitialCapital(settings.initialCapital || 100000);
        setMonthlyGoal(settings.monthlyGoal || 10000);
        setDailyLossLimit(settings.dailyLossLimit || 1000);
      // legacy keys ignored here; keep minimal settings
        setIsDarkMode(settings.isDarkMode !== undefined ? settings.isDarkMode : true);
        setMonitoredFolder(settings.monitoredFolder || '/Users/trader/Documents/Trades');
      if (settings.csvPathBR) setCsvPathBR(settings.csvPathBR);
      if (settings.csvPathUS) setCsvPathUS(settings.csvPathUS);
    }

    const savedUserSettings = localStorage.getItem('userSettings');
    if (savedUserSettings) {
      const userSettings = JSON.parse(savedUserSettings);
      if (userSettings.name && userSettings.name !== user.name) {
        setName(userSettings.name);
      }
      if (userSettings.email && userSettings.email !== user.email) {
        setEmail(userSettings.email);
      }
      if (userSettings.avatar && userSettings.avatar !== user.avatar) {
        // Only update avatar if it's different and not already set by parent
        onUpdateUser({ avatar: userSettings.avatar });
      }
    }
  }, [user.name, user.email, user.avatar, onUpdateUser]);

  const handleSaveGoals = () => {
    try {
      updateSettings({ monthlyGoal, dailyLossLimit });
    } catch (e) {
      console.error('Failed to update settings', e);
    }
    alert('Metas e limites salvos com sucesso!');
  };

  const handleSaveProfile = () => {
    onUpdateUser({ name, email });
    const userSettings = { name, email, avatar: user.avatar };
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    console.log('Profile saved:', { name, email });
    alert('Perfil salvo com sucesso!');
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Senhas não coincidem');
      return;
    }
    console.log('Password changed');
    // Implement actual password change logic here
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Senha alterada com sucesso!');
  };

  const handleSaveSettings = () => {
    try {
      updateSettings({ initialCapital, monthlyGoal, dailyLossLimit, isDarkMode, monitoredFolder, csvPathBR, csvPathUS });
    } catch (e) {
      console.error('Failed to update settings', e);
    }
    console.log('Application settings saved:', { isDarkMode, monitoredFolder, csvPathBR, csvPathUS });
    alert('Configurações salvas com sucesso!');
  };

function toBase64(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// ...

  const handleAvatarUpload = async () => {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Image',
        extensions: ['png', 'jpeg', 'jpg']
      }]
    });
    if (selected) {
      const contents = await readBinaryFile(selected as string);
      const base64 = toBase64(contents);
      const avatar = `data:image/png;base64,${base64}`;
      onUpdateUser({ avatar });
      const userSettings = { name: user.name, email: user.email, avatar };
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
    }
  };

  const handleSelectFolder = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
    });
    if (selected) {
      setMonitoredFolder(selected as string);
      try {
        updateSettings({ monitoredFolder: selected as string });
      } catch (e) {
        console.error('Failed to update settings', e);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6"> {/* Added mx-auto and p-6 for centering and padding */}
      {/* CSV Paths Section */}
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>
        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-4">Arquivos de Operações (CSV)</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="csvPathBR" className="text-sm text-gray-300">Caminho do CSV Brasil</label>
              <div className="flex gap-2">
                <input
                  id="csvPathBR"
                  value={csvPathBR}
                  onChange={e => setCsvPathBR(e.target.value)}
                  className="flex-1 p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                  placeholder="/data/trades.csv"
                />
                <button type="button" onClick={handleSelectCsvBR} className="px-3 py-2 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] text-white rounded-[12px] hover:from-[#0099CC] hover:to-[#007799] transition-all">Selecionar</button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="csvPathUS" className="text-sm text-gray-300">Caminho do CSV EUA</label>
              <div className="flex gap-2">
                <input
                  id="csvPathUS"
                  value={csvPathUS}
                  onChange={e => setCsvPathUS(e.target.value)}
                  className="flex-1 p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                  placeholder="/data/us_trades.csv"
                />
                <button type="button" onClick={handleSelectCsvUS} className="px-3 py-2 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] text-white rounded-[12px] hover:from-[#0099CC] hover:to-[#007799] transition-all">Selecionar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-4">Perfil do Usuário</h3>
          <div className="space-y-4">
            {/* Avatar Upload Placeholder */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#00D0FF] to-[#0099CC] rounded-full flex items-center justify-center shadow-md shadow-[#00D0FF]/20 border border-[#00D0FF]/25 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                                {user.avatar && user.avatar.startsWith('data:image') ? (
                  <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
                ) : (
                  <span className="relative text-white text-xl font-medium">{user.avatar || user.name.charAt(0)}</span>
                )}
              </div>
              <button onClick={handleAvatarUpload} className="px-4 py-2 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#007799] text-white rounded-[16px] transition-all duration-300 shadow-md shadow-[#00D0FF]/20 hover:shadow-lg hover:shadow-[#00D0FF]/30 hover:scale-[1.02] relative overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
                <span className="relative">Alterar Avatar</span>
              </button>
            </div>

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
                <button onClick={handleSelectFolder} className="px-4 py-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white hover:border-[#00D0FF]/40 transition-all duration-300">
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

      {/* Goals and Limits Section */}
      <div className="bg-gradient-to-br from-[#242424]/60 via-[#2A2A2A]/40 to-[#242424]/60 backdrop-blur-[20px] border border-gray-500/20 rounded-[20px] p-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-black/[0.06] rounded-[20px]"></div>
        <div className="absolute inset-[1px] bg-gradient-to-br from-transparent via-white/[0.02] to-transparent rounded-[19px]"></div>

        <div className="relative">
          <h3 className="text-lg font-semibold text-white mb-4">Metas e Limites</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="monthlyGoal" className="text-sm text-gray-300">Meta Mensal (R$)</label>
                <div className="relative">
                  <input
                    id="monthlyGoal"
                    type="number"
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(parseFloat(e.target.value))}
                    className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                  />
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="dailyLossLimit" className="text-sm text-gray-300">Limite de Perda (R$)</label>
                <div className="relative">
                  <input
                    id="dailyLossLimit"
                    type="number"
                    value={dailyLossLimit}
                    onChange={(e) => setDailyLossLimit(parseFloat(e.target.value))}
                    className="w-full p-3 bg-gradient-to-br from-[#2A2A2A]/60 to-[#242424]/80 backdrop-blur-[16px] border border-gray-500/30 rounded-[16px] text-white placeholder-gray-400 focus:border-[#00D0FF]/40 focus:ring-2 focus:ring-[#00D0FF]/15 transition-all duration-300"
                  />
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/[0.04] to-transparent rounded-[15px] pointer-events-none"></div>
                </div>
              </div>
            </div>
            <button
              onClick={handleSaveGoals}
              className="px-6 py-3 bg-gradient-to-r from-[#00D0FF] to-[#0099CC] hover:from-[#0099CC] hover:to-[#007799] text-white rounded-[16px] transition-all duration-300 shadow-md shadow-[#00D0FF]/20 hover:shadow-lg hover:shadow-[#00D0FF]/30 hover:scale-[1.02] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.1] to-transparent"></div>
              <span className="relative">Salvar Metas e Limites</span>
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
            onClick={onRefresh} // Using onRefresh for logout in this context
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