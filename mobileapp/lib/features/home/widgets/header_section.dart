import 'package:cached_network_image/cached_network_image.dart';
import 'package:aegix/features/auth/models/user_model.dart';
import 'package:aegix/features/home/home_provider.dart';
import 'package:aegix/shared/widgets/theme_switch_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';


// Alternative: More Minimal Version (Unchanged but also fixed)
class HeaderSection extends StatelessWidget {
  final HomeState homeState;
  final UserModel? user;
  
  const HeaderSection({
    super.key,
    required this.homeState,
    this.user,
  });

  @override
  Widget build(BuildContext context) {
     final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 0.w, vertical: 8.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Profile Avatar with Gradient
              Container(
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: const LinearGradient(
                    colors: [Color(0xFF8008E4), Color(0xFFA259FF)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: CircleAvatar(
                  radius: 22.r,
                  backgroundColor: Colors.transparent,
                  child: CircleAvatar(
                    radius: 20.r,
                    backgroundColor: isDarkMode ? Colors.grey[800] : Colors.grey[200],
                    backgroundImage: user?.profileImage != null
                        ? CachedNetworkImageProvider(
                          'https://aegix.com/${user!.profileImage!}')
                        : null,
                    child: user?.profileImage == null
                        ? ClipOval(
                            child: Image.asset(
                              'assets/images/avater.jpg',
                              width: 40.r,
                              height: 40.r,
                              fit: BoxFit.cover,
                            ),
                          )
                        : null,
                  ),
                ),
              ),
              SizedBox(width: 10.w),
              // Left: Greeting
              Expanded( // 👈 Added Expanded
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          "Hello,",
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            // fontSize: 14.sp,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          " ${user?.fullName?.split(' ').first ?? 'User'}",
                          style: Theme.of(context).textTheme.displaySmall?.copyWith(
                            fontWeight: FontWeight.w600,
                            fontSize: 14.sp,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                    Text(
                      "@",
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: Colors.grey[600],
                        fontSize: 12.sp,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              
              // Right: Actions
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const ThemeSwitchButton(),
                  SizedBox(width: 8.w),
                  _buildNotificationIcon(context),
                ],
              ),
             
            ],
          ),
          const SizedBox(height: 8),
          _buildRecipient(context),
        ],
      ),
    );
  }

  Widget _buildRecipient(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    // Extract colors for better maintainability
    final Color primaryOrange = isDarkMode ? Colors.orange[300]! : Colors.orange[700]!;
    final Color bgColor = isDarkMode ? const Color(0xFF2A1500) : const Color(0xFFFFF1E0);
    final Color borderColor = isDarkMode 
        ? const Color(0xFFCC9933).withOpacity(0.3)
        : const Color(0xFFCC9933).withOpacity(0.2);
    
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 1.h),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20.r),
        color: bgColor,
        border: Border.all(color: borderColor, width: 1),
      ),
      child: InkWell(  // 👈 Make it tappable
        onTap: () => _copyRecipientId(context),
        borderRadius: BorderRadius.circular(20.r),
        child: Padding(
          padding: EdgeInsets.all(2.r), // Slight padding for tap area
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.copy,
                size: 14.sp,
                color: primaryOrange,
              ),
              SizedBox(width: 6.w),
              Flexible(  // 👈 Prevent overflow on small screens
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Recipient ID",
                      style: TextStyle(
                        color: primaryOrange.withOpacity(0.8), // Slightly transparent
                        fontWeight: FontWeight.w500,
                        fontSize: 10.sp,
                        letterSpacing: 0.3,
                      ),
                    ),
                    Text(
                      user?.recipientId?.isNotEmpty == true 
                          ? _formatRecipientId(user!.recipientId!) // Format ID
                          : 'N/A',
                      style: TextStyle(
                        color: primaryOrange,
                        fontWeight: FontWeight.w700,
                        fontSize: 14.sp,
                        letterSpacing: 0.5,
                      ),
                      overflow: TextOverflow.ellipsis,
                      maxLines: 1,
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

  // Helper method to format recipient ID (e.g., aegix-39554-NFBPGSYIZ3)
  String _formatRecipientId(String id) {
    if (id.length > 15) {
      // Show first 8 and last 4 characters
      // return '${id.substring(0, 25)}...${id.substring(id.length - 4)}';
      return '${id}';
    }
    return id;
  }

  // Copy functionality
  void _copyRecipientId(BuildContext context) {
    if (user?.recipientId != null) {
      Clipboard.setData(ClipboardData(text: user!.recipientId!));
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Recipient ID copied to clipboard'),
          duration: const Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.r),
          ),
        ),
      );
    }
  }

  Widget _buildNotificationIcon(BuildContext context) {
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    
    return Stack(
      clipBehavior: Clip.none,
      children: [
        Icon(
          FontAwesomeIcons.solidBell,
          size: 18.sp,
          color: isDarkMode ? Colors.white70 : Colors.black,
        ),
        if (homeState.hasNotifications)
          Positioned(
            left: 8,
            top: -4,
            child: Container(
              padding: EdgeInsets.all(2.r),
              decoration: const BoxDecoration(
                color: Colors.red,
                shape: BoxShape.circle,
              ),
              constraints: BoxConstraints(
                minWidth: 14.r,
                minHeight: 14.r,
              ),
              child: Text(
                '${homeState.unreadNotificationsCount}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 8,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }
}