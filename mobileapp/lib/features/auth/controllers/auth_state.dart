import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:aegix/features/auth/models/user_model.dart';

part 'auth_state.freezed.dart';

@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = AuthStateInitial;
  const factory AuthState.loading() = AuthStateLoading;
  const factory AuthState.authenticated(UserModel user) = AuthStateAuthenticated;
  const factory AuthState.unauthenticated() = AuthStateUnauthenticated;
  const factory AuthState.error(String message) = AuthStateError;
} 

// Add this at the bottom of auth_state.dart AFTER generation works
extension AuthStateX on AuthState {
  bool get isLoading => this is AuthStateLoading;
  bool get isAuthenticated => this is AuthStateAuthenticated;
  bool get isUnauthenticated => this is AuthStateUnauthenticated;
  bool get hasError => this is AuthStateError;
  
  String? get errorMessage => this is AuthStateError ? (this as AuthStateError).message : null;
  UserModel? get user => this is AuthStateAuthenticated ? (this as AuthStateAuthenticated).user : null;
} 