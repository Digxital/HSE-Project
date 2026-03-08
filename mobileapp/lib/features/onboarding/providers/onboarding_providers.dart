import 'package:aegix/features/onboarding/models/onboarding_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// Onboarding items provider
final onboardingItemsProvider = Provider<List<OnboardingContent>>((ref) {
  return [
    const OnboardingContent(
      title: 'Welcome to Aegix',
      description: 'Your trusted security companion',
      image: 'assets/images/onboarding1.png',
    ),
    const OnboardingContent(
      title: 'Stay Protected',
      description: 'Real-time security alerts and updates',
      image: 'assets/images/onboarding2.png',
    ),
    const OnboardingContent(
      title: 'Get Started',
      description: 'Join thousands of satisfied users',
      image: 'assets/images/onboarding3.png',
    ),
  ];
});

// Current page provider
final currentPageProvider = StateProvider<int>((ref) => 0);

// Auto-sliding provider
final autoSlidingProvider = StateProvider<bool>((ref) => true);

// Page controller provider (auto-dispose)
final pageControllerProvider = Provider.autoDispose<PageController>((ref) {
  final controller = PageController(initialPage: 0);
  ref.onDispose(controller.dispose);
  return controller;
});