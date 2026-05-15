import 'package:flutter/material.dart';
import 'package:flutter_spinkit/flutter_spinkit.dart';
import 'package:invera_hse/utils/app_colours.dart';

class CustomLoader extends StatelessWidget {
  const CustomLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.transparent,
      child: const Center(
        child: SpinKitPulsingGrid(
          color: AppColors.primaryColor,
          size: 60.0,
        ),
      ),
    );
  }
}
