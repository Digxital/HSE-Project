import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/utils/validators.dart';
import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/controllers/auth_state.dart';
import 'package:aegix/features/auth/models/register_request_model.dart';
import 'package:aegix/features/auth/presentation/widgets/auth_button.dart';
import 'package:aegix/features/auth/presentation/widgets/auth_text_field.dart';
import 'package:aegix/features/auth/presentation/widgets/password_field.dart';
import 'package:aegix/shared/widgets/custom_loader.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';

class RegisterPage extends HookConsumerWidget {
  const RegisterPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fullNameController = useTextEditingController();
    final emailController = useTextEditingController();
    final phoneController = useTextEditingController();
    final passwordController = useTextEditingController();
    final confirmPasswordController = useTextEditingController();
    
    final formKey = useMemoized(() => GlobalKey<FormState>());
    final acceptTerms = useState(false);
    final obscurePassword = useState(true);
    final obscureConfirmPassword = useState(true);
    
    final authStateAsync = ref.watch(authControllerProvider);
    final authState = authStateAsync.valueOrNull;
    
    void handleRegister() async {
      if (formKey.currentState?.validate() ?? false) {
        if (!acceptTerms.value) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please accept terms and conditions'),
              backgroundColor: Colors.orange,
            ),
          );
          return;
        }
        
        final request = RegisterRequest(
          email: emailController.text.trim(),
          password: passwordController.text,
          fullName: fullNameController.text.trim(),
          phoneNumber: phoneController.text.trim(),
          acceptTerms: acceptTerms.value,
        );
        
        await ref.read(authControllerProvider.notifier).register(request);
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
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(error.toString()),
              backgroundColor: Colors.red,
            ),
          );
        },
        loading: () {},
      );
    });
    
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        title: const Text('Register'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 20),
                Text(
                  'Create Account',
                  style: Theme.of(context).textTheme.headlineMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Sign up to get started',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: Colors.grey,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                
                AuthTextField(
                  controller: fullNameController,
                  label: 'Full Name',
                  prefixIcon: Icons.person_outline,
                  validator: Validators.required,
                ),
                const SizedBox(height: 16),
                
                AuthTextField(
                  controller: emailController,
                  label: 'Email',
                  prefixIcon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  validator: Validators.email,
                ),
                const SizedBox(height: 16),
                
                AuthTextField(
                  controller: phoneController,
                  label: 'Phone Number',
                  prefixIcon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  validator: Validators.phone,
                ),
                const SizedBox(height: 16),
                
                PasswordField(
                  controller: passwordController,
                  label: 'Password',
                  obscureText: obscurePassword.value,
                  onToggleObscure: () => obscurePassword.value = !obscurePassword.value,
                  validator: Validators.password,
                ),
                const SizedBox(height: 16),
                
                PasswordField(
                  controller: confirmPasswordController,
                  label: 'Confirm Password',
                  obscureText: obscureConfirmPassword.value,
                  onToggleObscure: () => 
                      obscureConfirmPassword.value = !obscureConfirmPassword.value,
                  validator: (value) => Validators.matchPassword(
                    value, 
                    passwordController.text,
                  ),
                ),
                const SizedBox(height: 16),
                
                Row(
                  children: [
                    Checkbox(
                      value: acceptTerms.value,
                      onChanged: (value) => acceptTerms.value = value ?? false,
                    ),
                    Expanded(
                      child: RichText(
                        text: TextSpan(
                          text: 'I accept the ',
                          style: DefaultTextStyle.of(context).style,
                          children: [
                            TextSpan(
                              text: 'Terms and Conditions',
                              style: const TextStyle(
                                color: Colors.blue,
                                fontWeight: FontWeight.bold,
                              ),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () {
                                  // Navigate to terms page
                                  // context.go(AppRoutes.terms);
                                },
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Fixed: Use is AuthStateLoading check instead of isLoading getter
                authState is AuthStateLoading
                    ? const CustomLoader()
                    : AuthButton(
                        onPressed: handleRegister,
                        text: 'Register',
                      ),
                const SizedBox(height: 16),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Already have an account? '),
                    TextButton(
                      onPressed: () => context.go(AppRoutes.login),
                      child: const Text('Login'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}