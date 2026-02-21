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
  static const String report = '/report';
  static const String review = '/review';
  static const String profile = '/profile';

  // ================= Report Route paths =================
  static const String createReport = '/create-report';
  static const String successScreen = '/success-screen';

  // ================= Notifications Route paths =================
  static const String notification = '/notification-screen';

  // ================= Bottom Navbar Route paths =================
  static const String bottomNav = '/bottom-nav';

  // Route names (optional, for named routes)
  static const String bottomNavName = 'bottom-nav';
  static const String onboardingName = 'onboarding';
  static const String loginName = 'login';
  static const String forgotPasswordName = 'forgot-password';
  static const String homeName = 'home';
  static const String notificationName = 'notification-screen';
  static const String reportName = 'report';
  static const String reviewName = 'review';
  static const String profileName = 'profile';
  static const String createReportName = 'create-report';
  static const String successScreenName = 'success-screen';

  // Helper methods for building routes with parameters
  static String profileWithId(String id) => '$profile/$id';
  static String homeWithQuery(String query) => '$home?q=$query';
}
