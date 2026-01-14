import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, FileText, CheckSquare } from 'lucide-react';

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hazard-report', label: 'Hazard', icon: AlertTriangle },
    { path: '/incident-report', label: 'Incident', icon: FileText },
    { path: '/actions', label: 'Actions', icon: CheckSquare },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-md border-t border-slate-700/50 z-50 shadow-2xl">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 scale-105' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50 active:scale-95'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-in zoom-in duration-300' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}