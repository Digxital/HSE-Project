import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield, User, LogOut, LayoutDashboard, AlertTriangle, FileText, CheckSquare } from 'lucide-react';
import { client } from '@/lib/api';

interface UserData {
  email: string;
  id: string;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await client.auth.me();
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await client.auth.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hazard-report', label: 'Report Hazard', icon: AlertTriangle },
    { path: '/incident-report', label: 'Report Incident', icon: FileText },
    { path: '/actions', label: 'Actions', icon: CheckSquare },
  ];

  return (
    <header className="bg-slate-800/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 group-hover:scale-110">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">HSE Platform</h1>
              <p className="text-xs text-slate-400">Safety Management</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-2">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden md:inline">{user?.email || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 shadow-xl">
              <DropdownMenuLabel className="text-white">
                <div className="text-sm">{user?.email}</div>
                <div className="text-xs text-slate-400 font-normal">Safety Officer</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}