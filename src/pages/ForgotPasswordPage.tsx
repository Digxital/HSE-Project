// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Logo } from '@/components/ui/Logo';
// import { LoadingScreen } from '@/components/ui/LoadingScreen';

// export const ForgotPasswordPage: React.FC = () => {
//     const navigate = useNavigate();
//     const [isLoading, setIsLoading] = useState(false);
//     const [email, setEmail] = useState('');
//     const [error, setError] = useState('');

//     const validateEmail = () => {
//         if (!email) {
//             setError('Email is required');
//             return false;
//         }
//         if (!/\S+@\S+\.\S+/.test(email)) {
//             setError('Email is invalid');
//             return false;
//         }
//         return true;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!validateEmail()) return;

//         setIsLoading(true);

//         // Simulate API call
//         setTimeout(() => {
//             setIsLoading(false);
//             console.log('Reset link sent to:', email);
//             navigate('/check-your-mail');  // Update this line
//         }, 2000);
//     };

//     const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setEmail(e.target.value);
//         if (error) setError('');
//     };

//     if (isLoading) {
//         return <LoadingScreen />;
//     }

//     return (
//         <div className="min-h-screen bg-background-light">
//             {/* Navbar */}
//             <nav className="bg-background-navbar shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//                     <div className="flex items-center space-x-3">
//                         <Logo size="md" />
//                         <span className="text-xl font-bold text-gray-900">Aegix</span>
//                     </div>
//                 </div>
//             </nav>

//             {/* Main Content - Centered Card */}
//             <div className="flex items-center justify-center px-4 py-12 md:py-20">
//                 <div
//                     className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-12"
//                     data-aos="zoom-in"
//                     data-aos-duration="800"
//                 >
//                     {/* Title */}
//                     <div className="mb-8 text-center">
//                         <h1
//                             className="text-3xl font-bold text-gray-900 mb-2"
//                             data-aos="fade-down"
//                             data-aos-delay="200"
//                         >
//                             Forgot Password
//                         </h1>
//                         <p
//                             className="text-gray-600"
//                             data-aos="fade-down"
//                             data-aos-delay="300"
//                         >
//                             Reset password in few steps
//                         </p>
//                     </div>

//                     {/* Form */}
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div
//                             data-aos="fade-up"
//                             data-aos-delay="400"
//                         >
//                             <Input
//                                 label="Email Address"
//                                 name="email"
//                                 type="email"
//                                 value={email}
//                                 onChange={handleEmailChange}
//                                 error={error}
//                                 placeholder="Enter email address"
//                             />
//                         </div>

//                         {/* Send Reset Link Button */}
//                         <div
//                             data-aos="fade-up"
//                             data-aos-delay="500"
//                         >
//                             <Button
//                                 type="submit"
//                                 variant="primary"
//                                 className="w-full"
//                                 isLoading={isLoading}
//                             >
//                                 Send reset link
//                             </Button>
//                         </div>

//                         {/* Login Link */}
//                         <div
//                             className="text-center"
//                             data-aos="fade-up"
//                             data-aos-delay="600"
//                         >
//                             <button
//                                 type="button"
//                                 onClick={() => navigate('/login')}
//                                 className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
//                             >
//                                 Login
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };