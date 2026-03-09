// ignore_for_file: use_build_context_synchronously

import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/features/auth/presentation/widgets/custom_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';

import '../home/home_screen.dart';
import '../profile/profile_screen.dart';
import '../report/report_screen.dart';
import '../review/review_screen.dart';
 
class DashboardPage extends StatefulWidget {
  const DashboardPage({super.key});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  int selectedIndex = 0;
  bool active = false;

  void onTap(int index) {
    setState(() {
      selectedIndex = index;
      active = selectedIndex == index;
    });
  }

  final List _pages = [
    const HomeScreen(),
    const ReportScreen(),
    Container(),
    const ReviewScreen(),
    const ProfileScreen()
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        key: scaffoldKey,
        body: Scaffold(
            backgroundColor: Colors.transparent,
            body: _pages[selectedIndex],
            bottomNavigationBar: Container(
              height: 95,
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    blurRadius: 20,
                    color: Colors.black.withOpacity(.15),
                    offset: const Offset(0, 10),
                  )
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  bottomNNavItem(
                      AppFilePaths.homeActive, active ? "Home" : "", 0),
                  bottomNNavItem(AppFilePaths.report, "", 1),
 
                  /// CENTER BUTTON
                  GestureDetector(
                    onTap: () {
                      _showReportBottomSheet();
                    },
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: Container(
                        width: 55,
                        height: 55,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [
                              AppColors.secondaryColor,
                              AppColors.primaryColor,
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.lightRedColor2,
                              blurRadius: 8,
                              offset: Offset(0, 5),
                            )
                          ],
                        ),
                        child: const Icon(Icons.add_rounded,
                            color: Colors.white, size: 24),
                      ),
                    ),
                  ),
                  bottomNNavItem(AppFilePaths.review, "", 3),
                  bottomNNavItem(AppFilePaths.profile, "", 4),
                ],
              ),
            )));
  }

  Widget navItem(IconData icon, String label, int index) {
    final bool active = selectedIndex == index;

    return GestureDetector(
      onTap: () => onTap(index),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            size: 28,
            color: active ? const Color(0xffe23d1a) : Colors.orange.shade200,
          ),
          if (label.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  color:
                      active ? const Color(0xffe23d1a) : Colors.orange.shade200,
                  fontWeight: FontWeight.w500,
                ),
              ),
            )
        ],
      ),
    );
  }

  Widget bottomNNavItem(String icon, String label, int index) {
    active = selectedIndex == index;

    return GestureDetector(
      onTap: () => onTap(index),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CommonImageView(
            imagePath: icon,
            height: 24,
            width: 24,
            fit: BoxFit.scaleDown,
            color: active ? AppColors.primaryColor : AppColors.lightRedColor3,
          ),
          label.isNotEmpty
              ? Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: 14,
                      color:
                          active ? AppColors.primaryColor : AppColors.lightRedColor3,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                )
              : Container()
        ],
      ),
    );
  }

  void _showReportBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      builder: (BuildContext context) {
        return const ReportAgentWidget();
      },
    );
  }
}

class ReportAgentWidget extends StatelessWidget {
  const ReportAgentWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 561,
      width: double.infinity,
      child: Padding(
        padding: const EdgeInsets.only(top: 20, left: 25, right: 30),
        child: Column(
          children: [
            Align(
                alignment: Alignment.topLeft,
                child: InkWell(
                    onTap: () => context.pop(),
                    child: const Icon(Icons.close))),
            SizedBox(height: 30.h,),
            CommonImageView(
              imagePath: AppFilePaths.bot,
              height: 172.h,
              width: 172.w,
            ),
            CustomText(
                text: "Hi, I’m Aegix Assistant.",
                fontSize: 18,
                fontWeight: FontWeight.w500),
            SizedBox(height: 5.h,),
            CustomText(
                textAlign: TextAlign.center,
                text:
                    "I’ll guide you step by step to submit\na report quickly and easily..",
                fontSize: 14,
                fontWeight: FontWeight.w400),
            SizedBox(height: 50.h,),
            SizedBox(
              width: double.infinity,
              height: 44.h,
              child: Container(
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    gradient: const LinearGradient(
                      colors: [
                        AppColors.secondaryColor,
                        AppColors.primaryColor
                      ],
                    )),
                child: Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () {
                      context.push(AppRoutes.reportAgent);
                    },
                    child: const Center(
                      child: Text(
                        "Start Report",
                        style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                            color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
