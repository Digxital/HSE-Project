import 'package:flutter/material.dart';
import 'package:invera_hse/utils/app_colours.dart';

class CustomTextArea extends StatelessWidget {
  final String? hintText;
  final ValueChanged<String>? onChanged;
  final TextEditingController? controller;
  final FormFieldValidator<String>? validator;
  final Color borderColor;
  final Color filledColor;
  final bool isFilled;
  const CustomTextArea(
      {super.key,
      this.hintText,
      this.onChanged,
      this.controller,
      this.validator,
      this.filledColor = Colors.transparent,
      this.isFilled = false,
      this.borderColor = AppColors.lightGrey});

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      maxLines: 5,
      keyboardType: TextInputType.multiline,
      textCapitalization: TextCapitalization.sentences,
      onChanged: onChanged,
      controller: controller,
      decoration: InputDecoration(
          isDense: true,
          border: setBorder(AppColors.primaryColor),
          enabledBorder: setBorder(borderColor),
          focusedBorder: setBorder(AppColors.primaryColor),
          errorBorder: setBorder(Colors.red),
          hintText: hintText,
          fillColor: filledColor,
          filled: isFilled,
          hintStyle: const TextStyle(
              color: AppColors.lightGrey,
              fontSize: 14,
              fontWeight: FontWeight.w400)),
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
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
