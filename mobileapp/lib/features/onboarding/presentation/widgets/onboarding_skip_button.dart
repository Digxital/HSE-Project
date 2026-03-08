import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import '../../models/onboarding_viewmodel.dart';
import 'onboarding_content.dart';

class OnboardingSkipButton extends ConsumerWidget {
  final int lastIndex;

  const OnboardingSkipButton({
    super.key,
    required this.lastIndex,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final viewModel = OnboardingViewModel(ref);

    return GestureDetector(
      onTap: () => viewModel.skipToLastPage(lastIndex),
      child: Row(
        children: [
          Text(
            "Skip",
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: AppColors.lightGreyColor,
            ),
          ),
          SizedBox(width: 5.w),
          OnboardingContent(
            imagePath: AppFilePaths.skip,
            height: 16,
            width: 16,
            fit: BoxFit.scaleDown,
          ),
        ],
      ),
    );
  }
}