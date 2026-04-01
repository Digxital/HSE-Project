import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/routes/go_router.dart';
import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/custom_text.dart';
import 'package:aegix/core/utils/get_container.dart';
import 'package:aegix/core/utils/screen_properties.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  var reportDataList = [
    {
      "title": "Oil spill near pump station",
      "date": "Now",
      "status": "Open",
      "riskLevel": "High",
    },
    {
      "title": "Oil spill near pump station",
      "date": "Jan 30",
      "status": "Open",
      "riskLevel": "High",
    },
    {
      "title": "Oil spill near pump station",
      "date": "Jan 30",
      "status": "Open",
      "riskLevel": "High",
    },
  ];
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 20.h),
              const Header(),
              SizedBox(height: 50.h),
              const ReportCards(),
              SizedBox(height: 20.h),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: CustomText(
                      text: "Recent Reports",
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                      color: AppColors.darkBrown,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: CustomText(
                      text: "View all",
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 20.h),
              ...List.generate(reportDataList.length, (index) {
                final item = reportDataList[index];
                return Column(
                  children: [
                    ReportData(
                      title: item['title'] as String,
                      date: item['date'] as String,
                    ),
                    if (index < reportDataList.length - 1)
                      const Divider(
                        height: 50,
                        thickness: 0.2,
                        color: AppColors.lightGreyColor4,
                      ),
                  ],
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}

class ReportCards extends StatelessWidget {
  const ReportCards({super.key});

  @override
  Widget build(BuildContext context) {
    final reportData = [
      ReportCardData(
        title: "Total Reports",
        reportCount: "18",
        isTotalReport: true,
        bgColor: AppColors.primaryColor,
        textColor: Colors.white,
        borderColor: Colors.transparent,
      ),
      ReportCardData(
        title: "Open Reports",
        reportCount: "5",
        isTotalReport: false,
        bgColor: AppColors.lightGreyColor2,
        textColor: Colors.black,
        borderColor: AppColors.lightGreyColor3,
      ),
      ReportCardData(
        title: "High Risk Reports",
        reportCount: "2",
        isTotalReport: false,
        bgColor: AppColors.lightGreyColor2,
        textColor: Colors.black,
        borderColor: AppColors.lightGreyColor3,
      ),
      ReportCardData(
        title: "Pending Review",
        reportCount: "3",
        isTotalReport: false,
        bgColor: AppColors.lightGreyColor2,
        textColor: Colors.black,
        borderColor: AppColors.lightGreyColor3,
      ),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 15,
          mainAxisSpacing: 15,
          childAspectRatio: 1.5,
        ),
        itemCount: reportData.length,
        itemBuilder: (context, index) {
          final card = reportData[index];
          return ReportCard(
            title: card.title,
            reportCount: card.reportCount,
            isTotalReport: card.isTotalReport,
            bgColor: card.bgColor,
            textColor: card.textColor,
            borderColor: card.borderColor,
          );
        },
      ),
    );
  }
}

class ReportData extends StatelessWidget {
  final String title;
  final String date;
  const ReportData({super.key, required this.title, required this.date});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Row(
            children: [
              getContainer(
                context: context,
                height: 48.h,
                width: 48.w,
                borderRadius: BorderRadius.circular(12),
                decorationColor: AppColors.lightOrange,
                child: Center(
                  child: CommonImageView(
                    imagePath: AppFilePaths.reportBlack,
                    height: 24,
                    width: 24,
                    fit: BoxFit.scaleDown,
                  ),
                ),
              ),
              SizedBox(width: 15.h),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CustomText(
                    text: title,
                    fontSize: 16.sp,
                    fontWeight: FontWeight.w400,
                  ),
                  Row(
                    children: [
                      const ReportUpdate(update: "Incident"),
                      SizedBox(width: 10.w),
                      const ReportUpdate(update: "Open"),
                      SizedBox(width: 10.w),
                      const ReportUpdate(update: "High"),
                    ],
                  ),
                ],
              ),
            ],
          ),
          CustomText(text: date, fontSize: 12.sp, fontWeight: FontWeight.w400),
        ],
      ),
    );
  }
}

class ReportUpdate extends StatelessWidget {
  final String update;
  const ReportUpdate({super.key, required this.update});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 5),
      child: Row(
        children: [
          getContainer(
            context: context,
            height: 3,
            width: 3,
            decorationColor: Colors.black,
            shape: BoxShape.circle,
          ),
          SizedBox(width: 6.w),
          CustomText(
            text: update,
            fontSize: 10,
            fontWeight: FontWeight.w400,
            color: AppColors.blackColor2,
          ),
        ],
      ),
    );
  }
}

class ReportCard extends StatelessWidget {
  final String title;
  final String reportCount;
  final bool isTotalReport;
  final Color bgColor;
  final Color textColor;
  final Color borderColor;
  const ReportCard({
    super.key,
    required this.title,
    required this.reportCount,
    required this.isTotalReport,
    required this.bgColor,
    required this.textColor,
    this.borderColor = AppColors.lightGreyColor3,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 113,
      width: 178,
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Padding(
        padding: const EdgeInsets.only(left: 20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomText(
              text: title,
              fontSize: 14.sp,
              color: textColor,
              fontWeight: FontWeight.w400,
            ),
            SizedBox(height: 5.h),
            CustomText(
              text: reportCount,
              fontSize: 24,
              color: textColor,
              fontWeight: FontWeight.w700,
            ),
            SizedBox(height: 5.h),
            Row(
              children: [
                CustomText(
                  text: isTotalReport ? "View all reports" : "View reports",
                  fontSize: 10.sp,
                  color: textColor,
                  fontWeight: FontWeight.w400,
                ),
                CommonImageView(
                  imagePath: AppFilePaths.arrowUpRight,
                  height: 7.34,
                  width: 7.34,
                  color: isTotalReport ? Colors.white : Colors.black,
                  fit: BoxFit.scaleDown,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class Header extends StatelessWidget {
  const Header({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              CommonImageView(
                imagePath: AppFilePaths.avatar,
                height: 48,
                width: 48,
                fit: BoxFit.scaleDown,
              ),
              SizedBox(width: 8.w),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CustomText(
                    text: "Hello Peter 👋 ",
                    fontSize: 16.sp,
                    color: AppColors.darkBrown,
                    fontWeight: FontWeight.w500,
                  ),
                  Row(
                    children: [
                      CustomText(
                        text: "Akure, Ondo",
                        fontSize: 12.sp,
                        color: AppColors.lightBrown,
                        fontWeight: FontWeight.w400,
                      ),
                      SizedBox(width: 5.w),
                      Padding(
                        padding: const EdgeInsets.only(top: 2),
                        child: CommonImageView(
                          imagePath: AppFilePaths.arrowDown,
                          height: 12,
                          width: 12,
                          fit: BoxFit.scaleDown,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          Stack(
            children: [
              InkWell(
                onTap: () => context.push(AppRoutes.notification),
                child: CommonImageView(
                  imagePath: AppFilePaths.notification,
                  height: 24,
                  width: 24,
                  fit: BoxFit.scaleDown,
                ),
              ),
              // if (hasUnread)
              Positioned(
                top: 0,
                right: 2,
                child: Container(
                  height: 8,
                  width: 8,
                  decoration: const BoxDecoration(
                    color: AppColors.primaryColor,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class ReportCardData {
  final String title;
  final String reportCount;
  final bool isTotalReport;
  final Color bgColor;
  final Color textColor;
  final Color borderColor;

  ReportCardData({
    required this.title,
    required this.reportCount,
    required this.isTotalReport,
    required this.bgColor,
    required this.textColor,
    required this.borderColor,
  });
}
