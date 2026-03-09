import 'package:flutter/material.dart';

Container getContainer(
    {required BuildContext context,
    double? height,
    double? width,
    Color? decorationColor,
    Widget? child,
    EdgeInsetsGeometry? padding,
    EdgeInsetsGeometry? margin,
    AlignmentGeometry? alignment,
    BoxBorder? border,
    BorderRadiusGeometry? borderRadius,
    BoxShape shape = BoxShape.rectangle,
    List<BoxShadow>? boxShadow,
    Gradient? gradient,
    DecorationImage? image}) {
  return Container(
    height: height,
    width: width,
    padding: padding,
    margin: margin,
    alignment: alignment,
    decoration: BoxDecoration(
      border: border,
      borderRadius: borderRadius,
      color: decorationColor,
      shape: shape,
      boxShadow: boxShadow,
      gradient: gradient,
      image: image,
    ),
    child: child,
  );
}
