import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/controllers/auth_state.dart';
import 'package:aegix/shared/providers/provider_setup.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// MARK: - Splash State
enum SplashStatus {
  initial,
  loading,
  checkingOnboarding,
  checkingAuth,
  completed,
  error
}

class SplashState {
  final SplashStatus status;
  final String? errorMessage;
  final bool onboardingCompleted;
  final bool isAuthenticated;
  
  SplashState({
    this.status = SplashStatus.initial,
    this.errorMessage,
    this.onboardingCompleted = false,
    this.isAuthenticated = false,
  });
  
  SplashState copyWith({
    SplashStatus? status,
    String? errorMessage,
    bool? onboardingCompleted,
    bool? isAuthenticated,
  }) {
    return SplashState(
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      onboardingCompleted: onboardingCompleted ?? this.onboardingCompleted,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
    );
  }
}

// MARK: - Splash Provider
final splashProvider = StateNotifierProvider<SplashController, SplashState>((ref) {
  return SplashController(ref);
});

class SplashController extends StateNotifier<SplashState> {
  final Ref ref;
  
  SplashController(this.ref) : super(SplashState()) {
    initializeSplash();
  }
  
  Future<void> initializeSplash() async {
    try {
      // Show loading state
      state = state.copyWith(status: SplashStatus.loading);
      
      // Simulate minimum splash screen time (for better UX)
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Check onboarding status
      await _checkOnboardingStatus();
      
    } catch (e) {
      state = state.copyWith(
        status: SplashStatus.error,
        errorMessage: e.toString(),
      );
    }
  }
  
  Future<void> _checkOnboardingStatus() async {
    state = state.copyWith(status: SplashStatus.checkingOnboarding);
    
    try {
      final prefs = await ref.read(sharedPreferencesProvider.future);
      final onboardingCompleted = prefs.getBool('onboarding_completed') ?? false;
       
      state = state.copyWith(onboardingCompleted: onboardingCompleted);
      
      if (onboardingCompleted) {
        // If onboarding is completed, check authentication
        await _checkAuthStatus();
      } else {
        // If onboarding not completed, we're done
        state = state.copyWith(status: SplashStatus.completed);
      }
      
    } catch (e) {
      state = state.copyWith(
        status: SplashStatus.error,
        errorMessage: 'Failed to check onboarding status',
      );
    }
  }
  
  Future<void> _checkAuthStatus() async {
    state = state.copyWith(status: SplashStatus.checkingAuth);
    
    try {
      // FIXED: Use when/map pattern instead of 'is' check
      final authState = await ref.read(authControllerProvider.future);
      
      bool isAuthenticated = false;
      
      // Use when pattern to check if authenticated
      authState.when(
        initial: () => isAuthenticated = false,
        loading: () => isAuthenticated = false,
        authenticated: (user) => isAuthenticated = true,
        unauthenticated: () => isAuthenticated = false,
        error: (message) => isAuthenticated = false,
      );
      
      state = state.copyWith(
        isAuthenticated: isAuthenticated,
        status: SplashStatus.completed,
      );
      
    } catch (e) {
      state = state.copyWith(
        status: SplashStatus.error,
        errorMessage: 'Failed to check authentication',
      );
    }
  }
  
  // Manual retry on error
  Future<void> retry() async {
    await initializeSplash();
  }
}

// MARK: - Derived Providers
final splashStatusProvider = Provider<SplashStatus>((ref) {
  return ref.watch(splashProvider).status;
});

final splashErrorProvider = Provider<String?>((ref) {
  return ref.watch(splashProvider).errorMessage;
});
 
final splashNavigationDestinationProvider = Provider<String?>((ref) {
  final state = ref.watch(splashProvider);
  
  if (state.status != SplashStatus.completed) {
    return null; // Not ready to navigate
  }
   
  if (!state.onboardingCompleted) {
    return '/onboarding'; // Go to onboarding
  }
  
  if (!state.isAuthenticated) {
    return '/login'; // FIXED: Changed from '/onboarding' to '/login'
  }
  
  return '/home'; // Go to home
});

// MARK: - Auto-dispose version
final splashFutureProvider = FutureProvider.autoDispose<bool>((ref) async {
  final prefs = await ref.watch(sharedPreferencesProvider.future);
  
  // Simulate loading
  await Future.delayed(const Duration(seconds: 2));
  
  // Check if onboarding is completed
  final onboardingCompleted = prefs.getBool('onboarding_completed') ?? false;
  
  if (!onboardingCompleted) {
    return false; // Go to onboarding
  }
  
  // FIXED: Use when pattern instead of 'is' check
  final authState = await ref.watch(authControllerProvider.future);
  
  bool isAuthenticated = false;
  authState.when(
    initial: () => isAuthenticated = false,
    loading: () => isAuthenticated = false,
    authenticated: (user) => isAuthenticated = true,
    unauthenticated: () => isAuthenticated = false,
    error: (message) => isAuthenticated = false,
  );
  
  return isAuthenticated; // true = go to home, false = go to login
});