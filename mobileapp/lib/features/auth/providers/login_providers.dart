import 'package:aegix/features/auth/models/login/login_form_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Form key provider
final loginFormKeyProvider = Provider<GlobalKey<FormState>>((ref) {
  return GlobalKey<FormState>();
});

// Form data provider
final loginFormProvider = StateProvider<LoginFormModel>((ref) {
  return  LoginFormModel.initial();
});

// Password visibility provider
final passwordVisibilityProvider = StateProvider<bool>((ref) => true);

// Email controller provider
final emailControllerProvider = Provider.autoDispose<TextEditingController>((ref) {
  final controller = TextEditingController();
  ref.onDispose(controller.dispose);
  return controller;
});

// Password controller provider
final passwordControllerProvider = Provider.autoDispose<TextEditingController>((ref) {
  final controller = TextEditingController();
  ref.onDispose(controller.dispose);
  return controller;
});

// Computed providers
final isFormValidProvider = Provider<bool>((ref) {
  final formData = ref.watch(loginFormProvider);
  return formData.isFormValid;
});

final isEmailValidProvider = Provider<bool>((ref) {
  final formData = ref.watch(loginFormProvider);
  return formData.isEmailValid;
});

final isPasswordValidProvider = Provider<bool>((ref) {
  final formData = ref.watch(loginFormProvider);
  return formData.isPasswordValid;
});