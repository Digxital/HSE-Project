import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/features/auth/models/login/login_form_model.dart';
import 'package:aegix/features/auth/presentation/viewmodels/login_viewmodel.dart';
import 'package:aegix/features/auth/providers/login_providers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';


class LoginButton extends ConsumerWidget {
  final VoidCallback onPressed;
  final bool isLoading;

  const LoginButton({
    super.key,
    required this.onPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isFormValid = ref.watch(isFormValidProvider);

    return SizedBox(
      width: double.infinity,
      height: 44.h,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12.r),
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
            onTap: (isFormValid && !isLoading) ? onPressed : null,
            child: Center(
              child: isLoading
                  ? SizedBox(
                      height: 20.w,
                      width: 20.w,
                      child: const CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Proceed",
                          style: TextStyle(
                            fontSize: 14.sp,
                            fontWeight: FontWeight.w500,
                            color: isFormValid 
                                ? Colors.white 
                                : Colors.white54,
                          ),
                        ),
                        SizedBox(width: 5.w),
                        Icon(
                          Icons.arrow_forward,
                          size: 16.w,
                          color: isFormValid ? Colors.white : Colors.white54,
                        ),
                      ],
                    ),
            ),
          ),
        ),
      ),
    );
  }
}