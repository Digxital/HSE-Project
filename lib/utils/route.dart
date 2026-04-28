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
  static const String action = '/action';
  static const String profile = '/profile';

  // ================= Profile Route paths =================
  static const String editProfile = '/edit-profile';
  static const String certification = '/certification';
  static const String certificationDetails = '/certification-details';

  // ================= Report Route paths =================
  static const String createReport = '/create-report';
  static const String reportAgent = '/report-agent';
  static const String newReportScreen = '/new-report-screen';
  static const String successScreen = '/success-screen';

  // ================= Action Route paths =================
  static const String actionDetails = '/action-details';
  static const String startActionDetails = '/start-action-details';
  static const String actionSuccessScreen = '/action-success-screen';
  static const String filterScreen = '/filter';

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
  static const String actionName = 'action';
  static const String actionDetailsName = 'action-details';
  static const String filterScreenName = 'filter';
  static const String startActionDetailsName = 'start-action-details';
  static const String actionSuccessScreenName = 'action-success-screen';
  static const String profileName = 'profile';
  static const String editProfileName = 'edit-profile';
  static const String certificationName = 'certification';
  static const String certificationDetailsName = 'certification-details';
  static const String createReportName = 'create-report';
  static const String reportAgentName = '/report-agent';
  static const String newReportScreenName = '/new-report-screen';
  static const String successScreenName = 'success-screen';

  // Helper methods for building routes with parameters
  static String profileWithId(String id) => '$profile/$id';
  static String homeWithQuery(String query) => '$home?q=$query';
}
