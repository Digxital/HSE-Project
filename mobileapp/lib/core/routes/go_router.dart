// lib/core/routes/app_router.dart
import 'package:aegix/features/actions/models/action_model.dart';
import 'package:aegix/features/actions/presentations/action_details_screen.dart';
import 'package:aegix/features/actions/presentations/action_success_screen.dart';
import 'package:aegix/features/actions/presentations/filter_screen.dart';
import 'package:aegix/features/actions/presentations/start_action_details_screen.dart';
import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/presentation/pages/login_page.dart';
import 'package:aegix/features/dashboard/presentation/home/home_screen.dart';
import 'package:aegix/features/dashboard/presentation/pages/dashboard_page.dart';
import 'package:aegix/features/dashboard/presentation/report/report_agent.dart';
import 'package:aegix/features/onboarding/presentation/pages/onboarding_page.dart';
import 'package:aegix/features/splash/presentation/pages/splash_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/dashboard/presentation/notification/notification_screen.dart';
import 'app_routes.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      // Check authentication status
      final isAuthenticated = ref.read(isAuthenticatedProvider);

      // Public routes that don't require authentication
      final publicRoutes = ['/splash', '/onboarding', '/login'];
      final isPublicRoute = publicRoutes.contains(state.matchedLocation);

      // If not authenticated and trying to access protected route
      if (!isAuthenticated && !isPublicRoute) {
        return '/login';
      }

      // If authenticated and trying to access auth routes
      if (isAuthenticated && isPublicRoute) {
        return '/dashboard';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        name: 'splash',
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: '/onboarding',
        name: 'onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: '/dashboard',
        name: 'dashboard',
        builder: (context, state) => const DashboardPage(),
      ),
      GoRoute(
        path: '/home',
        name: 'home',
        builder: (context, state) => const HomeScreen(),
      ),
      GoRoute(
        path: '/notification',
        name: 'notification',
        builder: (context, state) => const NotificationScreen(),
      ),
      GoRoute(
        path: '/reportAgent',
        name: 'reportAgent',
        builder: (context, state) => const ReportAgentScreen(),
      ),
      GoRoute(
        path: AppRoutes.actionSuccessScreen,
        name: 'action-success-screen',
        builder: (BuildContext context, GoRouterState state) {
          return const ActionSuccessScreen();
        },
      ),
      GoRoute(
        path: AppRoutes.startActionDetails,
        name: 'start-action-details',
        builder: (context, state) {
          print('Route: ${state.uri.path}');
          print('Extra type: ${state.extra.runtimeType}');
          final report = state.extra as ActionReport?;
          if (report == null) {
            return const Scaffold(
              body: Center(child: Text('Action not found')),
            );
          }
          return StartActionsDetails(report: report);
        },
      ),
      GoRoute(
        path: AppRoutes.actionDetails,
        name: 'action-details',
        builder: (BuildContext context, GoRouterState state) {
          print('Route: ${state.uri.path}');
          print('Extra type: ${state.extra.runtimeType}');
          final report = state.extra as ActionReport?;
          if (report == null) {
            return const Scaffold(
              body: Center(child: Text('Action not found')),
            );
          }
          return ActionsDetails(report: report);
        },
      ),
      GoRoute(
        path: AppRoutes.filterScreen,
        name: 'filter-screen',
        builder: (BuildContext context, GoRouterState state) {
          return const FilterScreen();
        },
      ),
    ],
    errorBuilder: (context, state) =>
        Scaffold(body: Center(child: Text('Page not found: ${state.error}'))),
  );
});
