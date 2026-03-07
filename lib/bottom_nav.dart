// ignore_for_file: use_build_context_synchronously

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/home_screen.dart';
import 'package:invera_hse/profile_screen.dart';
import 'package:invera_hse/report_screen.dart';
import 'package:invera_hse/review_screen.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';

class BottomNav extends StatefulWidget {
  const BottomNav({super.key});

  @override
  State<BottomNav> createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
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
                              color: AppColors.lightRed2,
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
            color: active ? AppColors.primaryColor : AppColors.lightRed3,
          ),
          label.isNotEmpty
              ? Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    label,
                    style: TextStyle(
                      fontSize: 14,
                      color:
                          active ? AppColors.primaryColor : AppColors.lightRed3,
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
            addVerticalSpace(30),
            CommonImageView(
              imagePath: AppFilePaths.bot,
              height: 172,
              width: 172,
            ),
            getText(
                context: context,
                title: "Hi, I’m Aegix Assistant.",
                fontSize: 18,
                weight: FontWeight.w500),
            addVerticalSpace(5),
            getText(
                context: context,
                textAlign: TextAlign.center,
                title:
                    "I’ll guide you step by step to submit\na report quickly and easily..",
                fontSize: 14,
                weight: FontWeight.w400),
            addVerticalSpace(50),
            SizedBox(
              width: double.infinity,
              height: 44,
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
