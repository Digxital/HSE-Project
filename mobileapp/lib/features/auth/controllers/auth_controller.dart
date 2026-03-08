import 'package:aegix/features/auth/controllers/auth_state.dart';
import 'package:aegix/features/auth/models/login/login_request_model.dart';
import 'package:aegix/features/auth/repositories/auth_repository.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_controller.g.dart';

@riverpod
class AuthController extends _$AuthController {
  late final AuthService _authService;
  
  @override
  Future<AuthState> build() async {
    _authService = ref.watch(authServiceProvider);
    
    try {
      // Check if user is already logged in
      final isLoggedIn = await _authService.isLoggedIn();
      
      if (isLoggedIn) {
        final user = await _authService.getCurrentUser();
        if (user != null) {
          return AuthState.authenticated(user);
        }
      }
      
      return const AuthState.unauthenticated();
    } catch (e) {
      return AuthState.error(e.toString());
    }
  }
  
  // Unified login method
  Future<void> login(LoginRequestModel request) async {
    state = const AsyncValue.loading();
     
    try { 
      final response = await _authService.login(request);
      
      state = AsyncValue.data(AuthState.authenticated(response.user));
      
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
  
  // Logout
  Future<void> logout() async {
    state = const AsyncValue.loading();
    
    try {
      await _authService.logout();
      state = const AsyncValue.data(AuthState.unauthenticated());
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}

// CORRECTED: Provider for checking auth status
final isAuthenticatedProvider = Provider<bool>((ref) {
  final authAsync = ref.watch(authControllerProvider);
  
  // Use when to properly handle AsyncValue and AuthState
  return authAsync.when(
    data: (authState) {
      // Use map/when on AuthState to check if authenticated
      return authState.map(
        initial: (_) => false,
        loading: (_) => false,
        authenticated: (_) => true,  // This is correct!
        unauthenticated: (_) => false,
        error: (_) => false,
      );
    },
    error: (_, __) => false,
    loading: () => false,
  );
});

// ALTERNATIVE: If you prefer a more concise version
final isAuthenticatedProviderSimple = Provider<bool>((ref) {
  final authAsync = ref.watch(authControllerProvider);
  
  return authAsync.maybeWhen(
    data: (authState) => authState.maybeWhen(
      authenticated: (_) => true,
      orElse: () => false,
    ),
    orElse: () => false,
  );
});