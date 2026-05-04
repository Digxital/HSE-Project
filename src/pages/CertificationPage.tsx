import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import type { Certification } from '@/services/certificationService';
import { certificationService } from '@/services/certificationService';

interface CertificationPageProps {
  role?: 'admin' | 'supervisor';
}

export const CertificationPage: React.FC<CertificationPageProps> = ({ role = 'admin' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch certifications on mount
  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('📋 Loading certifications from API...');

        // Fetch from the API endpoint
        const certs = await certificationService.getAllCertifications();
        
        console.log(`✅ Loaded ${certs.length} certifications from API`);
        setCertifications(certs);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('❌ Error loading certifications:', err);
        setError(`Failed to load certifications: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const getStatusStyles = (status: Certification['status']) => {
    switch (status) {
      case 'Valid':
        return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50';
      case 'Expired':
        return 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700';
    }
  };

  const getIconStyles = (status: Certification['status']) => {
    if (status === 'Expired') {
      return {
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-red-500 dark:text-red-400',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      };
    }
    return {
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-500 dark:text-green-400',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    };
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        role={role}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Certification"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
          userName={role === 'supervisor' ? 'John Matthew' : 'Peter Omorogbolahan'}
          userRole={role === 'supervisor' ? 'Supervisor' : 'System Administrator'}
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8 bg-[#fffaf5] dark:bg-[#0D0D0D] transition-colors min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Certification Container */}
            <div className="bg-[#FFFAF5] dark:bg-[#121212] rounded-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Certification</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-bold">Professional and Safety Certification</p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-[#C24438] border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Loading certifications...</p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4 mb-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && certifications.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No certifications found</p>
                </div>
              )}

              {/* Certification List */}
              {!loading && certifications.length > 0 && (
                <div className="space-y-4">
                  {certifications.map((cert) => {
                    const iconStyles = getIconStyles(cert.status);
                    return (
                      <div
                        key={cert.id}
                        className="bg-white dark:bg-[#0D0D0D] rounded-xl p-4 md:p-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center gap-4"
                      >
                        {/* Left: Icon + Info */}
                        <div className="flex items-start gap-4 flex-1">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-full ${iconStyles.bgColor} flex items-center justify-center flex-shrink-0`}>
                            <span className={iconStyles.iconColor}>{iconStyles.icon}</span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Assigned to: <span className="font-medium">{cert.userEmail || 'Unknown User'}</span></p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Issued by: {cert.issuedBy}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Issued Date: {cert.issueDate}</p>
                              <p className="text-sm text-[#C24438] dark:text-red-400">Expiry Date: {cert.expiryDate}</p>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status Badge */}
                        <div className="flex-shrink-0">
                          <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-lg border ${getStatusStyles(cert.status)}`}>
                            Status: {cert.status}
                          </span>
                        </div>

                        {/* File Link - TODO: Uncomment when Cloudinary/file storage is ready */}
                        {/* {cert.fileUrl && (
                          <div className="flex-shrink-0">
                            <a
                              href={cert.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-[#C24438] hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
                              </svg>
                              View
                            </a>
                          </div>
                        )} */}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
