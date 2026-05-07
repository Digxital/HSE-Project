import 'package:flutter/material.dart';
import 'package:invera_hse/utils/app_colours.dart';

ThemeData lightMode = ThemeData(
  brightness: Brightness.light,
  indicatorColor: AppColors.lightRed,
  colorScheme: const ColorScheme.light(
      primary: AppColors.primaryColor,
      surface: AppColors.bgColor,
      onSurfaceVariant: AppColors.black3,
      onSurface: AppColors.black2),
  textTheme: const TextTheme(
    bodyMedium: TextStyle(color: Colors.black),
    bodySmall: TextStyle(color: AppColors.neutralDarkGrey),
  ),
);

ThemeData darkMode = ThemeData(
  brightness: Brightness.dark,
  indicatorColor: AppColors.lightRedDark,
  colorScheme: const ColorScheme.dark(
    primary: AppColors.primaryColor,
    surface: AppColors.bgColorDark,
    onSurface: Colors.white,
    onSurfaceVariant: Colors.white,
  ),
  textTheme: const TextTheme(
    bodyMedium: TextStyle(color: Colors.white),
    bodySmall: TextStyle(color: AppColors.neutralWhiteGrey),
  ),
);
