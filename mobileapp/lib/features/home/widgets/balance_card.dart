import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/features/auth/models/assets_model.dart';
import 'package:aegix/features/home/home_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

class BalanceCard extends StatefulWidget {
  final HomeState homeState;
  const BalanceCard({super.key, required this.homeState});

  @override
  State<BalanceCard> createState() => _BalanceCardState();
}

class _BalanceCardState extends State<BalanceCard> {
  bool _isVisible = true;

  void _toggleVisibility() {
    setState(() {
      _isVisible = !_isVisible;
    });
  }

  @override
  Widget build(BuildContext context) {
   
    final isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor = isDarkMode ? const Color(0xFF111319) : Colors.white;
    final textColor = isDarkMode ? Colors.white : Colors.black;
    final secondaryBg = isDarkMode ? const Color(0xFF2B2E36) : Colors.grey.shade200;
    final borderColor = isDarkMode ? const Color(0xFF2B2E36) : AppTheme.grayColor2;
    
    // ✅ FIXED: Get the numeric value properly
    final amount = widget.homeState.assets?.totalPropertyAmountNum ?? 0.0;
    final formatted = NumberFormat('#,##0.00', 'en_US').format(amount);
    final parts = formatted.split('.');

    return Container(
      padding: EdgeInsets.all(20.r),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(24.r),
        border: Border.all(color: borderColor),
        boxShadow: isDarkMode
            ? []
            : [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 10,
                  offset: const Offset(0, 5),
                )
              ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          /// Header Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: EdgeInsets.symmetric(horizontal: 14.w, vertical: 8.h),
                decoration: BoxDecoration(
                  color: secondaryBg,
                  borderRadius: BorderRadius.circular(30.r),
                ),
                child: Text(
                  "🇳🇬 NGN",
                  style: TextStyle(color: textColor),
                ),
              ),
              
            ],
          ),

          SizedBox(height: 10.h),

          /// Total Property Amount
          _isVisible
              ? RichText(
                  text: TextSpan(
                    style: GoogleFonts.inter(
                      fontSize: 35.sp,
                      fontWeight: FontWeight.w700,
                      letterSpacing: -0.5,
                      color: Theme.of(context).colorScheme.onBackground,
                    ),
                    children: [
                      const TextSpan(text: '₦ '),
                      TextSpan(text: parts[0]),
                      WidgetSpan(
                        alignment: PlaceholderAlignment.bottom,
                        child: Transform.translate(
                          offset: const Offset(0, -5),
                          child: Text(
                            '.${parts[1]}',
                            style: Theme.of(context).textTheme.displayLarge?.copyWith(
                              fontWeight: FontWeight.w600,
                              fontSize: 25.sp,
                              color: AppTheme.grayColor,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : Text(
                  '••••',
                  style: TextStyle(
                    fontSize: 20.sp,
                    fontWeight: FontWeight.w800,
                    color: textColor,
                  ),
                ),

          const SizedBox(height: 12),

          /// Wallet Balance
          Container(
            padding: EdgeInsets.symmetric(horizontal: 14.w, vertical: 6.h),
            decoration: BoxDecoration(
              color: isDarkMode ? Colors.blue.shade900 : Colors.blue.shade100,
              borderRadius: BorderRadius.circular(30.r),
            ),
            child: Text(
              _isVisible
                  ? 'Wallet Balance: ₦ ${widget.homeState.assets?.formattedWalletBalance ?? '0.00'}'
                  : 'Wallet Balance: ••••',
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                fontWeight: FontWeight.w500,
                color: isDarkMode ? Colors.white : Colors.blue.shade900,
              ),
            ),
          ),

          SizedBox(height: 20.h),

          /// Action Buttons
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isDarkMode ? Colors.purple.shade700 : Colors.deepPurple,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18.r),
                    ),
                    padding: EdgeInsets.symmetric(vertical: 10.h),
                    elevation: 0,
                  ),
                  onPressed: () {},
                  child: Text(
                    "Add",
                    style: Theme.of(context).textTheme.labelMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              SizedBox(width: 15.w),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: isDarkMode ? const Color(0xFF2A003C) : Colors.grey.shade300,
                    foregroundColor: isDarkMode ? Colors.white : Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18.r),
                    ),
                    padding: EdgeInsets.symmetric(vertical: 10.h),
                    elevation: 0,
                  ),
                  onPressed: () {},
                  child: Text(
                    "Send",
                    style: Theme.of(context).textTheme.labelMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                      color: isDarkMode ? Colors.white : Colors.black,
                    ),
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}