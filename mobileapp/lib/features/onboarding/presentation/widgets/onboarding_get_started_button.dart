import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/features/onboarding/models/onboarding_viewmodel.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class OnboardingGetStartedButton extends ConsumerWidget {
  const OnboardingGetStartedButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final viewModel = OnboardingViewModel(ref);

    return SizedBox(
      width: double.infinity,
      height: 44.h,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: const LinearGradient(
            colors: [
              AppColors.secondaryColor,
              AppColors.primaryColor,
            ],
          ),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () => viewModel.onGetStarted(context),
            child: const Center(
              child: Text(
                "Get Started",
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}