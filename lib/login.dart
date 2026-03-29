import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/account_option.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/services/microsoft_auth_service.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  bool _isLoading = false;

  Future<void> _signInWithMicrosoft() async {
    setState(() => _isLoading = true);
    try {
      final token = await MicrosoftAuthService.signIn();
      if (!mounted) return;

      if (token != null) {
        context.push(AppRoutes.bottomNav);
      }
      // If token is null the user cancelled — do nothing.
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Sign-in failed: ${e.toString()}'),
          backgroundColor: Colors.red.shade700,
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      getText(
                          context: context,
                          title: "Welcome to Aegix",
                          fontSize: 24,
                          weight: FontWeight.w700,
                          color: AppColors.black),
                      getText(
                          context: context,
                          title: "Report hazards and incidents safely.",
                          fontSize: 12,
                          weight: FontWeight.w400,
                          color: AppColors.black),
                      addVerticalSpace(25),
                      addVerticalSpace(20),
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
                              borderRadius: BorderRadius.circular(12),
                              onTap: _isLoading ? null : _signInWithMicrosoft,
                              child: Center(
                                child: _isLoading
                                    ? const SizedBox(
                                        height: 20,
                                        width: 20,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2,
                                        ),
                                      )
                                    : Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          CommonImageView(
                                            imagePath: AppFilePaths.windows,
                                            height: 16,
                                            width: 16,
                                            fit: BoxFit.scaleDown,
                                          ),
                                          addHorizontalSpace(8),
                                          const Text(
                                            "Continue with Microsoft",
                                            style: TextStyle(
                                                fontSize: 14,
                                                fontWeight: FontWeight.w500,
                                                color: Colors.white),
                                          ),
                                        ],
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
              // ================= Bottom Section =================
              Column(
                children: [
                  Align(
                    alignment: Alignment.bottomCenter,
                    child: Center(
                      child: AccountOption(
                          question: "Having trouble logging in?",
                          action: 'Contact your supervisor or admin.',
                          fontSize: 12,
                          onTap: () {}),
                    ),
                  ),
                  addVerticalSpace(30)
                ],
              ),
            ],
          ),
        ));
  }
}
