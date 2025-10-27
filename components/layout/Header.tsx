import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { User } from '../../types';
import { Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  user: User;
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}

export function Header({ user, currentView, onViewChange, onLogout }: HeaderProps) {
  const isConnected = true; // Mock connection status

  return (
    <header className="bg-card border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#007AFF] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PT</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Performance Tracker</h1>
          </div>
          
          <nav className="flex space-x-1">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onViewChange('dashboard')}
              className={currentView === 'dashboard' ? 'bg-[#007AFF] text-white' : 'text-foreground hover:bg-muted'}
            >
              Dashboard
            </Button>
            <Button
              variant={currentView === 'trades' ? 'default' : 'ghost'}
              onClick={() => onViewChange('trades')}
              className={currentView === 'trades' ? 'bg-[#007AFF] text-white' : 'text-foreground hover:bg-muted'}
            >
              Histórico
            </Button>
            <Button
              variant={currentView === 'behavior' ? 'default' : 'ghost'}
              onClick={() => onViewChange('behavior')}
              className={currentView === 'behavior' ? 'bg-[#007AFF] text-white' : 'text-foreground hover:bg-muted'}
            >
              Comportamento
            </Button>
            <Button
              variant={currentView === 'assets' ? 'default' : 'ghost'}
              onClick={() => onViewChange('assets')}
              className={currentView === 'assets' ? 'bg-[#007AFF] text-white' : 'text-foreground hover:bg-muted'}
            >
              Ativos
            </Button>
            <Button
              variant={currentView === 'settings' ? 'default' : 'ghost'}
              onClick={() => onViewChange('settings')}
              className={currentView === 'settings' ? 'bg-[#007AFF] text-white' : 'text-foreground hover:bg-muted'}
            >
              Configurações
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Select defaultValue="month">
            <SelectTrigger className="w-40 bg-input-background border-gray-600 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-gray-600">
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="yesterday">Ontem</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>

          <Badge variant={isConnected ? 'default' : 'destructive'} className="flex items-center space-x-1">
            {isConnected ? (
              <>
                <Wifi className="w-3 h-3" />
                <span>Conectado</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3" />
                <span>Desconectado</span>
              </>
            )}
          </Badge>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-[#007AFF] text-white">
                {user.avatar || user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" onClick={onLogout} className="text-foreground hover:bg-muted">
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}