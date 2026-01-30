import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import KPICard from '@/components/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText, CheckSquare, Clock, TrendingUp, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { client, formatDate, getStatusColor, getSeverityColor } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface EntityItem {
  id: number;
  status: string;
  created_at: string;
  due_date?: string;
  location_id?: number;
  category?: string;
  severity?: string;
  description?: string;
  incident_type?: string;
}

interface LocationItem {
  id: number;
  name: string;
  type: string;
  address: string;
}

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [hazards, setHazards] = useState<EntityItem[]>([]);
  const [incidents, setIncidents] = useState<EntityItem[]>([]);
  const [actions, setActions] = useState<EntityItem[]>([]);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await client.auth.me();
      setUser(response.data);
      fetchDashboardData();
    } catch (error) {
      navigate('/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch hazards
      const hazardsRes = await client.entities.hazards.query({
        query: {},
        sort: '-created_at',
        limit: 100,
      });
      setHazards(hazardsRes.data.items || []);

      // Fetch incidents
      const incidentsRes = await client.entities.incidents.query({
        query: {},
        sort: '-created_at',
        limit: 100,
      });
      setIncidents(incidentsRes.data.items || []);

      // Fetch actions
      const actionsRes = await client.entities.actions.query({
        query: {},
        sort: '-created_at',
        limit: 100,
      });
      setActions(actionsRes.data.items || []);

      // Fetch locations
      const locationsRes = await client.entities.locations.query({
        query: {},
        limit: 50,
      });
      setLocations(locationsRes.data.items || []);

      // Generate AI summary
      generateAISummary(hazardsRes.data.items || [], incidentsRes.data.items || [], actionsRes.data.items || []);
    } catch (error) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err.message;
      toast({
        title: 'Error',
        description: detail || 'Failed to load dashboard data',
        variant: 'destructive',
      });
    }
  };

  const generateAISummary = async (hazardsData: EntityItem[], incidentsData: EntityItem[], actionsData: EntityItem[]) => {
    setIsLoadingSummary(true);
    try {
      const openActions = actionsData.filter((a) => a.status === 'Open' || a.status === 'In Progress').length;
      const overdueActions = actionsData.filter((a) => {
        if (a.status === 'Completed' || a.status === 'Verified') return false;
        return a.due_date && new Date(a.due_date) < new Date();
      }).length;

      const recentTrends = `Recent hazards include ${hazardsData.slice(0, 3).map((h) => h.category).join(', ')}. Recent incidents include ${incidentsData.slice(0, 2).map((i) => i.incident_type).join(', ')}.`;

      const response = await client.apiCall.invoke({
        url: '/api/v1/ai/generate-summary',
        method: 'POST',
        data: {
          hazards_count: hazardsData.length,
          incidents_count: incidentsData.length,
          open_actions: openActions,
          overdue_actions: overdueActions,
          recent_trends: recentTrends,
        },
      });

      setAiSummary(response.data.summary);
    } catch (error) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err.message;
      console.error('AI summary error:', detail);
      setAiSummary('AI insights temporarily unavailable. Dashboard metrics are displayed below.');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const openActions = actions.filter((a) => a.status === 'Open' || a.status === 'In Progress').length;
  const overdueActions = actions.filter((a) => {
    if (a.status === 'Completed' || a.status === 'Verified') return false;
    return a.due_date && new Date(a.due_date) < new Date();
  }).length;

  // Location hotspot analysis
  const locationHotspots = locations.map((loc) => {
    const locHazards = hazards.filter((h) => h.location_id === loc.id).length;
    const locIncidents = incidents.filter((i) => i.location_id === loc.id).length;
    return {
      ...loc,
      total: locHazards + locIncidents,
    };
  }).sort((a, b) => b.total - a.total).slice(0, 5);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Section with Enhanced Design */}
        <div className="relative h-64 rounded-2xl overflow-hidden shadow-2xl">
          <div 
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-700 hover:scale-110"
            style={{
              backgroundImage: `url(https://mgx-backend-cdn.metadl.com/generate/images/902480/2026-01-13/2358617b-1079-4a76-ae51-a3582933a39d.png)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-red-900/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-500/20 via-transparent to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-8">
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-medium text-red-300">Live Monitoring</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                HSE Dashboard
              </h1>
              <p className="text-lg text-slate-200 max-w-2xl">
                Real-time safety monitoring and AI-powered insights for industrial operations
              </p>
            </div>
          </div>
        </div>

        {/* KPI Cards with Enhanced Styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Hazards" value={hazards.length} icon={AlertTriangle} color="bg-gradient-to-br from-orange-500 to-orange-600" />
          <KPICard title="Total Incidents" value={incidents.length} icon={FileText} color="bg-gradient-to-br from-red-500 to-red-600" />
          <KPICard title="Open Actions" value={openActions} icon={CheckSquare} color="bg-gradient-to-br from-blue-500 to-blue-600" />
          <KPICard title="Overdue Actions" value={overdueActions} icon={Clock} color="bg-gradient-to-br from-yellow-500 to-yellow-600" />
        </div>

        {/* AI Insights Panel with Glassmorphism */}
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Sparkles className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-lg font-bold">AI Safety Insights</div>
                <div className="text-xs text-slate-400 font-normal">Powered by Gemini 2.5 Pro</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSummary ? (
              <div className="flex items-center gap-3 text-slate-400 py-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-purple-400/20"></div>
                </div>
                <span className="text-sm">Analyzing safety data...</span>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-700/30 border border-slate-600/50">
                <p className="text-slate-200 leading-relaxed">{aiSummary}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Hazards & Location Hotspots with Enhanced Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Hazards */}
          <Card className="bg-slate-800/90 border-slate-700/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/20 border border-orange-500/30">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-lg font-bold">Recent Hazards</span>
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/hazard-report')} 
                  className="text-slate-400 hover:text-white hover:bg-slate-700 group"
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {hazards.slice(0, 5).map((hazard, index) => (
                <div 
                  key={hazard.id} 
                  className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white mb-1">{hazard.category}</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{hazard.description?.substring(0, 100)}...</p>
                    </div>
                    <Badge className={`${getSeverityColor(hazard.severity || 'Medium')} text-white ml-3 shadow-lg`}>
                      {hazard.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{formatDate(hazard.created_at)}</span>
                    <Badge className={`${getStatusColor(hazard.status)} text-white shadow-md`}>
                      {hazard.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Location Hotspots */}
          <Card className="bg-slate-800/90 border-slate-700/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-lg font-bold">Location Hotspots</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {locationHotspots.map((location, index) => (
                <div 
                  key={location.id} 
                  className="p-4 bg-slate-700/50 rounded-xl border border-slate-600/50 hover:bg-slate-700/70 hover:border-slate-500/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-right duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white mb-1">{location.name}</p>
                      <p className="text-xs text-slate-400">{location.type} • {location.address}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <div className="p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                        <TrendingUp className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-2xl font-bold text-white">{location.total}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}