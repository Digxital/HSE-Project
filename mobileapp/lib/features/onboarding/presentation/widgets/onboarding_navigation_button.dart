import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import '../../models/onboarding_viewmodel.dart';

class OnboardingNavigationButton extends ConsumerWidget {
  const OnboardingNavigationButton({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final viewModel = OnboardingViewModel(ref);

    return GestureDetector(
      onTap: viewModel.nextPage,
      child: Container(
        height: 44.h,
        width: 44.w,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          gradient: const LinearGradient(
            colors: [
              AppColors.secondaryColor,
              AppColors.primaryColor,
            ],
          ),
        ),
        child: const Icon(
          Icons.arrow_forward_ios_rounded,
          color: Colors.white,
          size: 20,
        ),
      ),
    );
  }
}