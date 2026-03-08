import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/models/login/login_request_model.dart';
import 'package:aegix/features/auth/models/login/login_form_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:aegix/features/auth/providers/login_providers.dart';
import 'package:aegix/core/routes/app_routes.dart';

class LoginViewModel {
  final WidgetRef ref;
  
  LoginViewModel(this.ref);
 
  // Getters
  GlobalKey<FormState> get formKey => ref.read(loginFormKeyProvider);
  TextEditingController get emailController => ref.read(emailControllerProvider);
  TextEditingController get passwordController => ref.read(passwordControllerProvider);
  bool get isPasswordVisible => ref.watch(passwordVisibilityProvider);
  LoginFormModel get formData => ref.watch(loginFormProvider);

  // Toggle password visibility
  void togglePasswordVisibility() {
    ref.read(passwordVisibilityProvider.notifier).update((state) => !state);
  }

  // Update email - FIXED
  void updateEmail(String value) {
    ref.read(loginFormProvider.notifier).update((state) {
      // Cast state to LoginFormModel
      return (state as LoginFormModel).copyWith(email: value);
    });
  }

  // Update password - FIXED
  void updatePassword(String value) {
    ref.read(loginFormProvider.notifier).update((state) {
      // Cast state to LoginFormModel
      return (state as LoginFormModel).copyWith(password: value);
    });
  }

  // Toggle remember me - FIXED
  void toggleRememberMe() {
    ref.read(loginFormProvider.notifier).update((state) {
      // Cast state to LoginFormModel
      return (state as LoginFormModel).copyWith(rememberMe: !(state as LoginFormModel).rememberMe);
    });
  }

  // Set loading state - FIXED
  void setLoading(bool loading) {
    ref.read(loginFormProvider.notifier).update((state) {
      // Cast state to LoginFormModel
      return (state as LoginFormModel).copyWith(isLoading: loading);
    });
  }

  // Set error - FIXED
  void setError(String? error) {
    ref.read(loginFormProvider.notifier).update((state) {
      // Cast state to LoginFormModel
      return (state as LoginFormModel).copyWith(
        errorMessage: error, 
        isLoading: false
      );
    });
  }

  // Validate form
  bool validateForm() {
    return formKey.currentState?.validate() ?? false;
  }

  // Handle login - Convert form data to request model for API
  Future<void> onLogin(BuildContext context) async {
    if (!validateForm() || !formData.isFormValid) return;
    
    try {
      setLoading(true);
      
      // Create request model from form data (for API)
      final loginRequest = LoginRequestModel(
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      );
      
      // TODO: Implement actual login API call with loginRequest
      print('Login request: ${loginRequest.email}');
      await Future.delayed(const Duration(seconds: 2));
      
      if (context.mounted) {
        // context.push(AppRoutes.bottomNav);
        context.push(AppRoutes.dashboard); 
      }
    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }

  // Handle forgot password
  void onForgotPassword() {
    // TODO: Implement forgot password
  }

  // Handle help
  void onHelp() {
    // TODO: Implement help
  }

  // Reset form
  void resetForm() {
    emailController.clear();
    passwordController.clear();
    ref.read(loginFormProvider.notifier).update((state) {
      return LoginFormModel.initial();
    });
  }

  // Add this method to your LoginViewModel
  // In LoginViewModel.dart
Future<void> onMicrosoftLogin(LoginRequestModel microsoftLoginRequest) async {
  try {
    setLoading(true); 
    
    // Call auth controller with Microsoft data
    await ref.read(authControllerProvider.notifier).login(microsoftLoginRequest);
    
    // DON'T set loading false here - navigation will happen
    // The widget might be disposed
    
  } catch (e) {
    setError(e.toString());
    setLoading(false); // Only set loading false on error
  }
  // Don't set loading false on success - let navigation handle it
}
  
}