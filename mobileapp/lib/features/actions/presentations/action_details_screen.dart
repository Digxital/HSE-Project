// lib/features/action/view/action_details_screen.dart

import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/get_container.dart';
import 'package:aegix/core/utils/get_text.dart';
import 'package:aegix/core/utils/screen_properties.dart';
import 'package:aegix/features/auth/presentation/widgets/custom_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import '../models/action_model.dart';

class ActionsDetails extends HookConsumerWidget {
  final ActionReport report;

  const ActionsDetails({super.key, required this.report});

  static _StatusStyle _styleFor(String status) {
    switch (status.toLowerCase()) {
      case 'open':
        return _StatusStyle(
          label: 'Open',
          color: AppColors.red,
          bgColor: AppColors.orange2,
        );
      case 'in_progress':
        return _StatusStyle(
          label: 'In Progress',
          color: AppColors.orange,
          bgColor: AppColors.lightOrange4,
        );
      case 'completed':
        return _StatusStyle(
          label: 'Completed',
          color: AppColors.green,
          bgColor: AppColors.lightGreen,
        );
      default:
        return _StatusStyle(
          label: status,
          color: AppColors.grey4,
          bgColor: AppColors.lightGrey5,
        );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final style = _styleFor(report.status);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        surfaceTintColor: Colors.white,
        title: Text('Action Details'),
      ),
      body: SingleChildScrollView(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                addVerticalSpace(20),

                getText(
                  context: context,
                  title: report.title,
                  fontSize: 20,
                  weight: FontWeight.w500,
                ),
                addVerticalSpace(5),

                getContainer(
                  context: context,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 10,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  decorationColor: style.bgColor,
                  child: getText(
                    context: context,
                    title: style.label,
                    color: style.color,
                  ),
                ),

                SizedBox(height: 40.h),

                // ── Details card ────────────────────────────────────────
                _DetailsCard(report: report),

                SizedBox(height: 30.h),

                Row(
                  children: [
                    CustomText(
                      text: "View related report",
                      fontSize: 12.sp,
                      fontWeight: FontWeight.w400,
                      decoration: TextDecoration.underline,
                    ),
                    SizedBox(height: 10.h),
                    CommonImageView(
                      imagePath: AppFilePaths.arrowForwardRound,
                      height: 12,
                      width: 12,
                      fit: BoxFit.scaleDown,
                    ),
                  ],
                ),
                const Divider(height: 70, color: AppColors.lightGrey6),
                CustomText(
                  text: "Description",
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w500,
                ),
                SizedBox(height: 10.h),
                getContainer(
                  context: context,
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 25,
                    vertical: 15,
                  ),
                  borderRadius: BorderRadius.circular(14),
                  decorationColor: AppColors.lightOrange6,
                  child: CustomText(
                    text: report.description,
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                SizedBox(height: 50.h),
                // ── Start Action button ─────────────────────────────────
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      gradient: const LinearGradient(
                        colors: [
                          AppColors.secondaryColor,
                          AppColors.primaryColor,
                        ],
                      ),
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        // onTap: () => context.push(
                        //   AppRoutes.startActionDetails,
                        //   extra: {'report': report},
                        // ),
                        child: const Center(
                          child: Text(
                            "Start Action",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                SizedBox(height: 20.h),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Details card ─────────────────────────────────────────────────────────────

class _DetailsCard extends StatelessWidget {
  final ActionReport report;
  const _DetailsCard({required this.report});

  String _formatDate(String iso) {
    try {
      final dt = DateTime.parse(iso);
      const months = [
        '',
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return '${months[dt.month]} ${dt.day}, ${dt.year}';
    } catch (_) {
      return iso;
    }
  }

  @override
  Widget build(BuildContext context) {
    return getContainer(
      context: context,
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 25),
      borderRadius: BorderRadius.circular(12),
      decorationColor: AppColors.lightOrange6,
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _InfoColumn(
                label: "Location",
                value: report.location.specificArea,
              ),
              _InfoColumn(label: "Assigned By", value: report.reportedBy.role),
            ],
          ),
          SizedBox(height: 30.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _InfoColumn(
                label: "Date Assigned",
                value: _formatDate(report.createdAt),
              ),
              _InfoColumn(
                label: "Due Date",
                value: _formatDate(report.eventDate),
                valueColor: AppColors.red,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InfoColumn extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;
  const _InfoColumn({
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomText(
          text: label,
          fontSize: 12.sp,
          fontWeight: FontWeight.w400,
          color: AppColors.grey4,
        ),
        SizedBox(height: 5.h),
        SizedBox(
          width: 150.w,
          child: CustomText(
            text: value,
            fontSize: 14.sp,
            fontWeight: FontWeight.w400,
            color: valueColor,
          ),
        ),
      ],
    );
  }
}

class _StatusStyle {
  final String label;
  final Color color;
  final Color bgColor;
  const _StatusStyle({
    required this.label,
    required this.color,
    required this.bgColor,
  });
}
