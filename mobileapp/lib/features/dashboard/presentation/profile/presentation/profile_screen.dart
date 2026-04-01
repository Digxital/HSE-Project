import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/routes/go_router.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/presentation/widgets/custom_text.dart';
import 'package:aegix/features/auth/services/microsoft_auth_service.dart';
import 'package:aegix/shared/widgets/custom_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:go_router/go_router.dart';

import 'widget/action_card.dart';
import 'widget/profileOverview.dart';
import 'widget/profileTile.dart';
import 'widget/report_card.dart';
import '../providers/profile_providers.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _isLoggingOut = false;

  Future<void> _handleLogout() async {
    setState(() => _isLoggingOut = true);

    try {
      final shouldLogout = await showDialog<bool>(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Logout'),
          content: const Text('Are you sure you want to logout?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, true),
              style: TextButton.styleFrom(foregroundColor: Colors.red),
              child: const Text('Logout'),
            ),
          ],
        ),
      );

      if (shouldLogout != true) {
        setState(() => _isLoggingOut = false);
        return;
      }

      /// Microsoft logout
      try {
        final microsoftAuth = ref.read(microsoftAuthProvider);
        await microsoftAuth.signOut();
      } catch (e) {
        debugPrint('⚠️ Microsoft sign-out error (non-critical): $e');
      }

      /// App logout
      await ref.read(authControllerProvider.notifier).logout();

      if (context.mounted) {
        context.go(AppRoutes.login);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Logged out successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Logout failed: ${e.toString().replaceFirst('Exception: ', '')}',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoggingOut = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(profileProvider);
    final isNotificationEnabled = ref.watch(notificationProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        surfaceTintColor: Colors.white,
        title: CustomText(
          text: "Profile",
          fontSize: 16.sp,
          fontWeight: FontWeight.w400,
        ),
      ),
      body: SingleChildScrollView(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: 30.h),

                /// PROFILE OVERVIEW
                ProfileOverview(name: profile.name, email: profile.email),

                SizedBox(height: 35.h),

                /// REPORT CARD
                ReportCard(
                  title: "Reports Submitted",
                  description: "${profile.reports}",
                ),

                SizedBox(height: 15.h),

                Row(
                  children: [
                    ActionCard(
                      title: "Actions Assigned",
                      description: "${profile.actionsAssigned}",
                    ),
                    SizedBox(width: 15.h),
                    ActionCard(
                      title: "Actions Completed",
                      description: "${profile.actionsCompleted}",
                    ),
                  ],
                ),

                SizedBox(height: 20.h),

                /// MY PROFILE
                ProfileTile(
                  onTap: () => context.push(AppRoutes.editProfile),
                  icon: AppFilePaths.profile3,
                  text: "My Profile",
                ),

                SizedBox(height: 10.h),

                /// NOTIFICATION TOGGLE
                ProfileTile(
                  onTap: () {
                    ref.read(notificationProvider.notifier).state =
                        !isNotificationEnabled;
                  },
                  icon: AppFilePaths.notification3,
                  text: "Notifications",
                  isSwitch: true,
                  isSwitchOn: isNotificationEnabled,
                ),

                SizedBox(height: 10.h),

                /// LOGOUT
                ProfileTile(
                  onTap: _handleLogout,
                  icon: AppFilePaths.logout,
                  text: "Logout",
                  isLogout: true,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// Provider
final microsoftAuthProvider = Provider<MsalAuthService>((ref) {
  return MsalAuthService();
});
