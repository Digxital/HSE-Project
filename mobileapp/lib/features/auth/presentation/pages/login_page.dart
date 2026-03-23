import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/controllers/auth_state.dart';
import 'package:aegix/features/auth/models/login/login_request_model.dart';
import 'package:aegix/features/auth/presentation/widgets/custom_text.dart';
import 'package:aegix/features/auth/presentation/widgets/login_button.dart';
import 'package:aegix/features/auth/presentation/widgets/login_form.dart';
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
    final isLoggingIn = useState(false);
    
    void handleLogin() async {
      if (formKey.currentState?.validate() ?? false) {
        isLoggingIn.value = true;
        
        try {
          final request = LoginRequestModel(
            email: emailController.text.trim(),
            password: passwordController.text,
            rememberMe: false,
          );
           
          await ref.read(authControllerProvider.notifier).login(request);
        } catch (e) {
          // Error is handled by listener
        } finally {
          isLoggingIn.value = false;
        }
      }
    }
    
    // FIXED: Properly handle Freezed union types
    ref.listen(authControllerProvider, (previous, next) {
      next.when(
        data: (state) {
          // Use map/when pattern for Freezed union
          state.when(
            initial: () {},
            loading: () {},
            authenticated: (user) {
              context.go(AppRoutes.dashboard);
            },
            unauthenticated: () {},
            error: (message) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(message),
                  backgroundColor: Colors.red,
                ),
              );
            },
          );
        },
        error: (error, _) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error.toString()),
              backgroundColor: Colors.red,
            ),
          );
        },
        loading: () {
          // Optional: Show loading indicator
        },
      );
    });
    
    return Scaffold(
      appBar: AppBar(
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
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 10.h),
                  // Welcome Text
                  CustomText(
                    text: "Welcome to Aegix",
                    fontSize: 24.sp,
                    fontWeight: FontWeight.w700,
                    color: AppColors.blackColor,
                  ),
                  CustomText(
                    text: "Report hazards and incidents safely.",
                    fontSize: 12.sp,
                    fontWeight: FontWeight.w400,
                    color: AppColors.blackColor,
                  ),
                  SizedBox(height: 25.h),

                   LoginForm(),
                  
                  SizedBox(height: 15.h),
                  
                  // Login Button
                  LoginButton(
                    onPressed: handleLogin,
                    isLoading: isLoggingIn.value,
                  ),
                  
                  SizedBox(height: 10.h),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}