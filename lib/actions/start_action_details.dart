import 'dart:io';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:invera_hse/component/custom_app_bar.dart';
import 'package:invera_hse/component/custom_textarea.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';

class StartActionsDetails extends StatefulWidget {
  const StartActionsDetails({super.key});

  @override
  State<StartActionsDetails> createState() => _StartActionsDetailsState();
}

class _StartActionsDetailsState extends State<StartActionsDetails> {
  final commentController = TextEditingController();

  File? selectedImage;

  File _onImageSelected(File image) {
    setState(() {
      selectedImage = image;
    });
    return selectedImage!;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: SafeArea(
            child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomAppBar(
                text: "Action Details",
                onTap: () => context.pop(),
              ),
              addVerticalSpace(20),
              getText(
                  context: context,
                  title: "Secure loose cable near main entrance",
                  fontSize: 20,
                  weight: FontWeight.w500),
              addVerticalSpace(5),
              getContainer(
                  context: context,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  borderRadius: BorderRadius.circular(20),
                  decorationColor: AppColors.lightOrange4,
                  child: getText(
                      context: context,
                      title: "In Progress",
                      color: AppColors.orange)),
              addVerticalSpace(40),
              const DetailsCard(),
              addVerticalSpace(30),
              Row(
                children: [
                  getText(
                      context: context,
                      title: "View related report",
                      fontSize: 12,
                      weight: FontWeight.w400,
                      decoration: TextDecoration.underline),
                  addHorizontalSpace(10),
                  CommonImageView(
                      imagePath: AppFilePaths.arrowForwardRound,
                      height: 12,
                      width: 12,
                      fit: BoxFit.scaleDown)
                ],
              ),
              const Divider(
                height: 70,
                color: AppColors.lightGrey6,
              ),
              getText(
                context: context,
                title: "Description",
                fontSize: 14,
                weight: FontWeight.w500,
              ),
              addVerticalSpace(10),
              getContainer(
                context: context,
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(horizontal: 25, vertical: 15),
                borderRadius: BorderRadius.circular(14),
                decorationColor: AppColors.lightOrange6,
                child: getText(
                  context: context,
                  title:
                      "Secure and cover the exposed cable located near the main entrance to prevent tripping hazards.",
                  fontSize: 14,
                  weight: FontWeight.w400,
                ),
              ),
              const Divider(
                height: 70,
                color: AppColors.lightGrey6,
              ),
              getText(
                context: context,
                title: "Upload proof after completing the task.",
                fontSize: 14,
                weight: FontWeight.w500,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  AttachImageTag(onImageSelected: _onImageSelected),
                  AttachImageTag(onImageSelected: _onImageSelected),
                  AttachImageTag(onImageSelected: _onImageSelected),
                ],
              ),
              AttachImageTag(onImageSelected: _onImageSelected),
              const Divider(
                height: 70,
                color: AppColors.lightGrey6,
              ),
              CustomTextArea(
                controller: commentController,
                title: "Comment (Optional)",
                titleSize: 14,
                titleFontWeight: FontWeight.w500,
                titleColor: Colors.black,
                hintText: "Placeholder",
                hintTextColor: AppColors.grey4,
                isFilled: true,
                isSuffix: false,
                maxLines: 3,
              ),
              addVerticalSpace(35),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: Container(
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      gradient: LinearGradient(
                        colors: _onImageSelected == null
                            ? [AppColors.lightOrange7, AppColors.lightOrange7]
                            : [
                                AppColors.secondaryColor,
                                AppColors.primaryColor
                              ],
                      )),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () => context.push(AppRoutes.actionSuccessScreen),
                      child: const Center(
                        child: Text(
                          "Submit",
                          style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                              color: Colors.white),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              addVerticalSpace(20),
            ],
          ),
        )),
      ),
    );
  }
}

class DetailsCard extends StatelessWidget {
  const DetailsCard({
    super.key,
  });

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
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: "Location",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    SizedBox(
                      width: 150,
                      child: getText(
                          context: context,
                          title: "Production Site – Main Entrance",
                          fontSize: 14,
                          weight: FontWeight.w400),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: "Assigned By",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    SizedBox(
                      width: 150,
                      child: getText(
                          context: context,
                          title: "Safety Supervisor",
                          fontSize: 14,
                          weight: FontWeight.w400),
                    ),
                  ],
                ),
              ],
            ),
            addVerticalSpace(30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: "Date Assigned",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    SizedBox(
                      width: 150,
                      child: getText(
                          context: context,
                          title: "Feb 1, 2026",
                          fontSize: 14,
                          weight: FontWeight.w400),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: "Due Date",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    SizedBox(
                      width: 150,
                      child: getText(
                          context: context,
                          title: "Feb 5, 2026",
                          fontSize: 14,
                          weight: FontWeight.w400,
                          color: AppColors.red),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ));
  }
}

class AttachImageTag extends StatefulWidget {
  final Function(File) onImageSelected;

  const AttachImageTag({
    super.key,
    required this.onImageSelected,
  });

  @override
  State<AttachImageTag> createState() => _AttachImageTagState();
}

class _AttachImageTagState extends State<AttachImageTag> {
  File? _selectedImage;
  final ImagePicker _imagePicker = ImagePicker();

  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? image = await _imagePicker.pickImage(source: source);
      if (image != null) {
        setState(() {
          _selectedImage = File(image.path);
        });
        widget.onImageSelected(_selectedImage!);
      }
    } catch (e) {
      print('Error picking image: $e');
    }
  }

  void _showImageSourceDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Select Image Source'),
          content: const Text('Choose where to pick the image from'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
              child: const Text('Camera'),
            ),
            TextButton(
              onPressed: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
              child: const Text('Gallery'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(top: 10),
          child: InkWell(
            onTap: _showImageSourceDialog,
            child: Container(
              height: 117,
              width: 117,
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.lightGrey5,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Center(
                child: _selectedImage != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.file(
                          _selectedImage!,
                          fit: BoxFit.cover,
                        ),
                      )
                    : CommonImageView(
                        imagePath: AppFilePaths.addImage,
                        height: 40,
                        width: 40,
                        fit: BoxFit.scaleDown,
                      ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
