
import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/custom_text.dart';
import 'package:aegix/core/utils/screen_properties.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ReportAgentScreen extends StatefulWidget {
  const ReportAgentScreen({super.key});

  @override
  State<ReportAgentScreen> createState() => _ReportAgentScreenState();
}

class _ReportAgentScreenState extends State<ReportAgentScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Align(
              alignment: Alignment.topLeft,
              child: CommonImageView(
                imagePath: AppFilePaths.bot,
                height: 141.41,
                width: 141.41,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Align(
                alignment: Alignment.topLeft,
                child: CustomText(
                    text: "What would you like to report\ntoday?",
                    fontSize: 18.sp,
                    fontWeight: FontWeight.w500),
              ),
            ),
            const ReportCategories()
          ],
        ),
      ),
    );
  }
}

class ReportCategories extends StatelessWidget {
  const ReportCategories({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 300,
      width: double.infinity,
      child: Column(
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 30, left: 30, right: 30),
            child: Divider(
              height: 45,
              thickness: 0.2,
              color: AppColors.lightGreyColor4,
            ),
          ),
          DataOption(
            onTap: () {
              // context.push(AppRoutes.newReportScreen, extra: "Incident");
            },
            icon: AppFilePaths.warning,
            title: "Incident",
            description:
                "An unsafe event that happened but did not\ncause serious injury",
          ),
          DataOption(
            onTap: () {
              // context.push(AppRoutes.newReportScreen, extra: "Hazard");
            },
            icon: AppFilePaths.warning2,
            title: "Hazard",
            description:
                "An event that caused injury, harm, or serious\ndamage.",
          ),
        ],
      ),
    );
  }
}

class DataOption extends StatelessWidget {
  final String icon;
  final String title;
  final String description;
  final VoidCallback? onTap;
  const DataOption({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 30),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          InkWell(
            onTap: onTap,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                CommonImageView(
                  imagePath: icon,
                  height: 24,
                  width: 24,
                  fit: BoxFit.scaleDown,
                ),
                addHorizontalSpace(8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomText(
                        text: title,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: AppColors.blackColor3),
                    addVerticalSpace(5),
                    CustomText(
                        text: description,
                        fontSize: 12,
                        fontWeight: FontWeight.w400,
                        color: AppColors.blackColor3),
                  ],
                )
              ],
            ),
          ),
          const Divider(
            height: 50,
            thickness: 0.2,
            color: AppColors.lightGreyColor4,
          ),
        ],
      ),
    );
  }
}
