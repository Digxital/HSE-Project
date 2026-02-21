import 'package:flutter/material.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() => _NotificationScreenState();
}

class _NotificationScreenState extends State<NotificationScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            const Header(),
            addVerticalSpace(30),
            const NotificationMessage(
                icon: AppFilePaths.done2,
                iconBgColor: AppColors.primaryColor,
                title: "New Action Assigned",
                description:
                    "You have been assigned a corrective action.\nPlease review and start working on it.",
                time: "3 mins ago"),
            addVerticalSpace(30),
            const NotificationMessage(
                icon: AppFilePaths.smsNotification,
                iconBgColor: AppColors.orange,
                title: "Action Due Soon",
                description:
                    "This action is due tomorrow. Make sure it\nis completed on time.",
                time: "3 mins ago"),
            addVerticalSpace(30),
            const NotificationMessage(
                icon: AppFilePaths.notification2,
                iconBgColor: AppColors.red2,
                title: "Action Closed",
                description:
                    "Your completed action has been reviewed\nand officially closed.",
                time: "3 mins ago"),
            addVerticalSpace(30),
            const NotificationMessage(
                icon: AppFilePaths.star,
                iconBgColor: AppColors.green2,
                title: "Corrective Action Created",
                description:
                    "A corrective action has been created\nfrom your report.",
                time: "3 mins ago"),
          ],
        ),
      ),
    );
  }
}

class NotificationMessage extends StatelessWidget {
  final String title;
  final String description;
  final String time;
  final String icon;
  final Color iconBgColor;
  const NotificationMessage({
    super.key,
    required this.title,
    required this.description,
    required this.time,
    required this.icon,
    required this.iconBgColor,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 30),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              getContainer(
                context: context,
                height: 48,
                width: 48,
                shape: BoxShape.circle,
                decorationColor: iconBgColor,
                child: Center(
                  child: CommonImageView(
                    imagePath: icon,
                    height: 20,
                    width: 20,
                    fit: BoxFit.scaleDown,
                  ),
                ),
              ),
              addHorizontalSpace(20),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getText(
                      context: context,
                      title: title,
                      fontSize: 14,
                      weight: FontWeight.w500),
                  addVerticalSpace(10),
                  getText(
                      context: context,
                      title: description,
                      fontSize: 12,
                      weight: FontWeight.w400),
                  addVerticalSpace(10),
                  Row(
                    children: [
                      getContainer(
                          context: context,
                          height: 4,
                          width: 4,
                          shape: BoxShape.circle,
                          decorationColor: AppColors.primaryColor),
                      addHorizontalSpace(5),
                      getText(
                          context: context,
                          title: time,
                          fontSize: 12,
                          weight: FontWeight.w400,
                          color: AppColors.lightOrange3),
                    ],
                  ),
                  addVerticalSpace(10),
                ],
              )
            ],
          ),
        ],
      ),
    );
  }
}

class Header extends StatelessWidget {
  const Header({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          InkWell(
            onTap: () => Navigator.pop(context),
            child: CommonImageView(
              imagePath: AppFilePaths.arrowBack,
              height: 24,
              width: 24,
              fit: BoxFit.scaleDown,
            ),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 20),
            child: getText(
                context: context,
                title: "Notification",
                fontSize: 16,
                weight: FontWeight.w500),
          ),
          const SizedBox()
        ],
      ),
    );
  }
}
