class ApiEndpoints {
  static const String baseUrl = 'https://hse-backend-production-8ee9.up.railway.app';
  
  static const String login = '/api/auth/login';
  // static const String loginWithProvider = '/api/auth/login';

  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
}