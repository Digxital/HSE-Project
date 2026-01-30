import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import { client, formatDate, getStatusColor, getPriorityColor, isOverdue } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ActionItem {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  owner_name: string;
  verification_status?: string;
  verification_notes?: string;
}

export default function ActionTracking() {
  const { toast } = useToast();
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await client.entities.actions.query({
        query: {},
        sort: '-created_at',
        limit: 100,
      });
      setActions(response.data.items || []);
    } catch (error) {
      const err = error as { data?: { detail?: string }; response?: { data?: { detail?: string } }; message?: string };
      const detail = err?.data?.detail || err?.response?.data?.detail || err.message;
      toast({
        title: 'Error',
        description: detail || 'Failed to load actions',
        variant: 'destructive',
      });
    }
  };

  const filterActions = (status: string) => {
    if (status === 'all') return actions;
    if (status === 'overdue') {
      return actions.filter((a) => isOverdue(a.due_date, a.status));
    }
    if (status === 'open') {
      return actions.filter((a) => a.status === 'Open' || a.status === 'In Progress');
    }
    return actions.filter((a) => a.status === status);
  };

  const filteredActions = filterActions(activeTab);
  const overdueCount = actions.filter((a) => isOverdue(a.due_date, a.status)).length;
  const openCount = actions.filter((a) => a.status === 'Open' || a.status === 'In Progress').length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckSquare className="w-6 h-6 text-blue-500" />
              Action Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                <TabsTrigger value="all" className="data-[state=active]:bg-slate-600">
                  All ({actions.length})
                </TabsTrigger>
                <TabsTrigger value="open" className="data-[state=active]:bg-slate-600">
                  Open ({openCount})
                </TabsTrigger>
                <TabsTrigger value="Completed" className="data-[state=active]:bg-slate-600">
                  Completed
                </TabsTrigger>
                <TabsTrigger value="overdue" className="data-[state=active]:bg-slate-600">
                  Overdue ({overdueCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4 space-y-3">
                {filteredActions.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No actions found</div>
                ) : (
                  filteredActions.map((action) => {
                    const overdue = isOverdue(action.due_date, action.status);
                    return (
                      <div key={action.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-base font-semibold text-white">{action.title}</h3>
                              {overdue && (
                                <Badge className="bg-red-500 text-white">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Overdue
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-400 mb-2">{action.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Due: {formatDate(action.due_date)}
                              </span>
                              <span>Owner: {action.owner_name}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Badge className={`${getPriorityColor(action.priority)} text-white`}>{action.priority}</Badge>
                            <Badge className={`${getStatusColor(action.status)} text-white`}>{action.status}</Badge>
                          </div>
                        </div>

                        {action.verification_status && action.verification_status !== 'Pending' && (
                          <div className="mt-3 pt-3 border-t border-slate-600">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">Verification:</span>
                              <Badge
                                variant="outline"
                                className={
                                  action.verification_status === 'Approved'
                                    ? 'border-green-500 text-green-400'
                                    : 'border-red-500 text-red-400'
                                }
                              >
                                {action.verification_status}
                              </Badge>
                            </div>
                            {action.verification_notes && (
                              <p className="text-xs text-slate-500 mt-1">{action.verification_notes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}