import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/custom_app_bar.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';

class CertificationScreen extends StatefulWidget {
  const CertificationScreen({super.key});

  @override
  State<CertificationScreen> createState() => _CertificationScreenState();
}

class _CertificationScreenState extends State<CertificationScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomAppBar(text: "Certification", onTap: () => context.pop()),
              addVerticalSpace(40),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getText(
                      context: context,
                      title: "Certification",
                      fontSize: 18,
                      weight: FontWeight.w500),
                  getText(
                      context: context,
                      title: "Professional and Safety Certification",
                      fontSize: 14,
                      weight: FontWeight.w400),
                ],
              ),
              addVerticalSpace(30),
              CertificationData(
                onTap: () => context.push(AppRoutes.certificationDetails),
                title: "Certified HSE Officer",
                issuer: "IOSH",
                issuedDate: "Jan 2023",
                expiryDate: "Jan 2023",
              ),
              addVerticalSpace(20),
              CertificationData(
                  onTap: () => context.push(AppRoutes.certificationDetails),
                  title: "Fire Safety Training",
                  issuer: "Safety Board",
                  issuedDate: "Jan 2023",
                  expiryDate: "Jan 2023",
                  isExpired: true),
            ],
          ),
        ),
      ),
    );
  }
}

class CertificationData extends StatelessWidget {
  final dynamic onTap;
  final String title;
  final String issuer;
  final String issuedDate;
  final String expiryDate;
  final bool isExpired;
  const CertificationData({
    super.key,
    required this.onTap,
    required this.title,
    required this.issuer,
    required this.issuedDate,
    required this.expiryDate,
    this.isExpired = false,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: CommonImageView(
                    height: 40,
                    width: 40,
                    imagePath: AppFilePaths.tickCircle,
                    fit: BoxFit.scaleDown,
                  ),
                ),
                addHorizontalSpace(8),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: title,
                        fontSize: 16,
                        weight: FontWeight.w500),
                    addVerticalSpace(5),
                    getText(
                        context: context,
                        title: "Issued by: $issuer",
                        fontSize: 14,
                        weight: FontWeight.w400),
                    addVerticalSpace(5),
                    getText(
                        context: context,
                        title: "Issued Date: $issuedDate",
                        fontSize: 14,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    getText(
                        context: context,
                        title: "Expiry Date: $expiryDate",
                        fontSize: 14,
                        weight: FontWeight.w400,
                        color: AppColors.red),
                  ],
                ),
              ],
            ),
            getContainer(
                context: context,
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                decorationColor:
                    isExpired ? AppColors.orange2 : AppColors.lightGreen,
                borderRadius: BorderRadius.circular(20),
                child: Center(
                  child: getText(
                      context: context,
                      title: isExpired ? "Expired" : "Active",
                      fontSize: 12,
                      weight: FontWeight.w400,
                      color: isExpired ? AppColors.red : AppColors.green),
                ))
          ],
        ),
      ),
    );
  }
}
