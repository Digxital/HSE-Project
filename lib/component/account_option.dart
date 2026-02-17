import 'package:flutter/material.dart';
import 'package:invera_hse/utils/app_colours.dart';

class AccountOption extends StatelessWidget {
  final String question;
  final String action;
  final double fontSize;
  final dynamic onTap;
  final MainAxisAlignment mainAxisAlignment;
  const AccountOption(
      {super.key,
      required this.question,
      required this.action,
      this.fontSize = 14,
      this.mainAxisAlignment = MainAxisAlignment.center,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: onTap,
        child: Column(
          mainAxisAlignment: mainAxisAlignment,
          children: [
            Text("$question ",
                style: TextStyle(
                    fontSize: fontSize,
                    fontWeight: FontWeight.w400,
                    color: AppColors.black)),
            Text(action,
                style: TextStyle(
                    fontSize: fontSize,
                    fontWeight: FontWeight.w400,
                    color: AppColors.black)),
          ],
        ));
  }
}
