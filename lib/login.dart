import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/api/auth_service.dart';
import 'package:invera_hse/component/account_option.dart';
import 'package:invera_hse/component/custom_flush_bar.dart';
import 'package:invera_hse/component/custom_textfield.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/api/microsoft_auth_service.dart';
import 'package:invera_hse/constant/extension.dart';
import 'package:invera_hse/error_model/error_model/auth_error.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';
import 'package:invera_hse/view_model/login_view_model.dart';
import 'package:modal_progress_hud_nsn/modal_progress_hud_nsn.dart';
import 'package:provider/provider.dart';

import 'component/loader.dart';

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
      print("token: $token");
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

  final CustomFlushBar customFlushBar = CustomFlushBar();

  final _formKey = GlobalKey<FormState>();

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    final loginViewModel = Provider.of<LoginViewModel>(context);
    return Scaffold(
        backgroundColor: Theme.of(context).colorScheme.surface,
        body: ModalProgressHUD(
          inAsyncCall: loginViewModel.loading,
          progressIndicator: const CustomLoader(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Form(
                    key: _formKey,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        getText(
                            context: context,
                            title: "Welcome to Aegix",
                            fontSize: 24,
                            weight: FontWeight.w700,
                            color:
                                Theme.of(context).textTheme.bodyMedium?.color),
                        getText(
                            context: context,
                            title: "Report hazards and incidents safely.",
                            fontSize: 12,
                            weight: FontWeight.w400,
                            color:
                                Theme.of(context).textTheme.bodyMedium?.color),
                        addVerticalSpace(55),
                        CustomTextField(
                          controller: _emailController,
                          title: "Email",
                          textInputType: TextInputType.emailAddress,
                          hintText: "john@inveraenergy.com",
                          hintTextColor:
                              Theme.of(context).textTheme.bodyLarge?.color,
                          validator: (val) {
                            if (!val!.isValidEmail) {
                              return 'Enter a valid email';
                            }
                            return null;
                          },
                        ),
                        addVerticalSpace(20),
                        CustomTextField(
                          controller: _passwordController,
                          title: "Password",
                          textInputType: TextInputType.text,
                          hintText: "••••••••",
                          obscureText: _obscurePassword,
                          suffixIcon: InkWell(
                              onTap: () => setState(() {
                                    _obscurePassword = !_obscurePassword;
                                  }),
                              child: Icon(
                                  _obscurePassword
                                      ? Icons.visibility_off_outlined
                                      : Icons.visibility_outlined,
                                  color: AppColors.grey3)),
                          hintTextColor:
                              Theme.of(context).textTheme.bodyLarge?.color,
                          validator: (val) {
                            if (val!.length < 6) {
                              return 'Password must be at least 6 characters';
                            }
                            return null;
                          },
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
                                )),
                            child: Material(
                              color: Colors.transparent,
                              child: InkWell(
                                borderRadius: BorderRadius.circular(12),
                                // onTap: _isLoading ? null : _signInWithMicrosoft,
                                onTap: () {
                                  bool isValidate =
                                      _formKey.currentState!.validate();
                                  if (isValidate) {
                                    submitLoginData(context);
                                  }
                                },
                                child: const Center(
                                  child:
                                      // _isLoading
                                      //     ? const SizedBox(
                                      //         height: 20,
                                      //         width: 20,
                                      //         child: CircularProgressIndicator(
                                      //           color: Colors.white,
                                      //           strokeWidth: 2,
                                      //         ),
                                      //       )
                                      //     : const
                                      Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      // CommonImageView(
                                      //   imagePath: AppFilePaths.windows,
                                      //   height: 16,
                                      //   width: 16,
                                      //   fit: BoxFit.scaleDown,
                                      // ),
                                      // addHorizontalSpace(8),
                                      Text(
                                        // "Continue with Microsoft",
                                        "Login",
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
          ),
        ));
  }

  void submitLoginData(BuildContext context, {email, password}) async {
    var data = {
      "email": _emailController.text == "" ? email : _emailController.text,
      "password":
          _passwordController.text == "" ? password : _passwordController.text,
    };
    print("data: $data");
    final loginViewModel = Provider.of<LoginViewModel>(context, listen: false);
    clearAuthErrorMessage(loginViewModel);
    await loginViewModel.loginUser(data);

    Object? errorMessage = loginViewModel.authError?.responseMessage;
    print("login-error-message: $errorMessage");
    if (errorMessage != null) {
      customFlushBar.showErrorFlushBar(
          title: 'Error occurred', body: errorMessage, context: context);
    } else {
      print(
          "check-firstName: ${loginViewModel.loginModel!.data.user.firstName}");
      if (loginViewModel.loginModel!.data.user.firstName == null) {
        String? token = loginViewModel.loginModel!.data.token;
        await AuthService.storeAccessToken(token);
        await AuthService.storeUserId(loginViewModel.loginModel!.data.user.id);
        await AuthService.storeUserEmail(
            loginViewModel.loginModel?.data.user.email);
        return;
      }
      String? token = loginViewModel.loginModel!.data.token;
      await AuthService.storeAccessToken(token);
      await AuthService.storeUserId(loginViewModel.loginModel!.data.user.id);
      await AuthService.storeUserEmail(
          loginViewModel.loginModel?.data.user.email);

      context.go(AppRoutes.bottomNav);
    }

    clearAuthErrorMessage(loginViewModel);
  }

  clearAuthErrorMessage(authViewModel) {
    AuthError authError = AuthError(responseMessage: null);
    authViewModel.setAuthError(authError);
    authViewModel.authError;
  }
}
