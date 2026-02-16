import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/authService';
import { setAuthToken, setRefreshToken, setUserData } from '@/utils/authStorage';
import engineerImage from '@/assets/images/engineer-cooperation-img.png';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface LoginError {
  message: string;
  errors?: Record<string, string[]>;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear API error when user modifies form
    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSuccess = (response: LoginResponse) => {
    // Store tokens based on "Remember Me" preference
    setAuthToken(response.accessToken, rememberMe);
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken, rememberMe);
    }
    
    // Store user data (non-sensitive information)
    setUserData(response.user, rememberMe);

    // Show success message
    showToast({
      type: 'success',
      message: 'Login successful! Redirecting to dashboard...',
    });

    // Navigate to dashboard
    navigate('/dashboard', { replace: true });
  };

  const handleLoginError = (error: LoginError) => {
    // Handle field-specific validation errors from API
    if (error.errors) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(error.errors).forEach(([field, messages]) => {
        fieldErrors[field] = messages[0]; // Take first error message
      });
      setErrors(fieldErrors);
    }

    // Set general API error message
    setApiError(error.message || 'Authentication failed. Please check your credentials.');

    // Show toast for better UX
    showToast({
      type: 'error',
      message: error.message || 'Login failed. Please try again.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous API error
    setApiError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.adminLogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      handleLoginSuccess(response);
    } catch (error: any) {
      handleLoginError(error.response?.data || {
        message: 'Unable to connect to the server. Please check your internet connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password', { 
      state: { email: formData.email } // Pre-fill email if provided
    });
  };

  if (isLoading) {
    return <LoadingScreen message="Authenticating..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Logo size="md" />
            <span className="text-xl font-semibold text-gray-900">Aegix</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Image with Overlay */}
            <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-primary-900">
              <img
                src={engineerImage}
                alt="Engineering team collaborating"
                className="w-full h-full object-cover object-left opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
                <p className="text-white/90 text-sm">
                  Secure access to Aegix administration panel
                </p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="md:w-1/2 p-8 md:p-10">
              <div className="w-full">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Admin Login
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Please sign in to access the administrative dashboard
                  </p>
                </div>

                {/* API Error Message */}
                {apiError && (
                  <div className="mb-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                    <p className="text-sm text-error-700">{apiError}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Input */}
                  <div>
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      error={errors.email}
                      placeholder="admin@example.com"
                      disabled={isLoading}
                      autoComplete="email"
                      required
                    />
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        disabled={isLoading}
                        autoComplete="current-password"
                        required
                        className={`
                          w-full rounded-lg border px-4 py-2.5 
                          text-gray-900 placeholder-gray-400
                          transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                          ${errors.password 
                            ? 'border-error-300 bg-error-50' 
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-error-600">{errors.password}</p>
                    )}
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                        className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded 
                                 focus:ring-primary-500 focus:ring-offset-0
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 group-hover:border-primary-400 transition-colors"
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        Remember me for 30 days
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-11 text-base font-medium"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : (
                      <span className="flex items-center justify-center">
                        Sign In
                        <svg 
                          className="w-5 h-5 ml-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </span>
                    )}
                  </Button>

                  {/* Security Note */}
                  <p className="text-xs text-center text-gray-500 mt-6">
                    <span className="block">
                      This is a secure area. Unauthorized access is prohibited.
                    </span>
                    <span className="block mt-1">
                      All activities are monitored and logged.
                    </span>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};