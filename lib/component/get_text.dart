import 'package:flutter/material.dart';

Text getText({
  required BuildContext context,
  required String title,
  double fontSize = 12,
  FontWeight weight = FontWeight.w400,
  FontStyle? fontStyle,
  int? maxLines,
  Color? color,
  bool? softwrap,
  Color? bgColor,
  TextAlign? textAlign,
  double? textHeight,
  TextOverflow? textOverflow,
  double? letterSpacing,
  double? wordSpacing,
  TextDecoration? decoration,
  List<Shadow>? shadows,
  // String fontFamily = AppConstants.aeonik,
}) {
  return Text(
    title,
    softWrap: softwrap,
    maxLines: maxLines,
    style: TextStyle(
      overflow: textOverflow,
      wordSpacing: wordSpacing,
      fontSize: fontSize,
      fontStyle: fontStyle,
      fontWeight: weight,
      letterSpacing: letterSpacing,
      color: color ?? Colors.black,
      backgroundColor: bgColor ?? Colors.transparent,
      height: textHeight != null ? textHeight / fontSize : null,
      decoration: decoration,
      shadows: shadows,
      // fontFamily: fontFamily,
    ),
    textAlign: textAlign,
  );
}
