import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/bottom_nav.dart';
import 'package:invera_hse/create_report_screen.dart';
import 'package:invera_hse/home_screen.dart';
import 'package:invera_hse/login.dart';
import 'package:invera_hse/notification_screen.dart';
import 'package:invera_hse/onboarding_screen.dart';
import 'package:invera_hse/profile_screen.dart';
import 'package:invera_hse/report_screen.dart';
import 'package:invera_hse/review_screen.dart';
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

          // Success Screen route
          GoRoute(
            path: AppRoutes.successScreen,
            name: AppRoutes.successScreenName,
            builder: (BuildContext context, GoRouterState state) {
              return const SuccessScreen();
            },
          ),

// ================= Review routes =================

          // Review route
          GoRoute(
            path: AppRoutes.review,
            name: AppRoutes.reviewName,
            builder: (BuildContext context, GoRouterState state) {
              return const ReviewScreen();
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
        ],
      );
}
