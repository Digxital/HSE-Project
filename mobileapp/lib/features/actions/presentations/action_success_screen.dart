// lib/features/action/view/action_success_screen.dart

import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/get_text.dart';
import 'package:aegix/core/utils/screen_properties.dart';
import 'package:aegix/features/actions/providers/action_provider.dart';
import 'package:aegix/shared/widgets/custom_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class ActionSuccessScreen extends HookConsumerWidget {
  const ActionSuccessScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
                    color: AppColors.orange,
                  ),
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
                        AppColors.primaryColor,
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
      ),
    );
  }
}
