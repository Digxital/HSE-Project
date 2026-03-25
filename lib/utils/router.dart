import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/actions/action_success.dart';
import 'package:invera_hse/actions/actions_details.dart';
import 'package:invera_hse/actions/filter_screen.dart';
import 'package:invera_hse/actions/start_action_details.dart';
import 'package:invera_hse/bottom_nav.dart';
import 'package:invera_hse/create_report_screen.dart';
import 'package:invera_hse/home_screen.dart';
import 'package:invera_hse/login.dart';
import 'package:invera_hse/new_report_screen.dart';
import 'package:invera_hse/notification_screen.dart';
import 'package:invera_hse/onboarding_screen.dart';
import 'package:invera_hse/profile/edit_profile.dart';
import 'package:invera_hse/profile/profile_screen.dart';
import 'package:invera_hse/report_agent.dart';
import 'package:invera_hse/report_screen.dart';
import 'package:invera_hse/actions/actions_screen.dart';
import 'package:invera_hse/success_screen.dart';
import 'package:invera_hse/utils/route.dart';

/// Router configuration for the application
class AppRouter {
  /// Global navigator key
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  /// Store initial route parameters
  // static bool? _isLoggedIn;
  // static bool? _isOnBoarded;

  /// Get the configured GoRouter instance
  static GoRouter get router {
    _router ??= _createRouter();
    return _router!;
  }

  /// Initialize router with parameters
  static void initialize(
      {required bool isLoggedIn, required bool isOnBoarded}) {
    print("Is-logged-in: $isLoggedIn");
    print("Is-onboarded: $isOnBoarded");
    // _isLoggedIn = isLoggedIn;
    // _isOnBoarded = isOnBoarded;
  }

  /// Private router instance
  static GoRouter? _router;

  /// Create the router instance
  static GoRouter _createRouter() => GoRouter(
        navigatorKey: navigatorKey,
        // initialLocation: '/',
        initialLocation: '/onboarding',
        redirect: (BuildContext context, GoRouterState state) {
          // if (state.fullPath == '/') {
          if (state.fullPath == '/onboarding') {
            // return AppRoutes.splashscreen;
            return AppRoutes.onboarding;
          }
          return null;
        },
        routes: <RouteBase>[
// ================= Onboarding route =================

          GoRoute(
            path: AppRoutes.onboarding,
            name: AppRoutes.onboardingName,
            builder: (BuildContext context, GoRouterState state) {
              return const OnboardingScreen();
            },
          ),

// ================= Authentication routes =================

          GoRoute(
            path: AppRoutes.login,
            name: AppRoutes.loginName,
            builder: (BuildContext context, GoRouterState state) {
              return const Login();
            },
          ),

// ================= Bottom Navbar routes =================

          // Bottom Navbar route
          GoRoute(
            path: AppRoutes.bottomNav,
            name: AppRoutes.bottomNavName,
            builder: (BuildContext context, GoRouterState state) {
              return const BottomNav();
            },
          ),

// ================= Bottom Navbar routes =================

          // Home route
          GoRoute(
            path: AppRoutes.home,
            name: AppRoutes.homeName,
            builder: (BuildContext context, GoRouterState state) {
              return const HomeScreen();
            },
          ),

// ================= Notification routes =================

          // Notification route
          GoRoute(
            path: AppRoutes.notification,
            name: AppRoutes.notificationName,
            builder: (BuildContext context, GoRouterState state) {
              return const NotificationScreen();
            },
          ),

// ================= Report routes =================

          // Report route
          GoRoute(
            path: AppRoutes.report,
            name: AppRoutes.reportName,
            builder: (BuildContext context, GoRouterState state) {
              return const ReportScreen();
            },
          ),

          // Create Report route
          GoRoute(
            path: AppRoutes.createReport,
            name: AppRoutes.createReportName,
            builder: (BuildContext context, GoRouterState state) {
              return const CreateReportScreen();
            },
          ),

          // Report Agent route
          GoRoute(
            path: AppRoutes.reportAgent,
            name: AppRoutes.reportAgentName,
            builder: (BuildContext context, GoRouterState state) {
              return const ReportAgent();
            },
          ),

          // New Report route
          GoRoute(
            path: AppRoutes.newReportScreen,
            name: AppRoutes.newReportScreenName,
            builder: (BuildContext context, GoRouterState state) {
              return const NewReportScreen();
            },
          ),

          // Success Screen route
          GoRoute(
            path: AppRoutes.successScreen,
            name: AppRoutes.successScreenName,
            builder: (BuildContext context, GoRouterState state) {
              return const SuccessScreen();
            },
          ),

// ================= Action routes =================

          // Actions route
          GoRoute(
            path: AppRoutes.action,
            name: AppRoutes.actionName,
            builder: (BuildContext context, GoRouterState state) {
              return const ActionScreen();
            },
          ),

          // Filter route
          GoRoute(
            path: AppRoutes.filterScreen,
            name: AppRoutes.filterScreenName,
            builder: (BuildContext context, GoRouterState state) {
              return const FilterScreen();
            },
          ),

          // Actions Details route
          GoRoute(
            path: AppRoutes.actionDetails,
            name: AppRoutes.actionDetailsName,
            builder: (BuildContext context, GoRouterState state) {
              return const ActionsDetails();
            },
          ),

          // Start Action Details route
          GoRoute(
            path: AppRoutes.startActionDetails,
            name: AppRoutes.startActionDetailsName,
            builder: (BuildContext context, GoRouterState state) {
              return const StartActionsDetails();
            },
          ),

          // Actions Success route
          GoRoute(
            path: AppRoutes.actionSuccessScreen,
            name: AppRoutes.actionSuccessScreenName,
            builder: (BuildContext context, GoRouterState state) {
              return const ActionSuccessScreen();
            },
          ),

// ================= Profile routes =================

          // Profile route
          GoRoute(
            path: AppRoutes.profile,
            name: AppRoutes.profileName,
            builder: (BuildContext context, GoRouterState state) {
              return const ProfileScreen();
            },
          ),

          // Edit Profile route
          GoRoute(
            path: AppRoutes.editProfile,
            name: AppRoutes.editProfileName,
            builder: (BuildContext context, GoRouterState state) {
              return const EditProfileScreen();
            },
          ),
        ],
      );
}
