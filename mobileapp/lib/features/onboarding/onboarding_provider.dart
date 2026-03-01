import 'package:aegix/shared/providers/provider_setup.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// Provider for onboarding controller
final onboardingControllerProvider = Provider<OnboardingController>((ref) {
  return OnboardingController(ref);
});

class OnboardingController {
  final Ref ref;

  OnboardingController(this.ref);

  Future<void> completeOnboarding(BuildContext context) async {
    try {
      final prefs = await ref.read(sharedPreferencesProvider.future);
      await prefs.setBool('onboarding_completed', true);
      
      if (context.mounted) {
        context.go('/login');
      }
    } catch (e) {
      debugPrint('Error completing onboarding: $e');
    }
  }

  Future<void> skipOnboarding(BuildContext context) async {
    await completeOnboarding(context);
  }
}