import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  var reportDataList = [
    {
      "title": "Loose cable near main entrance",
      "date": "Submitted 3 mins ago",
      "status": "Closed",
      "riskLevel": "High Risk",
      "icon": AppFilePaths.warning3,
      "iconColor": AppColors.red
    },
    {
      "title": "Oil spill near pump station",
      "date": "Submitted Jan 30, 2026",
      "status": "Under Review",
      "riskLevel": "High Risk",
      "icon": AppFilePaths.warning4,
      "iconColor": AppColors.black
    },
    {
      "title": "Blocked emergency exit",
      "date": "Submitted Jan 30, 2026",
      "status": "Action Created",
      "riskLevel": "Medium Risk",
      "icon": AppFilePaths.warning4,
      "iconColor": AppColors.black
    },
  ];
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              addVerticalSpace(20),
              const Header(),
              addVerticalSpace(50),
              const ReportCards(),
              addVerticalSpace(40),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: getText(
                      context: context,
                      title: "Recent Reports",
                      fontSize: 18,
                      weight: FontWeight.w500,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: getText(
                        context: context,
                        title: "View all",
                        fontSize: 18,
                        weight: FontWeight.w500),
                  ),
                ],
              ),
              addVerticalSpace(20),
              ...List.generate(
                reportDataList.length,
                (index) {
                  final item = reportDataList[index];
                  return Column(
                    children: [
                      ReportData(
                        title: item['title'] as String,
                        date: item['date'] as String,
                        icon: item['icon'] as String,
                        iconColor: item['iconColor'] as Color,
                      ),
                      if (index < reportDataList.length - 1)
                        const Divider(
                          height: 50,
                          thickness: 0.2,
                          color: AppColors.lightGrey4,
                        ),
                    ],
                  );
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}

class ReportCards extends StatelessWidget {
  const ReportCards({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final reportData = [
      ReportCardData(
        title: "Total Reports",
        reportCount: "18",
        isTotalReport: true,
        bgColor: AppColors.lightOrange,
        textColor: Colors.black,
        borderColor: AppColors.lightOrange,
      ),
      ReportCardData(
        title: "Open Reports",
        reportCount: "5",
        isTotalReport: false,
        bgColor: AppColors.lightGrey2,
        textColor: Colors.black,
        borderColor: AppColors.lightGrey3,
      ),
      ReportCardData(
        title: "High Risk Reports",
        reportCount: "2",
        isTotalReport: false,
        bgColor: AppColors.lightGrey2,
        textColor: Colors.black,
        borderColor: AppColors.lightGrey3,
      ),
      ReportCardData(
        title: "Pending Review",
        reportCount: "3",
        isTotalReport: false,
        bgColor: AppColors.lightGrey2,
        textColor: Colors.black,
        borderColor: AppColors.lightGrey3,
      ),
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 15,
          mainAxisSpacing: 15,
          childAspectRatio: 1.5,
        ),
        itemCount: reportData.length,
        itemBuilder: (context, index) {
          final card = reportData[index];
          return ReportCard(
            title: card.title,
            reportCount: card.reportCount,
            isTotalReport: card.isTotalReport,
            bgColor: card.bgColor,
            textColor: card.textColor,
            borderColor: card.borderColor,
          );
        },
      ),
    );
  }
}

class ReportData extends StatelessWidget {
  final String title;
  final String date;
  final String icon;
  final Color iconColor;
  const ReportData(
      {super.key,
      required this.title,
      required this.date,
      required this.icon,
      required this.iconColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          IconWidget(
            icon: icon,
            iconColor: iconColor,
          ),
          addHorizontalSpace(15),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              getText(
                  context: context,
                  title: title,
                  fontSize: 16,
                  weight: FontWeight.w500),
              addVerticalSpace(5),
              Row(
                children: [
                  const ReportUpdate(
                    update: "Incident",
                    indicatorColor: Colors.black,
                  ),
                  addHorizontalSpace(10),
                  const ReportUpdate(
                    update: "Closed",
                    indicatorColor: AppColors.green,
                  ),
                  addHorizontalSpace(10),
                  const ReportUpdate(
                    update: "High Risk",
                    indicatorColor: AppColors.red,
                  ),
                ],
              ),
              addVerticalSpace(5),
              getText(
                  context: context,
                  title: date,
                  fontSize: 12,
                  weight: FontWeight.w400,
                  color: AppColors.grey4),
            ],
          )
        ],
      ),
    );
  }
}

class IconWidget extends StatelessWidget {
  final String icon;
  final Color iconColor;
  const IconWidget({super.key, required this.icon, required this.iconColor});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: getContainer(
          context: context,
          height: 48,
          width: 48,
          borderRadius: BorderRadius.circular(40),
          decorationColor: iconColor,
          child: Center(
            child: CommonImageView(
              imagePath: icon,
              height: 24,
              width: 24,
              fit: BoxFit.scaleDown,
            ),
          )),
    );
  }
}

class ReportUpdate extends StatelessWidget {
  final String update;
  final Color indicatorColor;
  const ReportUpdate(
      {super.key, required this.update, required this.indicatorColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(left: 5),
      child: Row(
        children: [
          getContainer(
              context: context,
              height: 3,
              width: 3,
              decorationColor: indicatorColor,
              shape: BoxShape.circle),
          addHorizontalSpace(6),
          getText(
              context: context,
              title: update,
              fontSize: 12,
              weight: FontWeight.w400,
              color: AppColors.black2),
        ],
      ),
    );
  }
}

class ReportCard extends StatelessWidget {
  final String title;
  final String reportCount;
  final bool isTotalReport;
  final Color bgColor;
  final Color textColor;
  final Color borderColor;
  const ReportCard({
    super.key,
    required this.title,
    required this.reportCount,
    required this.isTotalReport,
    required this.bgColor,
    required this.textColor,
    this.borderColor = AppColors.lightGrey3,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
        height: 113,
        width: 178,
        decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: borderColor)),
        child: Padding(
          padding: const EdgeInsets.only(left: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              getText(
                  context: context,
                  title: title,
                  fontSize: 14,
                  color: textColor,
                  weight: FontWeight.w400),
              addVerticalSpace(5),
              getText(
                  context: context,
                  title: reportCount,
                  fontSize: 24,
                  color: textColor,
                  weight: FontWeight.w700),
              addVerticalSpace(5),
              Row(
                children: [
                  getText(
                      context: context,
                      title:
                          isTotalReport ? "View all reports" : "View reports",
                      fontSize: 10,
                      color: textColor,
                      weight: FontWeight.w400),
                  CommonImageView(
                    imagePath: AppFilePaths.arrowUpRight,
                    height: 7.34,
                    width: 7.34,
                    color: isTotalReport ? Colors.white : Colors.black,
                    fit: BoxFit.scaleDown,
                  ),
                ],
              )
            ],
          ),
        ));
  }
}

class Header extends StatelessWidget {
  const Header({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              CommonImageView(
                imagePath: AppFilePaths.avatar,
                height: 48,
                width: 48,
                fit: BoxFit.scaleDown,
              ),
              addHorizontalSpace(8),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getText(
                      context: context,
                      title: "Hello Peter 👋 ",
                      fontSize: 16,
                      color: AppColors.darkBrown,
                      weight: FontWeight.w500),
                  Row(
                    children: [
                      getText(
                          context: context,
                          title: "Akure, Ondo",
                          fontSize: 12,
                          color: AppColors.lightBrown,
                          weight: FontWeight.w400),
                      addHorizontalSpace(5),
                      Padding(
                        padding: const EdgeInsets.only(top: 2),
                        child: CommonImageView(
                          imagePath: AppFilePaths.arrowDown,
                          height: 12,
                          width: 12,
                          fit: BoxFit.scaleDown,
                        ),
                      ),
                    ],
                  ),
                ],
              )
            ],
          ),
          Stack(
            children: [
              InkWell(
                onTap: () => context.push(AppRoutes.notification),
                child: CommonImageView(
                  imagePath: AppFilePaths.notification,
                  height: 24,
                  width: 24,
                  fit: BoxFit.scaleDown,
                ),
              ),
              // if (hasUnread)
              Positioned(
                top: 0,
                right: 2,
                child: Container(
                  height: 8,
                  width: 8,
                  decoration: const BoxDecoration(
                      color: AppColors.primaryColor, shape: BoxShape.circle),
                ),
              )
            ],
          ),
        ],
      ),
    );
  }
}

class ReportCardData {
  final String title;
  final String reportCount;
  final bool isTotalReport;
  final Color bgColor;
  final Color textColor;
  final Color borderColor;

  ReportCardData({
    required this.title,
    required this.reportCount,
    required this.isTotalReport,
    required this.bgColor,
    required this.textColor,
    required this.borderColor,
  });
}
