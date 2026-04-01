import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/custom_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ProfileOverview extends StatelessWidget {
  final String name;
  final String email;

  const ProfileOverview({super.key, required this.name, required this.email});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CommonImageView(imagePath: AppFilePaths.avatar2, height: 50, width: 50),

        SizedBox(width: 20.h),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomText(
              text: name,
              fontSize: 16.sp,
              fontWeight: FontWeight.w500,
            ),
            SizedBox(height: 5.h),
            CustomText(
              text: email,
              fontSize: 16,
              fontWeight: FontWeight.w400,
              color: AppColors.blackColor2,
            ),
          ],
        ),
      ],
    );
  }
}
