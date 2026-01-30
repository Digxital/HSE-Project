import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { client } from '@/lib/api';
import { Shield, Lock } from 'lucide-react';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await client.auth.toLogin();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border-slate-700/50 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/50 animate-in zoom-in duration-500">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-white">HSE Management</CardTitle>
            <CardDescription className="text-slate-400 text-base">
              Health, Safety & Environment Platform
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-700/50 border border-slate-600/50">
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Lock className="w-4 h-4 text-red-400" />
              <span>Secure authentication required</span>
            </div>
          </div>
          
          <Button 
            onClick={handleLogin} 
            disabled={isLoading} 
            className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Authenticating...</span>
              </div>
            ) : (
              'Login to Continue'
            )}
          </Button>
          
          <p className="text-xs text-center text-slate-500">
            Authorized personnel only • Protected by Atoms Backend
          </p>
        </CardContent>
      </Card>
    </div>
  );
}