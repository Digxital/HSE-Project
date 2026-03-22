import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import engineerImage from '@/assets/images/engineer-cooperation-img.png';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: 'admin' | 'supervisor') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        navigate('/admin/login');
      } else {
        navigate('/supervisor/login');
      }
    }, 2000);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-background-light">
      {/* Navbar */}
      <nav className="bg-background-navbar shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Logo size="md" />
            <span className="text-xl font-bold text-gray-900">Aegix</span>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered Container */}
      <div className="flex items-center justify-center px-4 py-8 md:py-12">
        <div
          className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <div className="flex flex-col md:flex-row md:min-h-[440px]">
            {/* Left Side - Image */}
            <div
              className="md:w-1/2 h-64 md:h-auto relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
              data-aos="fade-right"
              data-aos-delay="300"
            >
              <img
                src={engineerImage}
                alt="Engineers collaborating"
                className="w-full h-full object-cover object-left"
              />
            </div>

            {/* Right Side - Role Selection */}
            <div
              className="md:w-1/2 p-8 md:p-12 flex items-center rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none"
              data-aos="fade-left"
              data-aos-delay="300"
            >
              <div className="w-full">
                {/* Title */}
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Select Your Role
                  </h1>
                  <p className="text-gray-600">
                    Choose how you want to access the system
                  </p>
                </div>

                {/* Role Buttons */}
                <div className="space-y-4">
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98]"
                  >
                    Login as Admin
                  </button>

                  <button
                    onClick={() => handleRoleSelect('supervisor')}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3.5 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-[0.98]"
                  >
                    Login as Supervisor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
