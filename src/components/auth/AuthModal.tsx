import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (mode !== 'forgot-password') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (mode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Form submitted:', { mode, formData });
      // Handle success
      onClose();
    }, 2000);
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
    setErrors({});
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        {/* Logo */}
        <Logo size="lg" className="mb-4" />
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'login' && 'Welcome Back'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'forgot-password' && 'Reset Password'}
        </h2>
        
        <p className="text-gray-600 mb-6 text-center">
          {mode === 'login' && 'Sign in to continue to your account'}
          {mode === 'signup' && 'Sign up to get started'}
          {mode === 'forgot-password' && "We'll send you a reset link"}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {mode === 'signup' && (
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="John Doe"
              disabled={isLoading}
            />
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="you@example.com"
            disabled={isLoading}
          />

          {mode !== 'forgot-password' && (
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="••••••••"
              disabled={isLoading}
            />
          )}

          {mode === 'signup' && (
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              disabled={isLoading}
            />
          )}

          {mode === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => switchMode('forgot-password')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            {mode === 'login' && 'Sign In'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot-password' && 'Send Reset Link'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          {mode === 'login' && (
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => switchMode('signup')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up
              </button>
            </p>
          )}
          
          {(mode === 'signup' || mode === 'forgot-password') && (
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};