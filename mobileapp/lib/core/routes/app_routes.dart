import 'package:aegix/features/auth/presentation/pages/login_page.dart';
import 'package:aegix/features/auth/presentation/pages/register_page.dart';
import 'package:aegix/features/onboarding/presentation/pages/onboarding_page.dart';
import 'package:aegix/features/splash/presentation/pages/splash_page.dart';
import 'package:aegix/features/home/presentation/pages/home_page.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
  
final goRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: AppRoutes.splash,
    routes: [
      GoRoute( 
        path: AppRoutes.splash,
        name: 'splash',
        builder: (context, state) => const SplashPage(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        name: 'onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        builder: (context, state) => const LoginPage(),
      ),
      GoRoute(
        path: AppRoutes.register,
        name: 'register',
        builder: (context, state) => const RegisterPage(),
      ), 
      GoRoute(
        path: AppRoutes.home,
        name: 'home',
        builder: (context, state) => const HomePage(),
      ),
    ],
  );
});
 
class AppRoutes {
  static const String splash = '/';
  static const String onboarding = '/onboarding';
  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  
  // Protected routes (require authentication)
  static const String profile = '/profile';
  static const String settings = '/settings';
  static const String transactions = '/transactions';
  static const String wallets = '/wallets';
}