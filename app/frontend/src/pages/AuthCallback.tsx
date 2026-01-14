import { useEffect } from 'react';
import { client } from '@/lib/api';

export default function AuthCallback() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        await client.auth.login().then(() => {
          window.location.href = '/';
        });
      } catch (error) {
        console.error('Auth callback error:', error);
        window.location.href = '/login';
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Authenticating...</p>
      </div>
    </div>
  );
}