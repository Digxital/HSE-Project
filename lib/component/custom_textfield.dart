import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/utils/app_colours.dart';

class CustomTextField extends StatelessWidget {
  const CustomTextField(
      {super.key,
      this.controller,
      this.onChanged,
      this.textInputType = TextInputType.name,
      this.title = "",
      this.isFullName = false,
      this.hintText,
      this.filledColor = AppColors.grey2,
      this.borderColor = Colors.transparent,
      this.hintTextColor = AppColors.lightBrown2,
      this.borderRadius = 8.0,
      this.filled = true,
      this.suffixIcon,
      this.maxLength = TextField.noMaxLength,
      this.obscureText = false,
      this.readOnly = false,
      this.inputFormatter,
      this.enabled,
      this.validator,
      this.prefix,
      this.onFieldSubmitted,
      this.onTapOutside,
      this.onTap,
      this.autofillHints,
      this.isPhoneField = false,
      this.isDense = true,
      this.countryCode = '234',
      this.assetName = 'assets/images/NG Flag 2.png'});

  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final String? title;
  final bool? isFullName;
  final String? hintText;
  final Color? filledColor;
  final double? borderRadius;
  final Color? borderColor;
  final Color? hintTextColor;
  final Iterable<String>? autofillHints;
  final bool? filled;
  final TextInputType textInputType;
  final bool obscureText;
  final ValueChanged<String>? onFieldSubmitted;
  final Widget? suffixIcon;
  final bool readOnly;
  final List<TextInputFormatter>? inputFormatter;
  final bool? enabled;
  final int maxLength;
  final FormFieldValidator<String>? validator;
  final Widget? prefix;
  final bool isPhoneField;
  final bool isDense;
  final TapRegionCallback? onTapOutside;
  final dynamic onTap;
  final String countryCode;
  final String assetName;

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
              fontSize: 12,
              weight: FontWeight.w400,
              color: AppColors.grey3),
        ),
        TextFormField(
          autofillHints: autofillHints,
          readOnly: readOnly,
          inputFormatters: inputFormatter,
          onTapOutside: onTapOutside,
          onTap: onTap,
          controller: controller,
          cursorColor: AppColors.secondaryColor,
          enabled: enabled,
          cursorHeight: 18.0,
          keyboardType: textInputType,
          textAlign: TextAlign.start,
          onChanged: onChanged,
          onFieldSubmitted: onFieldSubmitted,
          style: Theme.of(context).textTheme.bodyLarge,
          obscureText: obscureText,
          maxLength: isPhoneField ? 11 : maxLength,
          decoration: InputDecoration(
            contentPadding:
                const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
            isDense: isDense,
            errorStyle: TextStyle(backgroundColor: Colors.white.withAlpha(50)),
            counterText: "",
            fillColor: filledColor,
            filled: filled,
            hintText: hintText,
            suffixIcon: suffixIcon,
            hintStyle: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: hintTextColor),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8.0),
            ),
            focusedBorder: setBorder(AppColors.secondaryColor),
            enabledBorder: setBorder(borderColor),
            errorBorder: setBorder(Colors.red),
            prefixIcon: isPhoneField
                ? Container(
                    width: 75,
                    decoration: const BoxDecoration(
                        border: Border(
                      right: BorderSide(
                        color: Color(0xFFC0C0C0),
                        width: 1.5,
                      ),
                    )),
                    margin: const EdgeInsets.only(right: 10),
                    padding: const EdgeInsets.only(right: 5),
                    child: Row(
                      children: [
                        const SizedBox(
                          width: 10,
                        ),
                        Image.asset(
                          assetName,
                          fit: BoxFit.contain,
                        ),
                        Text(
                          '  +$countryCode',
                          style: const TextStyle(
                              fontSize: 12, fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  )
                : prefix,
            //  prefix:prefix
          ),
          validator: validator,
          autovalidateMode: AutovalidateMode.onUserInteraction,
        )
      ],
    );
  }

  OutlineInputBorder setBorder(borderColor) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(borderRadius!),
      borderSide: BorderSide(
        color: borderColor,
      ),
    );
  }
}
