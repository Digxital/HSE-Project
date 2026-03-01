import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/core/utils/validators.dart';
import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/controllers/auth_state.dart';
import 'package:aegix/features/auth/models/login_request_model.dart';
import 'package:aegix/features/auth/presentation/widgets/auth_button.dart';
import 'package:aegix/features/auth/presentation/widgets/auth_text_field.dart';
import 'package:aegix/features/auth/presentation/widgets/password_field.dart';
import 'package:aegix/shared/widgets/custom_loader.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends HookConsumerWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final emailController = useTextEditingController();
    final passwordController = useTextEditingController();
    final formKey = useMemoized(() => GlobalKey<FormState>());
    final obscurePassword = useState(true);
    final isLoggingIn = useState(false); // 👈 Add local loading state
    
    void handleLogin() async {
      if (formKey.currentState?.validate() ?? false) {
        // 👇 Set loading to true
        isLoggingIn.value = true;
        
        try {
          final request = LoginRequest(
            email: emailController.text.trim(),
            password: passwordController.text,
          );
          
          await ref.read(authControllerProvider.notifier).login(request);
        } catch (e) {
          // Error is hand led by listener
        } finally {
          // 👇 Set loading to false after completion (success or error)
          isLoggingIn.value = false;
        }
      }
    }
    
    ref.listen(authControllerProvider, (previous, next) {
      next.when(
        data: (state) {
          if (state is AuthStateAuthenticated) {
            context.go(AppRoutes.home);
          }
        },
        error: (error, _) {
          // Show error message
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error.toString()),
              backgroundColor: Colors.red,
            ),
          );
        },
        loading: () {
          // This will be called when auth controller is in loading state
        },
      );
    });
    
    return Scaffold(
      // backgroundColor: Colors.white,
      appBar: AppBar(
        // backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, size: 16.sp, color: Colors.black),
          onPressed: () => context.pop(),
        ),
      ),
      body: GestureDetector(
        onTap: () => FocusScope.of(context).unfocus(),
        child: SafeArea(
          child: SingleChildScrollView(
            keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
            padding: EdgeInsets.all(24.w),
            child: Form(
              key: formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 10.h),
                  
                  Text(
                    'Welcome Back!',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 28.sp,
                      // color: Colors.black,
                    ),
                  ),
                  SizedBox(height: 8.h),
                  
                  RichText(
                    text: TextSpan(
                      text: 'Put in your account details to ',
                      style: TextStyle(fontSize: 14.sp, color: AppTheme.grayColor),
                      children: [
                        TextSpan(
                          text: 'get started',
                          // style: TextStyle(color: Colors.black, fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 30.h),
                  
                  AuthTextField(
                    controller: emailController,
                    label: 'Email',
                    keyboardType: TextInputType.emailAddress,
                    validator: Validators.email,
                  ),
                  SizedBox(height: 16.h),
                  
                  PasswordField(
                    controller: passwordController,
                    label: 'Password',
                    obscureText: obscurePassword.value,
                    onToggleObscure: () => obscurePassword.value = !obscurePassword.value,
                    validator: Validators.password,
                  ),
                  SizedBox(height: 10.h),
                  
                  Align(
                    alignment: Alignment.topLeft,
                    child: TextButton(
                      onPressed: () {
                        // Navigate to forgot password
                      },
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: Text(
                        'Forgot your password?',
                      ),
                    ),
                  ),
                  SizedBox(height: 24.h),
                  
                  // 👇 Use local loading state for button
                  isLoggingIn.value
                      ? const CustomLoader()
                      : AuthButton(
                          onPressed: handleLogin,
                          text: 'Continue',
                        ),
                  
                  SizedBox(height: 250.h),
                  
                  // Register row at the bottom
                  Padding(
                    padding: EdgeInsets.only(bottom: 20.h),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "New to aegix? ",
                        ),
                        TextButton(
                          onPressed: () => context.push(AppRoutes.register),
                          style: TextButton.styleFrom(
                            padding: EdgeInsets.zero,
                            minimumSize: Size.zero,
                            tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          ),
                          child: Text(
                            'Create an account',
                          ),
                        ),
                      ],
                    ),
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