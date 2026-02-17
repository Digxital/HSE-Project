import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/home_screen.dart';
import 'package:invera_hse/login.dart';
import 'package:invera_hse/onboarding_screen.dart';
import 'package:invera_hse/profile_screen.dart';
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

          // Home route
          GoRoute(
            path: AppRoutes.home,
            name: AppRoutes.homeName,
            builder: (BuildContext context, GoRouterState state) {
              return const HomeScreen();
            },
          ),

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
