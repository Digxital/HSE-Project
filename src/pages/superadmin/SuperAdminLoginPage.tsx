import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';

export const SuperAdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // TODO: Replace with actual API call
    // For now, just navigate to dashboard
    localStorage.setItem('superadmin_token', 'dummy-token');
    navigate('/superadmin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#200500] to-[#1a0400] flex items-center justify-center px-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-white text-2xl font-bold">Aegix</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Super Admin</h2>
          <p className="text-gray-600 mb-6">Login to manage your organization</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aegix.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-[#C2410C] hover:bg-[#a83409] text-white rounded-lg font-semibold transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Only super admins can access this area</p>
          </div>
        </div>
      </div>
    </div>
  );
};
