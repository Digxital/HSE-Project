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

class CertificationDetailsScreen extends StatefulWidget {
  const CertificationDetailsScreen({super.key});

  @override
  State<CertificationDetailsScreen> createState() =>
      _CertificationDetailsScreenState();
}

class _CertificationDetailsScreenState
    extends State<CertificationDetailsScreen> {
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
              CustomAppBar(
                  text: "Certification Details", onTap: () => context.pop()),
              addVerticalSpace(40),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Center(
                            child: CommonImageView(
                              height: 32,
                              width: 32,
                              imagePath: AppFilePaths.tickCircle,
                              fit: BoxFit.scaleDown,
                            ),
                          ),
                          addHorizontalSpace(10),
                          getText(
                              context: context,
                              title: "Fire Safety Training",
                              fontSize: 18,
                              weight: FontWeight.w500),
                        ],
                      ),
                      getContainer(
                          context: context,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 20, vertical: 8),
                          decorationColor: AppColors.lightGreen,
                          borderRadius: BorderRadius.circular(20),
                          child: Center(
                            child: getText(
                                context: context,
                                title: "Active",
                                fontSize: 12,
                                weight: FontWeight.w400,
                                color: AppColors.green),
                          )),
                    ],
                  ),
                  addVerticalSpace(20),
                  getText(
                      context: context,
                      title:
                          "This certification confirms completion of fire safety training, including emergency response and hazard prevention.",
                      fontSize: 14,
                      weight: FontWeight.w400),
                ],
              ),
              addVerticalSpace(80),
              const InfoDetails(
                  title: "Issued By:", description: "Safety Department"),
              const InfoDetails(title: "Issue Date:", description: "Jan 2025"),
              const InfoDetails(
                title: "Expiry Date:",
                description: "Jan 2026",
                isExpired: true,
              ),
              const Divider(
                color: AppColors.lightGrey5,
                thickness: 1,
                height: 50,
              ),
              addVerticalSpace(20),
              getText(
                  context: context,
                  title: "Covers:",
                  fontSize: 14,
                  weight: FontWeight.w500),
              addVerticalSpace(20),
              const CoverData(title: "Fire hazard identification"),
              const CoverData(
                title: "Emergency evacuation",
              ),
              const CoverData(
                title: "Fire extinguisher usage",
              ),
              addVerticalSpace(30),
              Align(
                alignment: Alignment.center,
                child: SizedBox(
                  width: 172,
                  height: 48,
                  child: Container(
                    decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        gradient: const LinearGradient(
                          colors: [
                            AppColors.secondaryColor,
                            AppColors.primaryColor
                          ],
                        )),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: () {},
                        child: const Center(
                          child: Text(
                            "Download Certificate",
                            style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.white),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class CoverData extends StatelessWidget {
  final String title;
  const CoverData({
    super.key,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: Row(
        children: [
          getContainer(
              context: context,
              height: 3,
              width: 3,
              shape: BoxShape.circle,
              decorationColor: AppColors.neutralDarkGrey),
          addHorizontalSpace(10),
          getText(
              context: context,
              title: title,
              fontSize: 14,
              weight: FontWeight.w400),
        ],
      ),
    );
  }
}

class InfoDetails extends StatelessWidget {
  const InfoDetails({
    super.key,
    required this.title,
    required this.description,
    this.isExpired = false,
  });

  final String title;
  final String description;
  final bool isExpired;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          getText(
              context: context,
              title: title,
              fontSize: 14,
              weight: FontWeight.w500),
          Padding(
            padding: const EdgeInsets.only(right: 70),
            child: getText(
                context: context,
                title: description,
                fontSize: 14,
                color: isExpired ? AppColors.red : AppColors.black,
                weight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}
