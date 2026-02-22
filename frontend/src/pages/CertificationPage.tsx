import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';

interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  status: 'Active' | 'Valid' | 'Expired';
}

export const CertificationPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock certification data
  const certifications: Certification[] = [
    {
      id: '1',
      name: 'Certified HSE Officer',
      issuedBy: 'IOSH',
      issuedDate: 'Jan 2023',
      expiryDate: 'Jan 2028',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Fire Safety Training',
      issuedBy: 'Safety Board',
      issuedDate: 'Jan 2023',
      expiryDate: 'Jan 2028',
      status: 'Valid',
    },
    {
      id: '3',
      name: 'Fire Safety Training',
      issuedBy: 'Safety Board',
      issuedDate: 'Jan 2023',
      expiryDate: 'Jan 2023',
      status: 'Expired',
    },
  ];

  const getStatusStyles = (status: Certification['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Valid':
        return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'Expired':
        return 'bg-red-50 text-red-600 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getIconStyles = (status: Certification['status']) => {
    if (status === 'Expired') {
      return {
        bgColor: 'bg-red-100',
        iconColor: 'text-red-500',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      };
    }
    return {
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    };
  };

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Certification"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
          userName="Peter Omogbolahan"
          userRole="System Administrator"
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Certification Container */}
            <div className="bg-[#FFFAF5] rounded-xl p-6 md:p-8 border border-gray-100">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-black-900">Certification</h2>
                <p className="text-sm text-black-500 mt-1 font-bold">Professional and Safety Certification</p>
              </div>

              {/* Certification List */}
              <div className="space-y-4">
                {certifications.map((cert) => {
                  const iconStyles = getIconStyles(cert.status);
                  return (
                    <div
                      key={cert.id}
                      className="bg-white rounded-xl p-4 md:p-6 border border-gray-100 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      {/* Left: Icon + Info */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-full ${iconStyles.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <span className={iconStyles.iconColor}>{iconStyles.icon}</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900">{cert.name}</h3>
                          <p className="text-sm text-gray-500">Issued by: {cert.issuedBy}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                            <p className="text-sm text-gray-500">Issued Date: {cert.issuedDate}</p>
                            <p className="text-sm text-[#C24438]">Expiry Date: {cert.expiryDate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Badge */}
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-lg border ${getStatusStyles(cert.status)}`}>
                          Status: {cert.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
