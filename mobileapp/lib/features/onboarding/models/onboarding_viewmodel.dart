import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/routes/go_router.dart';
import 'package:aegix/features/auth/services/microsoft_auth_service.dart';
import 'package:aegix/features/onboarding/providers/onboarding_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class OnboardingViewModel {
  final WidgetRef ref;

  OnboardingViewModel(this.ref);

  // Get providers
  PageController get pageController => ref.read(pageControllerProvider);
  int get currentPage => ref.read(currentPageProvider);

  // Update current page
  void updatePage(int index) {
    ref.read(currentPageProvider.notifier).state = index;
  }

  // Navigate to next page
  void nextPage() {
    final controller = ref.read(pageControllerProvider);
    controller.nextPage(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  // Jump to last page (skip)
  void skipToLastPage(int lastIndex) {
    final controller = ref.read(pageControllerProvider);
    controller.jumpToPage(lastIndex);
  }

  // Navigate to specific page
  void animateToPage(int page) {
    final controller = ref.read(pageControllerProvider);
    controller.animateToPage(
      page,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  // Toggle auto-sliding
  void toggleAutoSliding(bool value) {
    ref.read(autoSlidingProvider.notifier).state = value;
  }

  // Handle get started
  Future<void> onGetStarted(BuildContext context) async {
    // await AuthService.storeOnboardedUser();
    if (context.mounted) {
      context.push(AppRoutes.login);
    }
  }

  // Auto-slide timer logic
  void setupAutoSlide({
    required int currentPage,
    required bool isAutoSliding,
    required int itemCount,
    required VoidCallback onNextPage,
    required VoidCallback onResetToFirst,
  }) {
    if (!isAutoSliding) return;

    if (currentPage < itemCount - 1) {
      onNextPage();
    } else {
      onResetToFirst();
    }
  }
}
