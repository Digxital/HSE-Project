import 'package:flutter/material.dart';

// vertical spaces
Widget addVerticalSpace(double height) {
  return SizedBox(height: height);
}

// horizontal spaces
Widget addHorizontalSpace(double width) {
  return SizedBox(width: width);
}


// screen height
double height(BuildContext context) => MediaQuery.of(context).size.height;

// screen width
double width(BuildContext context) => MediaQuery.of(context).size.width;

