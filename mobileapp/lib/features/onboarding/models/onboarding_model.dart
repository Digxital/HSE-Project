import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class OnboardingItem {
  final String title;
  final String description;
  final String imagePath;
  final Color backgroundColor;

  const OnboardingItem({
    required this.title,
    required this.description,
    required this.imagePath,
    this.backgroundColor = Colors.white,
  });
}

// Provider for onboarding items
final onboardingItemsProvider = Provider<List<OnboardingItem>>((ref) {
  return const [
    OnboardingItem(
      title: 'Welcome to Dohmayn',
      description: 'Your trusted financial partner for all your banking needs',
      imagePath: 'assets/images/onboarding1.jpeg',
    ),
    OnboardingItem(
      title: 'Easy Transactions',
      description: 'Send and receive money instantly with just a few taps',
      imagePath: 'assets/images/onboarding2.png',
    ),
    OnboardingItem(
      title: 'Secure & Safe',
      description: 'Your money is protected with state-of-the-art security',
      imagePath: 'assets/images/onboarding3.png',
    ),
  ];
});