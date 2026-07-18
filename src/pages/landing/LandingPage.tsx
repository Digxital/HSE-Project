import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Logo } from '@/components/ui/Logo';
import { RequestDemoModal } from '@/components/common/RequestDemoModal';
import { CountryCodeDropdown } from '@/components/ui/CountryCodeDropdown';
import { SocialIcons } from '@/components/ui/SocialIcons';
import { getCountryCodesData } from '@/utils/countryCodeData';
import iPhoneMockup from '@/assets/images/iphone-14-pro-mockup.png';
import iPhone14Pro2 from '@/assets/images/iPhone-14-Pro2.png';
import googlePlayIcon from '@/assets/images/google-play.png';
import appleIcon from '@/assets/images/Apple.png';
import featureFrame1 from '@/assets/images/Frame-1000005758.png';
import featureFrame2 from '@/assets/images/Frame-2.png';
import featureFrame3 from '@/assets/images/Frame-3.png';
import reportImage from '@/assets/images/Report.png';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>('faq-1');
  const [contactForm, setContactForm] = useState({
    countryCode: '+1',
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const countryCodesData = getCountryCodesData();

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Key Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQs', href: '#faqs' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.phone.trim() || !contactForm.subject.trim() || !contactForm.message.trim()) {
      toast.error('All fields are required', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      await axios.post('https://hse-backend-n8d4.onrender.com/api/contact', {
        name: contactForm.name,
        email: contactForm.email,
        phoneNumber: `${contactForm.countryCode}${contactForm.phone}`,
        subject: contactForm.subject,
        message: contactForm.message,
      });
      
      toast.success('Message sent successfully! We\'ll get back to you soon.', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      setContactForm({ countryCode: '+1', name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        {
          position: 'top-right',
          autoClose: 3000,
        }
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ colorScheme: 'light', fontFamily: 'Space Grotesk, sans-serif' }}>
      <ToastContainer />
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }
        .faq-content {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
      {/* Single container for navbar and hero section */}
      <div className="bg-[#FFF4E6] w-[96%] mx-auto rounded-lg overflow-hidden">
        {/* Navbar section */}
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full">
            {/* Navigation - Rounded container */}
            <nav className="bg-white rounded-2xl px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Logo />
                  <span className="text-2xl font-bold text-[#C24438]">Aegix</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* Desktop Sign In / Request Demo Buttons */}
                <div className="hidden md:flex items-center gap-3">
                  <button
                    onClick={() => navigate('/admin/login')}
                    className="flex items-center gap-2 px-6 py-2 bg-[#C24438] hover:bg-[#A83309] text-white rounded-lg font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setIsDemoModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2 bg-[#200500] hover:bg-[#A83309] text-white rounded-lg font-medium transition-colors"
                  >
                    Request Demo
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Menu */}
              {mobileMenuOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.href)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/admin/login');
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C24438] hover:bg-[#A83309] text-white rounded-lg font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsDemoModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C2410C] hover:bg-[#A83309] text-white rounded-lg font-medium transition-colors"
                  >
                    Request Demo
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="w-full text-center">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight w-full" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <div className="inline-block">
                <span className="text-[#9B8B7E]">Streamline Workplace Safety</span>
              </div>
              <br />
              <div className="inline-block">
                <span className="text-black">Reporting</span> <span className="text-[#9B8B7E]">and </span> <span className="text-black">Action Management</span>
              </div>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Aegix helps organizations capture safety observations, hazards, and incidents in real time, enabling faster response, improved compliance, and better safety outcomes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              {/* Request Live Demo Button */}
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C2410C] hover:bg-[#A83309] text-white rounded-lg font-semibold transition-colors text-sm"
              >
                Request Live Demo
              </button>

              {/* View Features Button */}
              <button
                onClick={() => handleNavClick('#features')}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-semibold transition-colors text-sm"
              >
                View Features
              </button>
            </div>

            {/* iPhone Mockup - Centered below */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm">
                <img
                  src={iPhoneMockup}
                  alt="Aegix Mobile App Dashboard"
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* About Aegix Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-[85%] mx-auto bg-white rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left Content */}
            <div className='self-start'>
              <div className="inline-block border-2 border-gray-800 rounded-full px-6 py-2 mb-8 w-fit">
                <span className="text-sm font-semibold text-gray-800">ABOUT AEGIX</span>
              </div>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Aegix is a workplace safety reporting platform designed to help organizations identify risks, manage incidents, track corrective actions, and strengthen safety performance across operations.
              </p>
            </div>

            {/* Right Image */}
            <div className="flex justify-center self-end">
              <img
                src={reportImage}
                alt="Aegix Reports Dashboard"
                className="w-full h-auto rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-[85%] mx-auto bg-white rounded-lg">
          {/* Section Header */}
          <div className="mb-16">
            <div className="inline-block border border-gray-400 rounded-full px-6 py-2 mb-8">
              <span className="text-sm font-semibold text-gray-800">FEATURES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#9B8B7E]">
              Everything You Need to Manage<br />Workplace Safety
            </h2>
          </div>

          {/* Feature 1: Report Issue Quickly */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-stretch">
            {/* Left Side - Frame 1 */}
            <div className="flex justify-center">
              <img 
                src={featureFrame1} 
                alt="Report Issue Quickly"
                className="w-full h-auto"
              />
            </div>

            {/* Right Side - Frame 2 and Frame 3 Stacked */}
            <div className="flex flex-col gap-6">
              {/* Frame 2 - Voice Based Reporting */}
              <div className="flex-1">
                <img 
                  src={featureFrame2}
                  alt="Voice-Based Reporting"
                  className="w-full h-auto"
                />
              </div>

              {/* Frame 3 - Upload Evidence */}
              <div className="flex-1">
                <img 
                  src={featureFrame3}
                  alt="Upload Evidence"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-[85%] mx-auto bg-white rounded-lg">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block border border-gray-400 rounded-full px-6 py-2 mb-8">
              <span className="text-sm font-semibold text-gray-800">HOW IT WORKS</span>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1: Report An Issue */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-red-500 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth={2} />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Report An Issue</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Use voice or text to quickly report hazards, incidents, or unsafe conditions from anywhere.
              </p>
            </div>

            {/* Step 2: Add Evidence */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-orange-400 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add Evidence</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Upload photos and supporting evidence, then submit your report for review.
              </p>
            </div>

            {/* Step 3: Track Progress */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay updated on report status, assigned actions, and issue resolution in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile App Download */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#200500]">
        <div className="w-[80%] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-2 items-center">
            {/* Left Side - iPhone Mockup */}
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="w-full max-w-sm">
                <img
                  src={iPhone14Pro2}
                  alt="Aegix Mobile App"
                  className="w-full h-auto drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Right Side - CTA Content */}
            <div className="text-white order-1 lg:order-2">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                Ready to Strengthen Your Safety Program?
              </h2>
              <p className="text-lg text-gray-200 mb-8 leading-relaxed">
                Download the Aegix mobile application and enable faster reporting, better visibility, and improved management of workplace safety issues.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                {/* Request Demo Button */}
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-[#FFF4E6] hover:bg-[#FFE8CC] text-gray-900 rounded-lg font-semibold transition-colors w-fit"
                >
                  Request Demo
                </button>

                {/* Google Play Button */}
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg font-medium transition-colors w-fit text-sm">
                  <img src={googlePlayIcon} alt="Google Play" className="w-5 h-5" />
                  Download on Google Play
                </button>

                {/* App Store Button */}
                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-lg font-medium transition-colors w-fit text-sm">
                  <img src={appleIcon} alt="App Store" className="w-5 h-5" />
                  Download on App Store
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-[85%] mx-auto">
          {/* Section Header */}
          <div className="mb-16">
            <div className="inline-block border border-gray-400 rounded-full px-6 py-2 mb-8">
              <span className="text-sm font-semibold text-gray-800">Frequently Asked Questions</span>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === 'faq-1' ? null : 'faq-1')}
                className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
              >
                <span className={`text-2xl text-blue-500 transition-transform flex-shrink-0 ${expandedFAQ === 'faq-1' ? 'rotate-45' : ''}`}>
                  +
                </span>
                <span className="text-lg font-bold text-gray-900 text-left">What is Aegix?</span>
              </button>
              {expandedFAQ === 'faq-1' && (
                <div className="px-6 pb-6 border-l-4 border-blue-500 ml-4 faq-content">
                  <p className="text-gray-600 leading-relaxed">
                    Aegix is a workplace safety reporting and action management platform that helps organizations identify risks, manage incidents, track corrective actions, and strengthen safety performance across operations.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === 'faq-2' ? null : 'faq-2')}
                className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
              >
                <span className={`text-2xl text-blue-500 transition-transform flex-shrink-0 ${expandedFAQ === 'faq-2' ? 'rotate-45' : ''}`}>
                  +
                </span>
                <span className="text-lg font-bold text-gray-900 text-left">Who should use Aegix?</span>
              </button>
              {expandedFAQ === 'faq-2' && (
                <div className="px-6 pb-6 border-l-4 border-blue-500 ml-4 faq-content">
                  <p className="text-gray-600 leading-relaxed">
                    Any organization that values workplace safety can use Aegix. It's ideal for safety managers, frontline workers, supervisors, and compliance teams who need to report incidents, manage corrective actions, and maintain a proactive safety culture across their organization.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === 'faq-3' ? null : 'faq-3')}
                className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
              >
                <span className={`text-2xl text-blue-500 transition-transform flex-shrink-0 ${expandedFAQ === 'faq-3' ? 'rotate-45' : ''}`}>
                  +
                </span>
                <span className="text-lg font-bold text-gray-900 text-left">Can reports be submitted from the field?</span>
              </button>
              {expandedFAQ === 'faq-3' && (
                <div className="px-6 pb-6 border-l-4 border-blue-500 ml-4 faq-content">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! Aegix is designed for mobile-first reporting. Employees can submit safety reports directly from the field using the mobile app via voice input, text, or photos. This enables real-time incident documentation without delays.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === 'faq-4' ? null : 'faq-4')}
                className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
              >
                <span className={`text-2xl text-blue-500 transition-transform flex-shrink-0 ${expandedFAQ === 'faq-4' ? 'rotate-45' : ''}`}>
                  +
                </span>
                <span className="text-lg font-bold text-gray-900 text-left">How are corrective actions managed?</span>
              </button>
              {expandedFAQ === 'faq-4' && (
                <div className="px-6 pb-6 border-l-4 border-blue-500 ml-4 faq-content">
                  <p className="text-gray-600 leading-relaxed">
                    Once a report is submitted, safety teams can assign corrective actions directly in Aegix. The platform tracks action status, deadlines, and responsible parties. All stakeholders receive updates and notifications, ensuring accountability and timely resolution of safety issues.
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === 'faq-5' ? null : 'faq-5')}
                className="w-full flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
              >
                <span className={`text-2xl text-blue-500 transition-transform flex-shrink-0 ${expandedFAQ === 'faq-5' ? 'rotate-45' : ''}`}>
                  +
                </span>
                <span className="text-lg font-bold text-gray-900 text-left">Is Aegix available on iOS and Android?</span>
              </button>
              {expandedFAQ === 'faq-5' && (
                <div className="px-6 pb-6 border-l-4 border-blue-500 ml-4 faq-content">
                  <p className="text-gray-600 leading-relaxed">
                    Yes! Aegix is available on both iOS and Android platforms. You can download the app from the Apple App Store or Google Play Store to start reporting safety issues and managing corrective actions immediately.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Side - Heading */}
            <div>
              <div className="inline-block border border-gray-400 rounded-full px-6 py-2 mb-8">
                <span className="text-sm font-semibold text-gray-800">Contact Us</span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Get in Touch<br />with Us
              </h2>
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <form className="space-y-6" onSubmit={handleContactFormSubmit}>
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-900 mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="px-4 py-3 bg-[#FFF4E64D] text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-900 mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your e-mail address"
                      className="px-4 py-3 bg-[#FFF4E64D] text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Country Code & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-900 mb-2">Country Code</label>
                    <CountryCodeDropdown
                      countries={countryCodesData}
                      value={contactForm.countryCode}
                      onChange={(callingCode) => setContactForm({ ...contactForm, countryCode: callingCode })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-900 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Enter your Phone Number"
                      className="px-4 py-3 bg-[#FFF4E64D] text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-900 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Enter your subject"
                    className="px-4 py-3 bg-[#FFF4E64D] text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C]"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-900 mb-2">Message</label>
                  <textarea
                    placeholder="Enter your Message"
                    rows={6}
                    className="px-4 py-3 bg-[#FFF4E64D] text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C2410C] resize-none"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="w-full px-8 py-4 bg-[#200500] hover:bg-[#1a0400] disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors"
                >
                  {formSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Logo />
            <span className="text-2xl font-bold text-[#C24438]">Aegix</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm font-medium text-gray-800">
            <a href="#home" className="hover:text-[#C2410C] transition-colors">Home</a>
            <span className="text-gray-400">|</span>
            <a href="#features" className="hover:text-[#C2410C] transition-colors">Features</a>
            <span className="text-gray-400">|</span>
            <a href="#how-it-works" className="hover:text-[#C2410C] transition-colors">How It Works</a>
            <span className="text-gray-400">|</span>
            <a href="#faqs" className="hover:text-[#C2410C] transition-colors">FAQs</a>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8 text-sm text-gray-700">
            <a href="mailto:info@aegix.com" className="hover:text-[#C2410C] transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@aegix.com
            </a>
            <a href="tel:+234800000000" className="hover:text-[#C2410C] transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +234 800 000 0000
            </a>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            {/* Google Play Button */}
            <button className="flex items-center justify-center gap-3 px-8 py-3 bg-[#200500] hover:bg-[#1a0400] text-white rounded-2xl font-medium transition-colors text-sm">
              <img src={googlePlayIcon} alt="Google Play" className="w-5 h-5" />
              Download on Google Play
            </button>

            {/* App Store Button */}
            <button className="flex items-center justify-center gap-3 px-8 py-3 bg-[#200500] hover:bg-[#1a0400] text-white rounded-2xl font-medium transition-colors text-sm">
              <img src={appleIcon} alt="App Store" className="w-5 h-5" />
              Download on App Store
            </button>
          </div>

          {/* Social Media Icons */}
          <SocialIcons />

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>&copy; 2026 Aegix. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Request a Demo Modal */}
      <RequestDemoModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
};
