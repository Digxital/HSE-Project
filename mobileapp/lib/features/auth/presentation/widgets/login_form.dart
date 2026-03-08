import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/validators.dart';
import 'package:aegix/features/auth/models/login/login_request_model.dart';
import 'package:aegix/features/auth/providers/login_providers.dart';
import 'package:aegix/features/auth/services/microsoft_auth_service.dart'; 
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../viewmodels/login_viewmodel.dart';
import 'custom_textfield.dart';

class LoginForm extends HookConsumerWidget {
  const LoginForm({super.key}); // Added const constructor

  // Microsoft Auth Service provider
  static final microsoftAuthProvider = Provider<MsalAuthService>((ref) {
    return MsalAuthService();
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Create controllers with hooks - they will be automatically disposed
    final emailController = useTextEditingController();
    final passwordController = useTextEditingController();
    final isMicrosoftLoggingIn = useState(false);
    
    final viewModel = LoginViewModel(ref);
    final formKey = ref.watch(loginFormKeyProvider);
    final isPasswordVisible = ref.watch(passwordVisibilityProvider);
    final microsoftAuth = ref.watch(microsoftAuthProvider);

    // Sync controller changes with ViewModel
    useEffect(() {
      void onEmailChanged() {
        viewModel.updateEmail(emailController.text);
      }
      
      void onPasswordChanged() {
        viewModel.updatePassword(passwordController.text);
      }
      
      emailController.addListener(onEmailChanged);
      passwordController.addListener(onPasswordChanged);
      
      return () {
        emailController.removeListener(onEmailChanged);
        passwordController.removeListener(onPasswordChanged);
      };
    }, [emailController, passwordController, viewModel]);

    Future<void> handleMicrosoftLogin() async {
      try {
        isMicrosoftLoggingIn.value = true;
        
        final user = await microsoftAuth.signIn(); 
        debugPrint('✅ Microsoft auth successful for: ${user.email}');
        
        final microsoftLoginRequest = LoginRequestModel(
          email: user.email,
          password: 'Password123',
          rememberMe: true,
          provider: 'microsoft',
          providerData: user.providerData,
        );  
        
        await viewModel.onMicrosoftLogin(microsoftLoginRequest);
        
      } catch (e) {
        // SIMPLE FIX: Just remove "Exception: " from the string
        String errorMessage = e.toString().replaceFirst('Exception: ', '');
        
        debugPrint('❌ Microsoft login failed: $errorMessage');
        
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(errorMessage),
              backgroundColor: Colors.red,
            ),
          );
        }
      } finally {
        if (context.mounted) {
          isMicrosoftLoggingIn.value = false;
        }
      }
    }

    return Form(
      key: formKey,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CustomTextField(
            controller: emailController,
            title: "Email Address",
            textInputType: TextInputType.emailAddress,
            hintText: "Enter email address",
            validator: (val) {
              if (val == null || val.isEmpty) {
                return 'Email is required';
              }
              if (!val.isValidEmail) {
                return 'Enter a valid email';
              }
              return null;
            },
          ),
          const SizedBox(height: 10),
          CustomTextField(
            controller: passwordController,
            title: "Password",
            textInputType: TextInputType.text,
            hintText: "Enter password",
            obscureText: isPasswordVisible,
            suffixIcon: InkWell(
              onTap: viewModel.togglePasswordVisibility,
              child: Icon(
                isPasswordVisible
                    ? Icons.visibility_off_outlined
                    : Icons.visibility_outlined,
                color: AppColors.lightGreyColor,
              ),
            ),
            validator: (val) {
              if (val == null || val.isEmpty) {
                return 'Password is required';
              }
              if (!val.isValidPassword) {
                return 'Password must be at least 6 characters';
              }
              return null;
            },
          ),
          
          const SizedBox(height: 20),
          
          // Divider with "OR"
          Row(
            children: [
              Expanded(child: Divider(color: Colors.grey.shade300)),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Text(
                  'OR',
                  style: TextStyle(
                    color: Colors.grey.shade600,
                    fontSize: 14.sp,
                  ),
                ),
              ),
              Expanded(child: Divider(color: Colors.grey.shade300)),
            ],
          ),
          
          const SizedBox(height: 20),
          
          // Microsoft Login Button
          SizedBox(
            width: double.infinity,
            height: 44.h,
            child: OutlinedButton(
              onPressed: isMicrosoftLoggingIn.value ? null : handleMicrosoftLogin,
              style: OutlinedButton.styleFrom(
                side: BorderSide(color: Colors.grey.shade300),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8.r),
                ),
              ),
              child: isMicrosoftLoggingIn.value
                  ? SizedBox(
                      height: 20.w,
                      width: 20.w,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.primaryColor,
                      ),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Microsoft logo
                        Container(
                          width: 24.w,
                          height: 24.h,
                          decoration: const BoxDecoration(
                            image: DecorationImage(
                              image: AssetImage('assets/icon/microsoft_logo.png'),
                              fit: BoxFit.contain,
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Continue with Microsoft',
                          style: TextStyle(
                            fontSize: 16.sp,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ],
      ),
    );
  }
}