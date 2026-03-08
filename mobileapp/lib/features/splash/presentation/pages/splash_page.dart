import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/features/splash/splash_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';

// Add this class before SplashPage
class AnimatedTagline extends StatefulWidget {
  final String text;
  final TextStyle style;

  const AnimatedTagline({
    super.key,
    required this.text,
    required this.style,
  });

  @override
  State<AnimatedTagline> createState() => _AnimatedTaglineState();
}

class _AnimatedTaglineState extends State<AnimatedTagline>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..forward();

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );

    _slideAnimation = Tween<double>(begin: 20.0, end: 0.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _fadeAnimation.value,
          child: Transform.translate(
            offset: Offset(0, _slideAnimation.value),
            child: child,
          ),
        );
      },
      child: Text(
        widget.text,
        style: widget.style,
        textAlign: TextAlign.center,
      ),
    );
  }
}

class SplashPage extends HookConsumerWidget {
  const SplashPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final splashState = ref.watch(splashProvider);
    final navigationDestination = ref.watch(splashNavigationDestinationProvider);
    
    // Handle navigation when ready
    useEffect(() {
      if (navigationDestination != null) {
        Future.delayed(const Duration(milliseconds: 2000), () {
          if (context.mounted) {
            context.go(navigationDestination);
          }
        });
      }
      return null;
    }, [navigationDestination]);
    
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo with fade-in animation
              Image.asset('assets/icon/icon.png'),
              
              // const SizedBox(height: 24.h),
              
              // Animated tagline - Option 6 integrated
              // AnimatedTagline(
              //   text: 'Digitalize your assets',
              //   style: TextStyle(
              //     fontSize: 16.sp,
              //     fontWeight: FontWeight.w500,
              //     color: AppTheme.primaryColor,
              //     letterSpacing: 0.5,
              //   ),
              // ),
              
              const SizedBox(height: 48),
              
              // Loading indicator based on state
              _buildLoadingIndicator(context, splashState),
              
              // Error handling
              if (splashState.status == SplashStatus.error)
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.error_outline,
                        color: Colors.red,
                        size: 48,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        splashState.errorMessage ?? 'Something went wrong',
                        style: const TextStyle(color: Colors.red),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () => ref.read(splashProvider.notifier).retry(),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primaryColor,
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

 

  Widget _buildLoadingIndicator(BuildContext context, SplashState state) {
    switch (state.status) {
      case SplashStatus.loading:
      case SplashStatus.checkingOnboarding:
      case SplashStatus.checkingAuth:
        return Column(
          children: [
            const CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(AppColors.primaryColor),
            ),
            const SizedBox(height: 16),
            Text(
              _getStatusMessage(state.status),
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 14.sp,
              ),
            ),
          ],
        );
        
      case SplashStatus.completed:
        return const SizedBox.shrink();
        
      case SplashStatus.initial:
      case SplashStatus.error:
        return const SizedBox.shrink();
    }
  }

  String _getStatusMessage(SplashStatus status) {
    switch (status) {
      case SplashStatus.loading:
        return 'Initializing...';
      case SplashStatus.checkingOnboarding:
        return 'Checking onboarding...';
      case SplashStatus.checkingAuth:
        return 'Verifying your session...';
      default:
        return '';
    }
  }
}