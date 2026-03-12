import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/account_option.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
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
                      // Form(
                      //   key: _formKey,
                      //   child: Column(
                      //     mainAxisAlignment: MainAxisAlignment.center,
                      //     children: [
                      //       CustomTextField(
                      //         controller: _emailController,
                      //         title: "Email Address",
                      //         textInputType: TextInputType.emailAddress,
                      //         hintText: "Enter email address",
                      //         validator: (val) {
                      //           if (!val!.isValidEmail) {
                      //             return 'Enter a valid email';
                      //           }
                      //           return null;
                      //         },
                      //       ),
                      //       addVerticalSpace(10),
                      //       CustomTextField(
                      //         controller: _passwordController,
                      //         title: "Password",
                      //         textInputType: TextInputType.text,
                      //         hintText: "Enter password",
                      //         obscureText: _obscurePassword,
                      //         suffixIcon: InkWell(
                      //             onTap: () => setState(() {
                      //                   _obscurePassword = !_obscurePassword;
                      //                 }),
                      //             child: Icon(
                      //                 _obscurePassword
                      //                     ? Icons.visibility_off_outlined
                      //                     : Icons.visibility_outlined,
                      //                 color: AppColors.lightGrey)),
                      //         validator: (val) {
                      //           if (!val!.isValidPassword) {
                      //             return 'Enter a valid password';
                      //           }
                      //           return null;
                      //         },
                      //       ),
                      //     ],
                      //   ),
                      // ),
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
                              onTap: () {
                                context.push(AppRoutes.bottomNav);
                              },
                              child: Center(
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
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
