import 'package:aegix/features/auth/controllers/auth_state.dart';
import 'package:aegix/features/auth/models/login_request_model.dart';
import 'package:aegix/features/auth/models/register_request_model.dart';
import 'package:aegix/features/auth/models/user_model.dart' hide LoginRequest, RegisterRequest; 
import 'package:aegix/features/auth/services/auth_service.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_controller.g.dart';

@riverpod
class AuthController extends _$AuthController {
  late final AuthService _authService;
  
  @override
  Future<AuthState> build() async {
    _authService = ref.watch(authServiceProvider);
    
    try {
      final hasSession = await _authService.hasActiveSession();
      
      if (hasSession) {
        final user = await _authService.getCurrentUser();
        return  AuthState.authenticated(user); 
      }
      
      return const AuthState.unauthenticated();
    } catch (e) {
      return AuthState.error(e.toString());
    }
  }
  
  Future<void> login(LoginRequest request) async {
    state = const AsyncValue.data(AuthState.loading());
    
    try {
      final response = await _authService.login(
        email: request.email,
        password: request.password,
      ); 
      
      state = AsyncValue.data(AuthState.authenticated(response.user));
      
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
  
  Future<void> register(RegisterRequest request) async {
    state = const AsyncValue.data(AuthState.loading());
    
    try {
      final response = await _authService.register(
        email: request.email,
        password: request.password,
        fullName: request.fullName,
        phoneNumber: request.phoneNumber,
      );
      
      state = AsyncValue.data(AuthState.authenticated(response.user));
      
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
  
  Future<void> logout() async {
    await _authService.logout();
    state = const AsyncValue.data(AuthState.unauthenticated());
  }
}

// Helper providers - FIXED to use correct state class names
final currentUserProvider = Provider<UserModel?>((ref) {
  final authState = ref.watch(authControllerProvider).valueOrNull;
  if (authState is AuthStateAuthenticated) {  // Changed from Authenticated
    return authState.user;
  }
  return null;
});

final isAuthenticatedProvider = Provider<bool>((ref) {
  final authState = ref.watch(authControllerProvider).valueOrNull;
  return authState is AuthStateAuthenticated;  // Changed from Authenticated
});