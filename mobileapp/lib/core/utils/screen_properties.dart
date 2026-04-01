import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

// vertical spaces
Widget addVerticalSpace(double height) {
  return SizedBox(height: height.sp);
}

// horizontal spaces
Widget addHorizontalSpace(double width) {
  return SizedBox(width: width.sp);
}

// screen height
double height(BuildContext context) => MediaQuery.of(context).size.height;

// screen width
double width(BuildContext context) => MediaQuery.of(context).size.width;
