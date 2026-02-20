import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/account_option.dart';
import 'package:invera_hse/component/custom_textfield.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/constant/extension.dart';
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
  final _formKey = GlobalKey<FormState>();

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _isChecked = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
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
              Form(
                key: _formKey,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CustomTextField(
                      controller: _emailController,
                      title: "Email Address",
                      textInputType: TextInputType.emailAddress,
                      hintText: "Enter email address",
                      validator: (val) {
                        if (!val!.isValidEmail) {
                          return 'Enter a valid email';
                        }
                        return null;
                      },
                    ),
                    addVerticalSpace(10),
                    CustomTextField(
                      controller: _passwordController,
                      title: "Password",
                      textInputType: TextInputType.text,
                      hintText: "Enter password",
                      obscureText: _obscurePassword,
                      suffixIcon: InkWell(
                          onTap: () => setState(() {
                                _obscurePassword = !_obscurePassword;
                              }),
                          child: Icon(
                              _obscurePassword
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                              color: AppColors.lightGrey)),
                      validator: (val) {
                        if (!val!.isValidPassword) {
                          return 'Enter a valid password';
                        }
                        return null;
                      },
                    ),
                  ],
                ),
              ),
              addVerticalSpace(15),
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
                            const Text(
                              "Proceed",
                              style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.white),
                            ),
                            addHorizontalSpace(5),
                            CommonImageView(
                              imagePath: AppFilePaths.arrowCircleRight,
                              height: 16,
                              width: 16,
                              fit: BoxFit.scaleDown,
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              addVerticalSpace(10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      InkWell(
                        onTap: () {
                          setState(() {
                            _isChecked = !_isChecked;
                          });
                        },
                        child: CommonImageView(
                          imagePath: _isChecked
                              ? AppFilePaths.checkedBox
                              : AppFilePaths.uncheckedBox,
                          height: 16,
                          width: 16,
                          fit: BoxFit.scaleDown,
                        ),
                      ),
                      addHorizontalSpace(5),
                      getText(
                          context: context,
                          title: "Remember me",
                          fontSize: 12,
                          weight: FontWeight.w400,
                          color: AppColors.black),
                    ],
                  ),
                  InkWell(
                    onTap: () {},
                    child: getText(
                        context: context,
                        title: "Forgot Password?",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.primaryColor),
                  ),
                ],
              ),
              addVerticalSpace(200),
              Center(
                child: AccountOption(
                    question: "Having trouble logging in?",
                    action: 'Contact your supervisor or admin.',
                    fontSize: 12,
                    onTap: () {}),
              ),
              addVerticalSpace(50)
            ],
          ),
        ));
  }
}
