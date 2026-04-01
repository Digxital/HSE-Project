import 'package:aegix/core/utils/custom_text.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CustomAppBar extends StatelessWidget {
  final String text;
  final String more;
  final bool isMore;
  final dynamic onTap;
  final dynamic onTapMore;
  const CustomAppBar({
    super.key,
    required this.text,
    this.more = "",
    this.isMore = false,
    this.onTap,
    this.onTapMore,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          InkWell(
            onTap: onTap,
            child: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          ),
          CustomText(text: text, fontSize: 16.sp, fontWeight: FontWeight.w500),
          isMore
              ? InkWell(
                  onTap: onTapMore,
                  child: CustomText(
                    text: more,
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w400,
                  ),
                )
              : const SizedBox(),
        ],
      ),
    );
  }
}
