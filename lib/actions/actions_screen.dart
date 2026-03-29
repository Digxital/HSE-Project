import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/actions/actions_details.dart';
import 'package:invera_hse/component/custom_app_bar.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';
import 'package:invera_hse/utils/route.dart';

class ActionScreen extends StatefulWidget {
  const ActionScreen({super.key});

  @override
  State<ActionScreen> createState() => _ActionScreenState();
}

class _ActionScreenState extends State<ActionScreen> {
  int selectedIndex = 0;

  final tabs = ["All", "Open", "In Progress"];

  final List<Map<String, dynamic>> allActions = [
    {
      "title": "Secure loose cable near main entrance",
      "status": "Open",
      "statusColor": AppColors.red,
      "statusBgColor": AppColors.orange2,
      "fromData": "Loose cable near entrance",
      "locationData": "Production Site – Main Entrance",
      "date": "Feb 5, 2026",
    },
    {
      "title": "Replace damaged fire extinguisher",
      "status": "In Progress",
      "statusColor": AppColors.orange,
      "statusBgColor": AppColors.lightOrange4,
      "fromData": "Fire extinguisher issue in storage room",
      "locationData": "Storage Area B",
      "date": "Feb 5, 2026",
    },
    {
      "title": "Install warning sign near wet floor area",
      "status": "Completed",
      "statusColor": AppColors.green,
      "statusBgColor": AppColors.lightGreen,
      "fromData": "Wet floor hazard near corridor",
      "locationData": "Wet floor hazard near corridor",
      "date": "Jan 30, 2026",
    },
  ];

  List<Map<String, dynamic>> get filteredActions {
    if (selectedIndex == 0) {
      // "All" tab - show all actions
      return allActions;
    } else if (selectedIndex == 1) {
      // "Open" tab - show only Open status
      return allActions.where((action) => action['status'] == 'Open').toList();
    } else {
      // "In Progress" tab - show only In Progress status
      return allActions
          .where((action) => action['status'] == 'In Progress')
          .toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                CustomAppBar(
                  text: "Action",
                  onTap: () => context.push(AppRoutes.bottomNav),
                ),
                addVerticalSpace(20),

                // TABS and FILTER
                Row(
                  children: [
                    // Tabs
                    Expanded(
                      child: Row(
                        children: List.generate(tabs.length, (index) {
                          final isSelected = selectedIndex == index;

                          return GestureDetector(
                            onTap: () {
                              setState(() {
                                selectedIndex = index;
                              });
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 18, vertical: 10),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? AppColors.lightOrange
                                    : Colors.transparent,
                                borderRadius: const BorderRadius.only(
                                    topLeft: Radius.circular(12),
                                    topRight: Radius.circular(12)),
                                border: Border(
                                  bottom: BorderSide(
                                      color: isSelected
                                          ? AppColors.secondaryColor
                                          : AppColors.grey7),
                                ),
                              ),
                              child: Column(
                                children: [
                                  getText(
                                    context: context,
                                    title: tabs[index],
                                    fontSize: 14,
                                    weight: FontWeight.w500,
                                    color: isSelected
                                        ? AppColors.secondaryColor
                                        : AppColors.grey8,
                                  ),
                                ],
                              ),
                            ),
                          );
                        }),
                      ),
                    ),

                    /// Filter Button
                    InkWell(
                      onTap: () => context.push(AppRoutes.filterScreen),
                      child: Container(
                          height: 48,
                          width: 48,
                          decoration: BoxDecoration(
                              color: AppColors.lightOrange5,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                  color: AppColors.neutralDarkGrey2)),
                          child: Center(
                            child: CommonImageView(
                                imagePath: AppFilePaths.filter,
                                height: 12,
                                width: 12,
                                fit: BoxFit.scaleDown),
                          )),
                    )
                  ],
                ),

                addVerticalSpace(40),

                // content body
                ...filteredActions.map((action) {
                  return ActionData(
                    onTap: () => context.push(AppRoutes.actionDetails, extra: {
                      'action': action,
                    }),
                    // Navigator.push(
                    //   context,
                    //   MaterialPageRoute(
                    //     builder: (_) => ActionsDetails(action: action),
                    //   ),
                    // ),
                    title: action['title'],
                    status: action['status'],
                    statusColor: action['statusColor'],
                    statusBgColor: action['statusBgColor'],
                    fromData: action['fromData'],
                    locationData: action['locationData'],
                    date: action['date'],
                  );
                }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class ActionData extends StatelessWidget {
  final String title;
  final String status;
  final String fromData;
  final String locationData;
  final String date;
  final Color statusBgColor;
  final Color statusColor;
  final dynamic onTap;
  const ActionData(
      {super.key,
      required this.title,
      required this.status,
      required this.fromData,
      required this.locationData,
      required this.date,
      this.statusBgColor = AppColors.orange2,
      this.statusColor = AppColors.red,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                getContainer(
                  context: context,
                  height: 48,
                  width: 48,
                  shape: BoxShape.circle,
                  decorationColor: Colors.black,
                  child: Center(
                    child: CommonImageView(
                        imagePath: AppFilePaths.actionWhite,
                        height: 24,
                        width: 24,
                        fit: BoxFit.scaleDown),
                  ),
                ),
                SizedBox(
                  // height: 150,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 150,
                        child: getText(
                            context: context,
                            title: title,
                            fontSize: 16,
                            maxLines: 2,
                            textOverflow: TextOverflow.ellipsis,
                            weight: FontWeight.w500),
                      ),
                      addVerticalSpace(20),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              getText(
                                  context: context,
                                  title: "From Report",
                                  fontSize: 12,
                                  weight: FontWeight.w400,
                                  color: AppColors.grey4),
                              addVerticalSpace(5),
                              SizedBox(
                                width: 150,
                                child: getText(
                                    context: context,
                                    title: fromData,
                                    fontSize: 14,
                                    weight: FontWeight.w400),
                              ),
                            ],
                          ),
                          addVerticalSpace(10),
                          Row(
                            children: [
                              SizedBox(
                                child: getText(
                                    context: context,
                                    title: "Due: ",
                                    fontSize: 12,
                                    weight: FontWeight.w400,
                                    color: AppColors.red),
                              ),
                              SizedBox(
                                child: getText(
                                    context: context,
                                    title: date,
                                    fontSize: 12,
                                    weight: FontWeight.w400,
                                    color: AppColors.red),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                SizedBox(
                  // height: 180,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      getContainer(
                          context: context,
                          width: 100,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          borderRadius: BorderRadius.circular(20),
                          decorationColor: statusBgColor,
                          child: getText(
                              context: context,
                              textAlign: TextAlign.center,
                              title: status,
                              color: statusColor)),
                      addVerticalSpace(30),
                      Column(
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
                                    title: locationData,
                                    fontSize: 14,
                                    weight: FontWeight.w400,
                                    textOverflow: TextOverflow.ellipsis,
                                    maxLines: 2),
                              ),
                            ],
                          ),
                          addVerticalSpace(25),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(
            color: AppColors.lightGrey6,
            height: 20,
          ),
          addVerticalSpace(10)
        ],
      ),
    );
  }
}
