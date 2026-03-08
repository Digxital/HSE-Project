import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class OnboardingDotIndicator extends ConsumerWidget {
  final int index;
  final int currentIndex;

  const OnboardingDotIndicator({
    super.key,
    required this.index,
    required this.currentIndex,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: EdgeInsets.only(right: index < 2 ? 7 : 0),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        height: currentIndex == index ? 10 : 7,
        width: currentIndex == index ? 10 : 7,
        decoration: BoxDecoration(
          color: currentIndex == index
              ? AppColors.primaryColor
              : AppColors.lightRedColor,
          shape: BoxShape.circle,
        ),
      ),
    );
  }
}