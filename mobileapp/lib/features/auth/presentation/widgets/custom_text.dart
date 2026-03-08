import 'package:flutter/material.dart';

class CustomText extends StatelessWidget {
  final String text;
  final double fontSize;
  final FontWeight fontWeight;
  final FontStyle? fontStyle;
  final int? maxLines;
  final Color? color;
  final bool? softWrap;
  final Color? backgroundColor;
  final TextAlign? textAlign;
  final double? textHeight;
  final TextOverflow? textOverflow;
  final double? letterSpacing;
  final double? wordSpacing;
  final TextDecoration? decoration;
  final List<Shadow>? shadows;

  const CustomText({
    super.key,
    required this.text,
    required this.fontSize,
    required this.fontWeight,
    this.fontStyle,
    this.maxLines,
    this.color,
    this.softWrap,
    this.backgroundColor,
    this.textAlign,
    this.textHeight,
    this.textOverflow,
    this.letterSpacing,
    this.wordSpacing,
    this.decoration,
    this.shadows,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      softWrap: softWrap,
      maxLines: maxLines,
      style: TextStyle(
        overflow: textOverflow,
        wordSpacing: wordSpacing,
        fontSize: fontSize,
        fontStyle: fontStyle,
        fontWeight: fontWeight,
        letterSpacing: letterSpacing,
        color: color ?? Colors.black,
        backgroundColor: backgroundColor ?? Colors.transparent,
        height: textHeight != null ? textHeight! / fontSize : null,
        decoration: decoration,
        shadows: shadows,
      ),
      textAlign: textAlign,
    );
  }
}