import 'package:flutter/material.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/utils/app_colours.dart';

class CustomDropdownButton extends StatelessWidget {
  final String? title;
  final dynamic items;
  final String? hintText;
  final double? height;
  final double? width;
  final dynamic selectedValue;
  final dynamic onChanged;
  final FormFieldValidator<Object>? validator;
  final Color? color;
  final Color? hintColor;
  final Color borderColor;
  final double? hintFontSize;
  final double? borderRadius;

  const CustomDropdownButton(
      {super.key,
      this.title,
      this.items,
      this.borderColor = Colors.transparent,
      this.borderRadius = 8,
      this.color = AppColors.grey2,
      this.hintColor = AppColors.lightBrown2,
      this.hintText,
      this.hintFontSize = 12,
      this.height = 48,
      this.width = double.infinity,
      this.selectedValue,
      this.validator,
      this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisAlignment: MainAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: getText(
              context: context,
              title: title!,
              fontSize: 14,
              weight: FontWeight.w500,
              color: AppColors.grey3),
        ),
        Container(
          decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(borderRadius!),
              border: Border.all(color: borderColor)),
          height: height,
          padding: const EdgeInsets.symmetric(horizontal: 10),
          width: width,
          child: DropdownButtonHideUnderline(
              child: DropdownButtonFormField(
            dropdownColor: Colors.white,
            borderRadius: BorderRadius.circular(8),
            style: Theme.of(context).textTheme.bodyLarge,
            hint: Text(
              "$hintText",
              style: TextStyle(
                  fontSize: hintFontSize,
                  color: hintColor,
                  fontWeight: FontWeight.w400),
            ),
            items: items,
            isExpanded: true,
            icon: const Icon(
              Icons.keyboard_arrow_down_sharp,
              color: AppColors.grey3,
            ),
            decoration: const InputDecoration(
                enabledBorder: InputBorder.none,
                focusedBorder: InputBorder.none),
            value: selectedValue,
            onChanged: onChanged,
            validator: validator,
          )),
        ),
      ],
    );
  }
}
