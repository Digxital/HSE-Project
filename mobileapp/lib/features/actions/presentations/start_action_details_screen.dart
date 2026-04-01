// lib/features/action/view/start_action_details_screen.dart

import 'dart:io';

import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/custom_textarea.dart';
import 'package:aegix/core/utils/get_container.dart';
import 'package:aegix/features/auth/presentation/widgets/custom_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../models/action_model.dart';
import '../providers/action_provider.dart';

class StartActionsDetails extends HookConsumerWidget {
  final ActionReport report;
  const StartActionsDetails({super.key, required this.report});

  // ✅ Status helper
  _StatusStyle _styleFor(String status) {
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
    final commentController = useTextEditingController();
    final images = useState<List<File?>>([null, null, null, null]);

    final submitState = ref.watch(submitActionProvider);
    final isSubmitting = submitState.isLoading;
    final hasImage = images.value.any((f) => f != null);

    final style = _styleFor(report.status);

    void onImageSelected(int index, File file) {
      final updated = List<File?>.from(images.value);
      updated[index] = file;
      images.value = updated;
    }

    Future<void> handleSubmit() async {
      final paths = images.value.whereType<File>().map((f) => f.path).toList();

      final success = await ref
          .read(submitActionProvider.notifier)
          .submit(
            reportId: report.id,
            comment: commentController.text.trim(),
            attachmentPaths: paths,
          );

      if (success && context.mounted) {
        context.push(AppRoutes.actionSuccessScreen);
      }
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        surfaceTintColor: Colors.white,
        title: const Text('Action Details'),
      ),
      body: SingleChildScrollView(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: 20.h),

                // Title
                CustomText(
                  text: report.title,
                  fontSize: 20.sp,
                  fontWeight: FontWeight.w500,
                ),

                SizedBox(height: 10.h),

                // ✅ Dynamic Status Badge
                getContainer(
                  context: context,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 10,
                  ),
                  borderRadius: BorderRadius.circular(20),
                  decorationColor: style.bgColor,
                  child: CustomText(
                    text: style.label,
                    color: style.color,
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w400,
                  ),
                ),

                SizedBox(height: 40.h),

                _StartDetailsCard(report: report),

                SizedBox(height: 30.h),

                // View report
                Row(
                  children: [
                    CustomText(
                      text: "View related report",
                      fontSize: 12.sp,
                      decoration: TextDecoration.underline,
                    ),
                    SizedBox(width: 10),
                    CommonImageView(
                      imagePath: AppFilePaths.arrowForwardRound,
                      height: 12,
                      width: 12,
                    ),
                  ],
                ),

                Divider(height: 70.h, color: AppColors.lightGrey6),

                // Description
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
                  child: CustomText(text: report.description, fontSize: 14.sp),
                ),

                Divider(height: 70.h, color: AppColors.lightGrey6),

                CustomText(
                  text: "Upload proof after completing the task.",
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w500,
                ),

                SizedBox(height: 12.h),

                // ✅ Responsive Image Grid
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: List.generate(4, (i) {
                    return SizedBox(
                      width: (MediaQuery.of(context).size.width - 60) / 3,
                      child: _AttachImageSlot(
                        selectedImage: images.value[i],
                        onImageSelected: (file) => onImageSelected(i, file),
                      ),
                    );
                  }),
                ),

                const Divider(height: 70),

                CustomTextArea(
                  controller: commentController,
                  title: "Comment (Optional)",
                  maxLines: 3,
                ),

                SizedBox(height: 35.h),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 44,
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      gradient: LinearGradient(
                        colors: (!hasImage || isSubmitting)
                            ? [AppColors.lightOrange7, AppColors.lightOrange7]
                            : [
                                AppColors.secondaryColor,
                                AppColors.primaryColor,
                              ],
                      ),
                    ),
                    child: InkWell(
                      onTap: (hasImage && !isSubmitting) ? handleSubmit : null,
                      child: Center(
                        child: isSubmitting
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              )
                            : const Text(
                                "Submit",
                                style: TextStyle(color: Colors.white),
                              ),
                      ),
                    ),
                  ),
                ),

                SizedBox(height: 20.h),

                if (submitState.hasError)
                  CustomText(
                    text: submitState.error.toString(),
                    color: AppColors.red,
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── DETAILS CARD ─────────────────────────────────

class _StartDetailsCard extends StatelessWidget {
  final ActionReport report;
  const _StartDetailsCard({required this.report});

  String _formatDate(String iso) {
    final dt = DateTime.tryParse(iso);
    if (dt == null) return iso;
    return "${dt.day}/${dt.month}/${dt.year}";
  }

  @override
  Widget build(BuildContext context) {
    return getContainer(
      context: context,
      padding: const EdgeInsets.all(20),
      borderRadius: BorderRadius.circular(12),
      decorationColor: AppColors.lightOrange6,
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _InfoCol(
                  label: "Location",
                  value: report.location.specificArea,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _InfoCol(
                  label: "Assigned By",
                  value: report.reportedBy.role,
                ),
              ),
            ],
          ),
          SizedBox(height: 20.h),
          Row(
            children: [
              Expanded(
                child: _InfoCol(
                  label: "Date Assigned",
                  value: _formatDate(report.createdAt),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _InfoCol(
                  label: "Due Date",
                  value: _formatDate(report.eventDate),
                  valueColor: AppColors.red,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _InfoCol extends StatelessWidget {
  final String label;
  final String value;
  final Color? valueColor;

  const _InfoCol({required this.label, required this.value, this.valueColor});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CustomText(text: label, fontSize: 12.sp, color: AppColors.grey4),
        SizedBox(height: 5.h),
        CustomText(text: value, fontSize: 14, color: valueColor, maxLines: 2),
      ],
    );
  }
}

// ─── IMAGE SLOT ─────────────────────────────────

class _AttachImageSlot extends HookWidget {
  final File? selectedImage;
  final ValueChanged<File> onImageSelected;

  const _AttachImageSlot({
    required this.selectedImage,
    required this.onImageSelected,
  });

  Future<void> _pickImage(BuildContext context, ImageSource source) async {
    final picker = ImagePicker();
    final file = await picker.pickImage(source: source);
    if (file != null) onImageSelected(File(file.path));
  }

  void _showDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Select Image Source'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _pickImage(context, ImageSource.camera);
            },
            child: const Text('Camera'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _pickImage(context, ImageSource.gallery);
            },
            child: const Text('Gallery'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => _showDialog(context),
      child: Container(
        height: 117,
        width: double.infinity,
        decoration: BoxDecoration(
          color: AppColors.lightGrey5,
          borderRadius: BorderRadius.circular(18),
        ),
        child: Center(
          child: selectedImage != null
              ? Image.file(selectedImage!, fit: BoxFit.cover)
              : CommonImageView(
                  imagePath: AppFilePaths.addImage,
                  height: 40,
                  width: 40,
                ),
        ),
      ),
    );
  }
}

// ─── STATUS MODEL ───────────────────────────────

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
