import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/get_text.dart';

class CustomAppBar extends StatelessWidget {
  final String text;
  const CustomAppBar({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          InkWell(
              onTap: () => context.pop(),
              child: const Icon(
                Icons.arrow_back_ios_new_rounded,
                size: 20,
              )),
          getText(
              context: context,
              title: text,
              fontSize: 16,
              weight: FontWeight.w500),
          const SizedBox()
        ],
      ),
    );
  }
}
