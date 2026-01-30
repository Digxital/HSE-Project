import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

export default function KPICard({ title, value, icon: Icon, trend, color }: KPICardProps) {
  return (
    <Card className="bg-slate-800/90 border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-400 mb-2 font-medium">{title}</p>
            <p className="text-4xl font-bold text-white mb-1 tracking-tight">{value}</p>
            {trend && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {trend}
              </p>
            )}
          </div>
          <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}