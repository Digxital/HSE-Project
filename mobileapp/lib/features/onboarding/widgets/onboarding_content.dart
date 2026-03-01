import 'package:aegix/features/onboarding/models/onboarding_model.dart';
import 'package:flutter/material.dart';

class OnboardingContent extends StatelessWidget {
  final OnboardingItem item;

  const OnboardingContent({
    super.key,
    required this.item,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: item.backgroundColor,
      child: Column(
        children: [
          // Image - Starts from the VERY TOP (under battery/status bar)
          SizedBox(
            height: MediaQuery.of(context).size.height * 0.444, 
            width: double.infinity,
            child: Image.asset(
              item.imagePath,
              fit: BoxFit.cover, 
            ),
          ),
          
         
        ],
      ),
    );
  }
}