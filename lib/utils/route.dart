/// Route constants for the application
class AppRoutes {
  // ================= Onboarding Route paths =================
  static const String splashscreen = '/';
  static const String onboarding = '/onboarding';
  static const String createAccount = '/create-account';
  static const String login = '/login';
  static const String forgotPassword = '/forgot-password';

  // ================= Loading State Route paths =================
  static const String loader = '/loader';

  // ================= Navbar Route paths =================
  static const String home = '/home';
  static const String profile = '/profile';

  // Route names (optional, for named routes)
  static const String onboardingName = 'onboarding';
  static const String loginName = 'login';
  static const String homeName = 'home';
  static const String profileName = 'profile';
  static const String forgotPasswordName = 'forgot-password';

  // Helper methods for building routes with parameters
  static String profileWithId(String id) => '$profile/$id';
  static String homeWithQuery(String query) => '$home?q=$query';
}
