import 'package:aegix/features/auth/models/user/user_model.dart';

abstract class AuthService {
  Future<AuthResponse> login({required String email, required String password});
  Future<AuthResponse> register({required String email, required String password, required String name});
  Future<void> logout();
  Future<bool> isLoggedIn();
  Future<UserModel> getCurrentUser();
}

class AuthResponse {
  final UserModel user;
  final String token;
  
  AuthResponse({required this.user, required this.token});
} 