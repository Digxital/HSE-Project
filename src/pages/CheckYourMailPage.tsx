// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Logo } from '@/components/ui/Logo';
// import { LoadingScreen } from '@/components/ui/LoadingScreen';

// export const CheckYourMailPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleResendLink = () => {
//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       console.log('Resend link clicked');
//       // TODO: Call resend API
//     }, 2000);
//   };

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <div className="min-h-screen bg-background-light">
//       {/* Navbar */}
//       <nav className="bg-background-navbar shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center space-x-3">
//             <Logo size="md" />
//             <span className="text-xl font-bold text-gray-900">Aegix</span>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content - Centered */}
//       <div className="flex items-center justify-center px-4 py-12 md:py-20">
//         <div 
//           className="w-full max-w-md text-center"
//           data-aos="fade-up"
//           data-aos-duration="800"
//         >
//           {/* Email Icon */}
//           <div 
//             className="flex justify-center mb-8"
//             data-aos="zoom-in"
//             data-aos-delay="200"
//           >
//             <div className="w-24 h-24 bg-primary-50 rounded-2xl flex items-center justify-center">
//               <svg 
//                 className="w-12 h-12 text-primary-500" 
//                 fill="none" 
//                 stroke="currentColor" 
//                 viewBox="0 0 24 24"
//               >
//                 <path 
//                   strokeLinecap="round" 
//                   strokeLinejoin="round" 
//                   strokeWidth={2} 
//                   d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
//                 />
//                 {/* Notification dot */}
//                 <circle cx="18" cy="6" r="3" fill="currentColor" />
//               </svg>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 
//             className="text-3xl font-bold text-gray-900 mb-3"
//             data-aos="fade-up"
//             data-aos-delay="300"
//           >
//             Check your mail
//           </h1>

//           {/* Subtitle */}
//           <p 
//             className="text-gray-600 mb-8"
//             data-aos="fade-up"
//             data-aos-delay="400"
//           >
//             We have sent password recovery instructions to your email.
//           </p>

//           {/* Resend Link */}
//           <div
//             data-aos="fade-up"
//             data-aos-delay="500"
//           >
//             <p className="text-gray-700">
//               Didn't get the email?{' '}
//               <button
//                 onClick={handleResendLink}
//                 className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
//               >
//                 Resend Link
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };