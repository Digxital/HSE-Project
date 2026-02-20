import 'package:flutter/material.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';

class CustomTextArea extends StatelessWidget {
  final String? title;
  final String? hintText;
  final ValueChanged<String>? onChanged;
  final TextEditingController? controller;
  final FormFieldValidator<String>? validator;
  final Color borderColor;
  final Color filledColor;
  final Color hintTextColor;
  final bool isFilled;
  final Widget? suffixIcon;
  const CustomTextArea(
      {super.key,
      this.title,
      this.hintText,
      this.onChanged,
      this.controller,
      this.validator,
      this.filledColor = AppColors.grey2,
      this.isFilled = false,
      this.suffixIcon,
      this.borderColor = Colors.transparent,
      this.hintTextColor = AppColors.lightBrown2});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: getText(
              context: context,
              title: title!,
              fontSize: 12,
              weight: FontWeight.w400,
              color: AppColors.grey3),
        ),
        Stack(
          children: [
            TextFormField(
              maxLines: 5,
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
                      fontWeight: FontWeight.w400)),
              validator: validator,
              autovalidateMode: AutovalidateMode.onUserInteraction,
            ),
            Positioned(
              top: 15,
              right: 20,
              child: CommonImageView(
                imagePath: AppFilePaths.microphone,
                height: 16,
                width: 16,
                fit: BoxFit.scaleDown,
              ),
            ),
          ],
        ),
      ],
    );
  }

  OutlineInputBorder setBorder(borderColor) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
      borderSide: BorderSide(
        color: borderColor,
      ),
    );
  }
}
