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
  final String? fontFamily;
  final TextDirection? textDirection;
  final Locale? locale;
  final StrutStyle? strutStyle;
  final TextWidthBasis? textWidthBasis;
  final TextHeightBehavior? textHeightBehavior;

  const CustomText({
    super.key,
    required this.text,
    this.fontSize = 12,
    this.fontWeight = FontWeight.w400,
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
    this.fontFamily,
    this.textDirection,
    this.locale,
    this.strutStyle,
    this.textWidthBasis,
    this.textHeightBehavior,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      softWrap: softWrap,
      maxLines: maxLines,
      textAlign: textAlign,
      textDirection: textDirection,
      locale: locale,
      strutStyle: strutStyle,
      textWidthBasis: textWidthBasis,
      textHeightBehavior: textHeightBehavior,
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
        fontFamily: fontFamily,
      ),
    );
  }
}