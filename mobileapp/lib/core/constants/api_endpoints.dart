class ApiEndpoints {
  // Base URLs
  static const String baseUrl = 'https://dohmayn.com/api';
  static const String baseUrlDev = 'https://dev-api.dohmayn.com/v1';
  static const String baseUrlStaging = 'https://staging-api.dohmayn.com/v1';
  
  // Auth endpoints
  static const String login = '/login';  
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String verifyEmail = '/auth/verify-email';
  static const String resendVerification = '/auth/resend-verification';
  static const String me = '/auth/me';
  
  // 2FA endpoints
  static const String setup2FA = '/auth/2fa/setup';
  static const String enable2FA = '/auth/2fa/enable';
  static const String disable2FA = '/auth/2fa/disable';
  static const String verify2FA = '/auth/2fa/verify';
  
  // User endpoints
  static const String updateProfile = '/user/profile';
  static const String changePassword = '/user/change-password';
  static const String updateSettings = '/user/settings';
  
  // Financial endpoints
  static const String wallets = '/wallets';
  static const String transactions = '/transactions';
  static const String transfer = '/transactions/transfer';
  static const String deposit = '/transactions/deposit';
  static const String withdraw = '/transactions/withdraw';
  static const String statements = '/statements';
  
  // Cards endpoints
  static const String cards = '/cards';
  static const String freezeCard = '/cards/freeze';
  static const String unfreezeCard = '/cards/unfreeze';
  
  // Beneficiaries
  static const String beneficiaries = '/beneficiaries';
  
  // Notifications
  static const String notifications = '/notifications';
  static const String markNotificationRead = '/notifications/read';

  static const String assets = '/get/assets';
 
  
  // Helper method to get full URL
  static String getFullUrl(String endpoint, {bool useDev = false}) {
    final base = useDev ? baseUrlDev : baseUrl;
    return '$base$endpoint';
  }
  
  // Helper method to get endpoint with path parameters
  static String withPathParam(String endpoint, String param) {
    return '$endpoint/$param';
  }
  
  // Helper method to get endpoint with multiple path parameters
  static String withPathParams(String endpoint, List<String> params) {
    return '$endpoint/${params.join('/')}';
  }
}