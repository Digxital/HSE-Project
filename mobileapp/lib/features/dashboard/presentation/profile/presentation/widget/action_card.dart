import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/get_container.dart';
import 'package:aegix/features/auth/presentation/widgets/custom_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ActionCard extends StatelessWidget {
  final String title;
  final String description;
  const ActionCard({super.key, required this.title, required this.description});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: getContainer(
        context: context,
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 30),
        borderRadius: BorderRadius.circular(20),
        decorationColor: AppColors.lightGrey7,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomText(
              text: title,
              fontSize: 12.sp,
              fontWeight: FontWeight.w400,
            ),

            SizedBox(height: 5.h),
            CustomText(
              text: description,
              fontSize: 18.sp,
              fontWeight: FontWeight.w500,
            ),
          ],
        ),
      ),
    );
  }
}
