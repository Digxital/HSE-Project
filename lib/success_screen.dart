import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/login.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';

class SuccessScreen extends StatefulWidget {
  const SuccessScreen({super.key});

  @override
  State<SuccessScreen> createState() => _SuccessScreenState();
}

class _SuccessScreenState extends State<SuccessScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: Align(
          alignment: Alignment.center,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 50),
            child: getContainer(
                context: context,
                height: 232,
                decorationColor: AppColors.lightOrange2,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.lightOrange),
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CommonImageView(
                        imagePath: AppFilePaths.done,
                        height: 32,
                        width: 32,
                        fit: BoxFit.scaleDown,
                      ),
                      addVerticalSpace(10),
                      getText(
                        context: context,
                        title: "Report Submitted Successfully!",
                        fontSize: 14,
                        weight: FontWeight.w500,
                      ),
                      addVerticalSpace(10),
                      getText(
                        context: context,
                        title:
                            "Your report has been received. Our team\nwill review it shortly.",
                        textAlign: TextAlign.center,
                        fontSize: 12,
                        weight: FontWeight.w400,
                      ),
                      addVerticalSpace(25),
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
                            ),
                          ),
                          child: Material(
                            color: Colors.transparent,
                            child: InkWell(
                              onTap: () => context.go(AppRoutes.bottomNav),
                              child: Center(
                                child: getText(
                                  context: context,
                                  title: "Back to Home",
                                  fontSize: 16,
                                  weight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                )),
          ),
        ));
  }
}
