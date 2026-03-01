import 'dart:async';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/features/onboarding/onboarding_provider.dart';
import 'package:aegix/features/onboarding/widgets/onboarding_content.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../models/onboarding_model.dart';

class OnboardingPage extends HookConsumerWidget {  // ✅ Your original class
  const OnboardingPage({super.key});  // ✅ Your original constructor

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pageController = usePageController();
    final currentPage = useState(0);
    final isAutoSliding = useState(true);
    
    final onboardingItems = ref.watch(onboardingItemsProvider);
    final onboardingController = ref.watch(onboardingControllerProvider);
    
    // Auto-slide timer with restart
    useEffect(() {
      if (!isAutoSliding.value) return null;
      
      final timer = Timer.periodic(const Duration(seconds: 3), (timer) {
        if (currentPage.value < onboardingItems.length - 1) {
          pageController.nextPage(
            duration: const Duration(milliseconds: 500),
            curve: Curves.easeInOut,
          );
        } else {
          pageController.animateToPage(
            0,
            duration: const Duration(milliseconds: 500),
            curve: Curves.easeInOut,
          );
        }
      });
      
      return () => timer.cancel();
    }, [currentPage.value, isAutoSliding.value, onboardingItems.length]);
    
    return Scaffold(
      body: Column(
        children: [
          // Top Section - Sliding Content
          Expanded(
            flex: 5,
            child: GestureDetector(
              onTap: () {
                isAutoSliding.value = false;
                Future.delayed(const Duration(seconds: 5), () {
                  if (context.mounted) {
                    isAutoSliding.value = true;
                  }
                });
              },
              onPanDown: (_) {
                isAutoSliding.value = false;
                Future.delayed(const Duration(seconds: 5), () {
                  if (context.mounted) {
                    isAutoSliding.value = true;
                  }
                });
              },
              child: PageView(
                controller: pageController,
                onPageChanged: (index) => currentPage.value = index,
                children: onboardingItems
                    .map((item) => OnboardingContent(item: item))
                    .toList(),
              ),
            ),
          ),
          
          // Bottom Section - Static Controls
          Expanded(
            flex: 5,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
              decoration: BoxDecoration(
                color: AppTheme.onboardingColor,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -5),
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Page Indicator
                  Center(
                    child: SmoothPageIndicator(
                      controller: pageController,
                      count: onboardingItems.length,
                      effect: ExpandingDotsEffect(
                        expansionFactor: 3,
                        dotHeight: 8,
                        dotWidth: 10,
                        spacing: 4,
                        radius: 4,
                        activeDotColor: const Color(0xFF474C55),
                        dotColor: const Color(0xFF474C55).withOpacity(0.3),
                        strokeWidth: 0,
                        paintStyle: PaintingStyle.fill,
                      ),
                    ),
                  ),
                  SizedBox(height: 20.h),
                  Text(
                    'Welcome to aegix',
                    style: TextStyle(
                      fontFamily: 'PlusJakartaSans', 
                      fontSize: 25.sp,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: 0.5,
                      height: 1.2,
                    ),
                  ),
                  SizedBox(height: 10.h),
                  Text(
                    'Create an account to continue',
                    style: TextStyle(
                      fontFamily: 'PlusJakartaSans', 
                      fontSize: 16.sp,
                      color: Colors.white,
                      letterSpacing: 0.5,
                      height: 1.2,
                    ),
                  ),
                  // Buttons Row
                  // Row(
                  //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  //   children: [
                  //     if (currentPage.value < onboardingItems.length - 1)
                  //       TextButton(
                  //         onPressed: () {
                  //           isAutoSliding.value = false;
                  //           onboardingController.skipOnboarding(context);
                  //         },
                  //         style: TextButton.styleFrom(
                  //           minimumSize: const Size(80, 48),
                  //         ),
                  //         child: const Text('Skip', style: TextStyle(fontSize: 16)),
                  //       )
                  //     else
                  //       const SizedBox(width: 80),
                      
                  //     ElevatedButton(
                  //       onPressed: () {
                  //         isAutoSliding.value = false;
                  //         if (currentPage.value == onboardingItems.length - 1) {
                  //           onboardingController.completeOnboarding(context);
                  //         } else {
                  //           pageController.nextPage(
                  //             duration: const Duration(milliseconds: 300),
                  //             curve: Curves.ease,
                  //           );
                  //         }
                  //       },
                  //       style: ElevatedButton.styleFrom(
                  //         minimumSize: const Size(120, 48),
                  //         shape: RoundedRectangleBorder(
                  //           borderRadius: BorderRadius.circular(30),
                  //         ),
                  //         backgroundColor: const Color(0xFF474C55),
                  //         foregroundColor: Colors.white,
                  //       ),
                  //       child: Text(
                  //         currentPage.value == onboardingItems.length - 1
                  //             ? 'Get Started'
                  //             : 'Next',
                  //         style: const TextStyle(fontSize: 16),
                  //       ),
                  //     ),
                  //   ],
                  // ),
                  
                  const SizedBox(height: 16),
                  
                  // Progress indicator
                  // Text(
                  //   '${currentPage.value + 1}/${onboardingItems.length}',
                  //   style: TextStyle(
                  //     color: Colors.grey.shade500,
                  //     fontSize: 14,
                  //     fontWeight: FontWeight.w500,
                  //   ),
                  // ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}