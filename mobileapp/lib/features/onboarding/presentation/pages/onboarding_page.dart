import 'dart:async';
import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/features/onboarding/onboarding_provider.dart';
import 'package:aegix/features/onboarding/widgets/onboarding_content.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import '../../models/onboarding_model.dart';

class OnboardingPage extends HookConsumerWidget {
  const OnboardingPage({super.key});

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
      backgroundColor: AppTheme.onboardingColor,
      body: Column(
        children: [
          // Top Section - Sliding Content
          Expanded(
            flex: 4,
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
          
          // Bottom Section - Static Controls with Auth Buttons
          Expanded(
            flex: 5,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
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
                    style: GoogleFonts.inter(
                      fontSize: 20.sp,
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
                      color: Colors.white.withOpacity(0.9),
                      letterSpacing: 0.5,
                      height: 1.2,
                    ),
                  ),
                  
                  SizedBox(height: 30.h),
                  
                  // Continue with Google Button
                  _buildGoogleButton(),
                  
                  SizedBox(height: 12.h),
                  
                  // Continue with Apple Button
                  _buildAppleButton(),
                  
                  SizedBox(height: 12.h),
                  
                  // Continue with Email Button
                  _buildEmailButton(context),
                  
                  SizedBox(height: 80.h),
                  
                  // Already have an account? Sign In
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Already have an account? ',
                        style: TextStyle(
                          fontFamily: 'PlusJakartaSans',
                          fontSize: 14.sp,
                          color: Colors.white.withOpacity(0.7),
                        ),
                      ),
                      GestureDetector(
                        onTap: () {
                          context.push(AppRoutes.login);
                        },
                        child: Text(
                          'Sign In',
                          style: TextStyle(
                            fontSize: 14.sp,
                            fontWeight: FontWeight.w700,
                            color: AppTheme.secondaryColor,
                            // decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Google Button with AnyLogo
  Widget _buildGoogleButton() {
    return SizedBox(
      width: double.infinity,
      height: 45.h,
      child: ElevatedButton(
        onPressed: () {
          // Handle Google Sign In
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black87,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.r),
            side: BorderSide(color: Colors.grey.shade300, width: 1),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/google.png', // Replace with your file name
              width: 20, // Adjust size as needed
              height:20,
            ),
            SizedBox(width: 10.w),
            Text(
              'Continue with Google',
              style: TextStyle(
                fontFamily: 'PlusJakartaSans',
                fontSize: 15.sp,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Apple Button with Icon
  Widget _buildAppleButton() {
    return SizedBox(
      width: double.infinity,
      height: 45.h,
      child: ElevatedButton(
        onPressed: () {
          // Handle Apple Sign In
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.black,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.r),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.apple, size: 20.sp),
            SizedBox(width: 10.w),
            Text(
              'Continue with Apple',
              style: TextStyle(
                fontFamily: 'PlusJakartaSans',
                fontSize: 15.sp,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Email Button with Icon
  Widget _buildEmailButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 45.h,
      child: ElevatedButton(
        onPressed: () {
          context.go(AppRoutes.register);
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: Colors.black87,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.r),
            side: BorderSide(color: Colors.grey.shade300, width: 1),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.email_outlined, size: 20.sp),
            SizedBox(width: 10.w),
            Text(
              'Continue with Email',
              style: TextStyle(
                fontFamily: 'PlusJakartaSans',
                fontSize: 15.sp,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
            ),
          ],
        ),
      ),
    );
  } 
}