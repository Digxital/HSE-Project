import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/app_file_paths.dart';
import 'package:aegix/core/utils/common_image_view.dart';
import 'package:aegix/core/utils/custom_text.dart';
import 'package:flutter/material.dart';

class CustomTextArea extends StatelessWidget {
  final String? title;
  final String? hintText;
  final ValueChanged<String>? onChanged;
  final TextEditingController? controller;
  final FormFieldValidator<String>? validator;
  final Color borderColor;
  final Color filledColor;
  final Color hintTextColor;
  final Color titleColor;
  final bool isFilled;
  final bool isSuffix;
  final Widget? suffixIcon;
  final double? titleSize;
  final FontWeight? titleFontWeight;
  final int? maxLines;
  const CustomTextArea({
    super.key,
    this.title,
    this.hintText,
    this.onChanged,
    this.controller,
    this.validator,
    this.filledColor = AppColors.greyColor2,
    this.isFilled = false,
    this.isSuffix = true,
    this.suffixIcon,
    this.borderColor = Colors.transparent,
    this.titleSize = 12,
    this.titleFontWeight = FontWeight.w400,
    this.maxLines = 5,
    this.titleColor = AppColors.greyColor3,
    this.hintTextColor = AppColors.lightBrown2,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: CustomText(
            text: title!,
            fontSize: titleSize!,
            fontWeight: titleFontWeight!,
            color: titleColor,
          ),
        ),
        Stack(
          children: [
            TextFormField(
              maxLines: maxLines,
              keyboardType: TextInputType.multiline,
              textCapitalization: TextCapitalization.sentences,
              onChanged: onChanged,
              controller: controller,
              style: Theme.of(context).textTheme.bodyLarge,
              decoration: InputDecoration(
                isDense: true,
                border: setBorder(AppColors.primaryColor),
                enabledBorder: setBorder(borderColor),
                focusedBorder: setBorder(AppColors.primaryColor),
                errorBorder: setBorder(Colors.red),
                hintText: hintText,
                fillColor: filledColor,
                suffixIcon: suffixIcon,
                filled: isFilled,
                hintStyle: TextStyle(
                  color: hintTextColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w400,
                ),
              ),
              validator: validator,
              autovalidateMode: AutovalidateMode.onUserInteraction,
            ),
            isSuffix
                ? Positioned(
                    top: 15,
                    right: 20,
                    child: InkWell(
                      onTap: () {},
                      child: CommonImageView(
                        imagePath: AppFilePaths.microphone,
                        height: 16,
                        width: 16,
                        fit: BoxFit.scaleDown,
                      ),
                    ),
                  )
                : const SizedBox(),
          ],
        ),
      ],
    );
  }

  OutlineInputBorder setBorder(borderColor) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(color: borderColor),
    );
  }
}
