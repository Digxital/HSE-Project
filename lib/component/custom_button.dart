import 'package:flutter/material.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/common_image_view.dart';

class CustomButton extends StatelessWidget {
  final dynamic onTap;
  final dynamic boxShadow;
  final String buttonName;
  final String imagePath;
  final Color buttonColor;
  final Color borderColor;
  final Color textColor;
  final double fontSize;
  final FontWeight fontWeight;
  final bool isSocial;
  final bool isVerified;
  final bool isButton;
  final bool isPrefixIcon;
  final double height;
  final double width;
  const CustomButton({
    super.key,
    this.onTap,
    this.boxShadow,
    required this.buttonName,
    this.imagePath = "",
    this.buttonColor = AppColors.primaryColor,
    this.borderColor = Colors.transparent,
    this.textColor = Colors.white,
    this.fontSize = 14,
    this.fontWeight = FontWeight.w600,
    this.isSocial = false,
    this.isVerified = false,
    this.isButton = true,
    this.isPrefixIcon = false,
    this.height = 56,
    this.width = double.infinity,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: onTap,
        child: Container(
          height: height,
          width: width,
          decoration: BoxDecoration(
              color: buttonColor,
              borderRadius: BorderRadius.circular(100),
              border: Border.all(color: borderColor),
              boxShadow: boxShadow),
          child: Center(
              child: isPrefixIcon
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CommonImageView(
                            imagePath: imagePath,
                            height: 24,
                            width: 24,
                            fit: BoxFit.scaleDown),
                        addHorizontalSpace(8),
                        Text(buttonName,
                            style: TextStyle(
                                color: textColor,
                                fontWeight: FontWeight.w600,
                                fontSize: fontSize))
                      ],
                    )
                  : Text(buttonName,
                      style: TextStyle(
                          color: textColor,
                          fontWeight: fontWeight,
                          fontSize: fontSize))),
        ));
  }
}
