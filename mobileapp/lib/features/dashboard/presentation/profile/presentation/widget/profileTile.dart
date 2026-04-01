import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/custom_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ProfileTile extends StatelessWidget {
  final String icon;
  final String text;
  final bool isSwitch;
  final bool isLogout;
  final bool isSwitchOn;
  final VoidCallback onTap;

  const ProfileTile({
    super.key,
    required this.icon,
    required this.text,
    this.isSwitch = false,
    this.isLogout = false,
    this.isSwitchOn = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    CommonImageView(
                      imagePath: icon,
                      height: 18,
                      width: 18,
                      fit: BoxFit.scaleDown,
                    ),
                    SizedBox(width: 15.w),
                    CustomText(
                      text: text,
                      fontSize: 14,
                      fontWeight: FontWeight.w400,
                    ),
                  ],
                ),
                isSwitch
                    ? CommonImageView(
                        imagePath: isSwitchOn
                            ? AppFilePaths.toggleOff
                            : AppFilePaths.toggleOff,
                        height: 17,
                        width: 34,
                      )
                    : isLogout
                    ? const SizedBox()
                    : CommonImageView(
                        imagePath: AppFilePaths.arrowForward,
                        height: 20,
                        width: 20,
                      ),
              ],
            ),
          ),
        ),
        Divider(color: AppColors.lightGrey5),
      ],
    );
  }
}
