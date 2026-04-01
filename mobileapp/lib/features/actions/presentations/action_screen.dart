// lib/features/action/view/action_screen.dart

import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/custom_text.dart';
import 'package:aegix/core/utils/get_container.dart';
import 'package:aegix/core/utils/get_text.dart';
import 'package:aegix/core/utils/screen_properties.dart';
import 'package:aegix/features/actions/providers/action_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../models/action_model.dart';

class ActionScreen extends HookConsumerWidget {
  const ActionScreen({super.key});

  static const _tabs = ["All", "Open", "In Progress", "Completed"];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final selectedIndex = ref.watch(actionTabIndexProvider);
    final reportsAsync = ref.watch(actionReportsProvider);
    final filteredReports = ref.watch(filteredActionReportsProvider);

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        surfaceTintColor: Colors.white,
        title: Text(
          'Action',
          style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w500),
        ),
      ),
      body: SingleChildScrollView(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                addVerticalSpace(20),

                // ── Tabs + Filter row ──────────────────────────────────────
                Row(
                  children: [
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: List.generate(_tabs.length, (index) {
                            final isSelected = selectedIndex == index;
                            return GestureDetector(
                              onTap: () =>
                                  ref
                                          .read(actionTabIndexProvider.notifier)
                                          .state =
                                      index,
                              child: Container(
                                padding: EdgeInsets.symmetric(
                                  horizontal: 14.w,
                                  vertical: 10.h,
                                ),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppColors.lightOrange
                                      : Colors.transparent,
                                  borderRadius: const BorderRadius.only(
                                    topLeft: Radius.circular(12),
                                    topRight: Radius.circular(12),
                                  ),
                                  border: Border(
                                    bottom: BorderSide(
                                      color: isSelected
                                          ? AppColors.secondaryColor
                                          : AppColors.grey7,
                                    ),
                                  ),
                                ),
                                child: getText(
                                  context: context,
                                  title: _tabs[index],
                                  fontSize: 14.sp,
                                  weight: FontWeight.w500,
                                  color: isSelected
                                      ? AppColors.secondaryColor
                                      : AppColors.grey8,
                                ),
                              ),
                            );
                          }),
                        ),
                      ),
                    ),
                    // Filter button
                    InkWell(
                      onTap: () => context.push(AppRoutes.filterScreen),
                      child: Container(
                        height: 30.h,
                        width: 30.w,
                        decoration: BoxDecoration(
                          color: AppColors.lightOrange5,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.neutralDarkGrey2),
                        ),
                        child: Center(
                          child: CommonImageView(
                            imagePath: AppFilePaths.filter,
                            height: 12.h,
                            width: 12.w,
                            fit: BoxFit.scaleDown,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                addVerticalSpace(40),

                // ── Body ──────────────────────────────────────────────────
                reportsAsync.when(
                  loading: () => const Center(
                    child: Padding(
                      padding: EdgeInsets.all(40),
                      child: CircularProgressIndicator(),
                    ),
                  ),
                  error: (err, _) => _ErrorView(
                    message: err.toString(),
                    onRetry: () =>
                        ref.read(actionReportsProvider.notifier).refresh(),
                  ),
                  data: (_) => filteredReports.isEmpty
                      ? const _EmptyView()
                      : Column(
                          children: filteredReports
                              .map(
                                (report) => ActionCard(
                                  report: report,
                                  onTap: () => context.push(
                                    AppRoutes.actionDetails,
                                    extra: report,
                                  ),
                                ),
                              )
                              .toList(),
                        ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Error & empty states ────────────────────────────────────────────────────

class _ErrorView extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;
  const _ErrorView({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: Column(
        children: [
          getText(
            context: context,
            title: "Something went wrong",
            fontSize: 14,
            color: AppColors.red,
          ),
          addVerticalSpace(10),
          TextButton(onPressed: onRetry, child: const Text("Retry")),
        ],
      ),
    );
  }
}

class _EmptyView extends StatelessWidget {
  const _EmptyView();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 40),
      child: getText(
        context: context,
        title: "No actions found",
        fontSize: 14,
        color: AppColors.grey4,
      ),
    );
  }
}

// ─── Action card ─────────────────────────────────────────────────────────────
class ActionCard extends StatelessWidget {
  final ActionReport report;
  final VoidCallback onTap;

  const ActionCard({super.key, required this.report, required this.onTap});

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
  Widget build(BuildContext context) {
    final style = _styleFor(report.status);
    final screenWidth = MediaQuery.of(context).size.width;
    // Subtract horizontal padding (20 * 2) and icon width (40) and spacing (10)
    final contentWidth = screenWidth - 40 - 40.w - 10.w;
    final titleWidth = contentWidth * 0.6;
    final locationWidth = contentWidth * 0.4;

    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Icon
                getContainer(
                  context: context,
                  height: 40.h,
                  width: 40.w,
                  shape: BoxShape.circle,
                  decorationColor: Colors.black,
                  child: Center(
                    child: CommonImageView(
                      imagePath: AppFilePaths.actionWhite,
                      height: 24.h,
                      width: 24.w,
                      fit: BoxFit.scaleDown,
                    ),
                  ),
                ),
                SizedBox(width: 10.w),
                // Title + meta
                Expanded(
                  flex: 2,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: titleWidth,
                        child: CustomText(
                          text: report.title,
                          fontSize: 16.sp,
                          maxLines: 2,
                          textOverflow: TextOverflow.ellipsis,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 20.h),
                      CustomText(
                        text: "From Report",
                        fontSize: 12.sp,
                        fontWeight: FontWeight.w400,
                        color: AppColors.grey4,
                      ),
                      SizedBox(height: 5.h),
                      SizedBox(
                        width: titleWidth,
                        child: CustomText(
                          text: report.recordCategory,
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      SizedBox(height: 10.h),
                      Row(
                        children: [
                          CustomText(
                            text: "Due: ",
                            fontSize: 12.sp,
                            fontWeight: FontWeight.w400,
                            color: AppColors.red,
                          ),
                          CustomText(
                            text: _formatDate(report.eventDate),
                            fontSize: 12.sp,
                            fontWeight: FontWeight.w400,
                            color: AppColors.red,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Status + location
                Expanded(
                  flex: 1,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      getContainer(
                        context: context,
                        width: locationWidth.clamp(80.0, 120.0),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        borderRadius: BorderRadius.circular(20),
                        decorationColor: style.bgColor,
                        child: CustomText(
                          textAlign: TextAlign.center,
                          text: style.label,
                          color: style.color,
                          fontSize: 12.sp,
                        ),
                      ),
                      SizedBox(height: 30.h),
                      getText(
                        context: context,
                        title: "Location",
                        fontSize: 12.sp,
                        weight: FontWeight.w400,
                        color: AppColors.grey4,
                      ),
                      SizedBox(height: 5.h),
                      SizedBox(
                        width: locationWidth,
                        child: CustomText(
                          text: report.location.specificArea,
                          fontSize: 14.sp,
                          fontWeight: FontWeight.w400,
                          textOverflow: TextOverflow.ellipsis,
                          maxLines: 2,
                          textAlign: TextAlign.end,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(color: AppColors.lightGrey6, height: 20),
          SizedBox(height: 10.h),
        ],
      ),
    );
  }

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
