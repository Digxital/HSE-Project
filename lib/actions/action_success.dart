import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';

class ActionSuccessScreen extends StatefulWidget {
  const ActionSuccessScreen({super.key});

  @override
  State<ActionSuccessScreen> createState() => _ActionSuccessScreenState();
}

class _ActionSuccessScreenState extends State<ActionSuccessScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: Align(
          alignment: Alignment.center,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    getText(
                      context: context,
                      title: "This task is now marked as ",
                      textAlign: TextAlign.center,
                      fontSize: 14,
                      weight: FontWeight.w500,
                    ),
                    getText(
                        context: context,
                        title: "In Progress",
                        textAlign: TextAlign.center,
                        fontSize: 14,
                        weight: FontWeight.w500,
                        color: AppColors.orange),
                  ],
                ),
                addVerticalSpace(10),
                getText(
                  context: context,
                  title:
                      "Your completion has been recorded and is\nawaiting supervisor verification.",
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
          ),
        ));
  }
}
