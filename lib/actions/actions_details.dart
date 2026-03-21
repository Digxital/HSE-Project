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

class ActionsDetails extends StatefulWidget {
  const ActionsDetails({super.key});

  @override
  State<ActionsDetails> createState() => _ActionsDetailsState();
}

class _ActionsDetailsState extends State<ActionsDetails> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: SafeArea(
            child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const CustomAppBar(
                text: "Action Details",
              ),
              addVerticalSpace(20),
              getText(
                  context: context,
                  title: "Secure loose cable near main entrance",
                  fontSize: 20,
                  weight: FontWeight.w500),
              addVerticalSpace(5),
              getContainer(
                  context: context,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  borderRadius: BorderRadius.circular(20),
                  decorationColor: AppColors.orange2,
                  child: getText(
                      context: context, title: "Open", color: AppColors.red)),
              addVerticalSpace(40),
              const DetailsCard(),
              addVerticalSpace(30),
              Row(
                children: [
                  getText(
                      context: context,
                      title: "View related report",
                      fontSize: 12,
                      weight: FontWeight.w400,
                      decoration: TextDecoration.underline),
                  addHorizontalSpace(10),
                  CommonImageView(
                      imagePath: AppFilePaths.arrowForwardRound,
                      height: 12,
                      width: 12,
                      fit: BoxFit.scaleDown)
                ],
              ),
              const Divider(
                height: 70,
                color: AppColors.lightGrey6,
              ),
              getText(
                context: context,
                title: "Description",
                fontSize: 14,
                weight: FontWeight.w500,
              ),
              addVerticalSpace(10),
              getContainer(
                context: context,
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(horizontal: 25, vertical: 15),
                borderRadius: BorderRadius.circular(14),
                decorationColor: AppColors.lightOrange6,
                child: getText(
                  context: context,
                  title:
                      "Secure and cover the exposed cable located near the main entrance to prevent tripping hazards.",
                  fontSize: 14,
                  weight: FontWeight.w400,
                ),
              ),
              addVerticalSpace(50),
              SizedBox(
                width: double.infinity,
                height: 44,
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
                          "Start Action",
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
            ],
          ),
        )),
      ),
    );
  }
}

class DetailsCard extends StatelessWidget {
  const DetailsCard({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return getContainer(
        context: context,
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 25),
        borderRadius: BorderRadius.circular(12),
        decorationColor: AppColors.lightOrange6,
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: "Location",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    SizedBox(
                      width: 150,
                      child: getText(
                          context: context,
                          title: "Production Site – Main Entrance",
                          fontSize: 14,
                          weight: FontWeight.w400),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: "Assigned By",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    SizedBox(
                      width: 150,
                      child: getText(
                          context: context,
                          title: "Safety Supervisor",
                          fontSize: 14,
                          weight: FontWeight.w400),
                    ),
                  ],
                ),
              ],
            ),
            addVerticalSpace(30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: "Date Assigned",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    SizedBox(
                      width: 150,
                      child: getText(
                          context: context,
                          title: "Feb 1, 2026",
                          fontSize: 14,
                          weight: FontWeight.w400),
                    ),
                  ],
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    getText(
                        context: context,
                        title: "Due Date",
                        fontSize: 12,
                        weight: FontWeight.w400,
                        color: AppColors.grey4),
                    addVerticalSpace(5),
                    SizedBox(
                      width: 150,
                      child: getText(
                          context: context,
                          title: "Feb 5, 2026",
                          fontSize: 14,
                          weight: FontWeight.w400,
                          color: AppColors.red),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ));
  }
}
