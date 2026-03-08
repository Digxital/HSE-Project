import 'dart:async';

import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/core/utils/custom_text.dart';
import 'package:aegix/features/onboarding/models/onboarding_viewmodel.dart';
import 'package:aegix/features/onboarding/providers/onboarding_providers.dart';
import 'package:aegix/features/onboarding/presentation/widgets/onboarding_content.dart';
import 'package:aegix/features/onboarding/presentation/widgets/onboarding_dot_indicator.dart';
import 'package:aegix/features/onboarding/presentation/widgets/onboarding_get_started_button.dart';
import 'package:aegix/features/onboarding/presentation/widgets/onboarding_navigation_button.dart';
import 'package:aegix/features/onboarding/presentation/widgets/onboarding_skip_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class OnboardingPage extends HookConsumerWidget {
  const OnboardingPage({super.key});
 
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Get providers
    final onboardingItems = ref.watch(onboardingItemsProvider);
    final pageController = ref.watch(pageControllerProvider);
    final currentPage = ref.watch(currentPageProvider);
    final isAutoSliding = ref.watch(autoSlidingProvider);
    
    // ViewModel
    final viewModel = OnboardingViewModel(ref);

    // Auto-slide timer
    useEffect(() {
      if (!isAutoSliding) return null;

      final timer = Timer.periodic(const Duration(seconds: 3), (timer) {
        viewModel.setupAutoSlide(
          currentPage: currentPage,
          isAutoSliding: isAutoSliding,
          itemCount: onboardingItems.length,
          onNextPage: () {
            pageController.nextPage(
              duration: const Duration(milliseconds: 500),
              curve: Curves.easeInOut,
            );
          },
          onResetToFirst: () {
            pageController.animateToPage(
              0,
              duration: const Duration(milliseconds: 500),
              curve: Curves.easeInOut,
            );
          },
        );
      });

      return timer.cancel;
    }, [currentPage, isAutoSliding, onboardingItems.length]);

    // Pause auto-slide on user interaction
    useEffect(() {
      void onUserInteraction() {
        if (isAutoSliding) {
          viewModel.toggleAutoSliding(false);
          // Re-enable after 5 seconds of inactivity
          Future.delayed(const Duration(seconds: 5), () {
            viewModel.toggleAutoSliding(true);
          });
        }
      }

      pageController.addListener(onUserInteraction);
      return () => pageController.removeListener(onUserInteraction);
    }, [isAutoSliding]);

    return Scaffold(
      body: Stack(
        children: [
          // PageView
          SizedBox.expand(
            child: PageView.builder(
              controller: pageController,
              itemCount: onboardingItems.length,
              onPageChanged: (index) => viewModel.updatePage(index),
              itemBuilder: (context, index) {
                final item = onboardingItems[index];
                return Stack(
                  children: [
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 0),
                      child: Stack(
                        children: [
                          OnboardingContent(
                            imagePath: item.image,
                            fit: BoxFit.scaleDown,
                          ),
                          Container(
                            width: double.infinity,
                            height: double.infinity,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  Colors.black.withOpacity(1),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),

          // Bottom Sheet
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 379.h,
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
              child: Padding(
                padding:  EdgeInsets.symmetric(horizontal: 30.w),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Dot indicators
                    Row(
                      children: List.generate(
                        onboardingItems.length,
                        (index) => OnboardingDotIndicator(
                          index: index,
                          currentIndex: currentPage,
                        ),
                      ),
                    ),
                    SizedBox(height: 15.h),
                    // Title
                    CustomText(
                      text: onboardingItems[currentPage].title,
                      fontSize: 24.sp,
                      fontWeight: FontWeight.w700,
                    ),
                    SizedBox(height: 5.h),
                    // // Description
                    CustomText(
                      text: onboardingItems[currentPage].description,
                      fontSize: 14.sp,
                      fontWeight: FontWeight.w400,
                      color: AppColors.neutralDarkGrey,
                    ),
                    SizedBox(height: 30.h),
                    
                    // Navigation or Get Started
                    if (currentPage < onboardingItems.length - 1)
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          OnboardingSkipButton(
                            lastIndex: onboardingItems.length - 1,
                          ),
                          const OnboardingNavigationButton(),
                        ],
                      )
                    else
                      const OnboardingGetStartedButton(),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
  
}