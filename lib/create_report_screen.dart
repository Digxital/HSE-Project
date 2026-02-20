import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/custom_dropdown_button.dart';
import 'package:invera_hse/component/custom_textarea.dart';
import 'package:invera_hse/component/custom_textfield.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';

class CreateReportScreen extends StatefulWidget {
  const CreateReportScreen({super.key});

  @override
  State<CreateReportScreen> createState() => _CreateReportScreenState();
}

class _CreateReportScreenState extends State<CreateReportScreen> {
  final _formKey = GlobalKey<FormState>();

  String? recordCategory;
  String? riskLevel;
  DateTime? eventDate;
  TimeOfDay? eventTime;

  int selected = 0;

  final titleCtrl = TextEditingController();
  final descCtrl = TextEditingController();
  final areaCtrl = TextEditingController();
  final peopleCtrl = TextEditingController();
  final injuryCtrl = TextEditingController();
  final equipmentCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      InkWell(
                        onTap: () => context.pop(),
                        child: CommonImageView(
                          imagePath: AppFilePaths.arrowBack,
                          height: 24,
                          width: 24,
                          fit: BoxFit.scaleDown,
                        ),
                      ),
                      addVerticalSpace(40),
                      Container(
                        width: double.infinity,
                        height: 48,
                        padding: const EdgeInsets.all(4),
                        decoration: BoxDecoration(
                          color: AppColors.lightOrange,
                          borderRadius: BorderRadius.circular(40),
                        ),
                        child: LayoutBuilder(
                          builder: (context, constraints) {
                            final width = constraints.maxWidth / 2;
                            return Stack(
                              children: [
                                /// ACTIVE SLIDER
                                AnimatedPositioned(
                                  duration: const Duration(milliseconds: 250),
                                  curve: Curves.easeInOut,
                                  left: selected == 0 ? 0 : width,
                                  top: 0,
                                  bottom: 0,
                                  child: Container(
                                    width: width,
                                    decoration: BoxDecoration(
                                      color: AppColors.primaryColor,
                                      borderRadius: BorderRadius.circular(40),
                                    ),
                                  ),
                                ),

                                /// LABELS
                                Row(
                                  children: [
                                    _buildReportPage("Incident", 0),
                                    _buildReportPage("Hazard", 1),
                                  ],
                                )
                              ],
                            );
                          },
                        ),
                      ),
                      addVerticalSpace(25),
                      getText(
                          context: context,
                          title: "Report Details (Step 1)",
                          fontSize: 20,
                          weight: FontWeight.w500),
                      addVerticalSpace(20),
                      Form(
                        key: _formKey,
                        child: Column(
                          children: [
                            CustomTextField(
                              controller: titleCtrl,
                              title: "Title",
                              hintText: "Placeholder",
                            ),
                            addVerticalSpace(20),
                            CustomTextArea(
                              controller: descCtrl,
                              title: "Description",
                              hintText: "Placeholder",
                              isFilled: true,
                            ),
                            addVerticalSpace(20),
                            CustomDropdownButton(
                              title: "Category",
                              hintText: "Select category",
                              items: const [
                                DropdownMenuItem(
                                  value: "hazard",
                                  child: Text("Hazard"),
                                ),
                                DropdownMenuItem(
                                    value: "observation",
                                    child: Text("Observation")),
                                DropdownMenuItem(
                                    value: "incident", child: Text("Incident")),
                              ],
                              onChanged: (v) => recordCategory = v,
                            ),
                            addVerticalSpace(20),
                            CustomDropdownButton(
                              title: "Site / Location",
                              hintText: "Select Location",
                              items: const [
                                DropdownMenuItem(
                                  value: "hazard",
                                  child: Text("Hazard"),
                                ),
                                DropdownMenuItem(
                                    value: "observation",
                                    child: Text("Observation")),
                                DropdownMenuItem(
                                    value: "incident", child: Text("Incident")),
                              ],
                              onChanged: (v) => recordCategory = v,
                            ),
                            addVerticalSpace(20),
                            CustomTextField(
                              controller: titleCtrl,
                              title: "Specific Area",
                              hintText: "Placeholder",
                            ),
                            addVerticalSpace(20),
                            GestureDetector(
                              onTap: () async {
                                eventDate = await showDatePicker(
                                  context: context,
                                  firstDate: DateTime(2020),
                                  lastDate: DateTime.now(),
                                  initialDate: DateTime.now(),
                                );
                                setState(() {});
                              },
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  getText(
                                      context: context,
                                      title: "Event Date",
                                      fontSize: 12,
                                      weight: FontWeight.w400,
                                      color: AppColors.grey3),
                                  addVerticalSpace(10),
                                  getContainer(
                                      context: context,
                                      height: 48,
                                      width: double.infinity,
                                      decorationColor: AppColors.grey2,
                                      borderRadius: BorderRadius.circular(8),
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 10),
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            getText(
                                                context: context,
                                                title: eventDate == null
                                                    ? "DD/MM/YYYY"
                                                    : eventDate!
                                                        .toIso8601String()
                                                        .split("T")
                                                        .first,
                                                fontSize: 12,
                                                weight: FontWeight.w400,
                                                color: AppColors.lightBrown2),
                                            CommonImageView(
                                              imagePath: AppFilePaths.calendar,
                                              height: 16,
                                              width: 16,
                                              fit: BoxFit.scaleDown,
                                            )
                                          ],
                                        ),
                                      )),
                                ],
                              ),
                            ),
                            addVerticalSpace(20),
                            GestureDetector(
                              onTap: () async {
                                eventTime = await showTimePicker(
                                  context: context,
                                  initialTime: TimeOfDay.now(),
                                );
                                setState(() {});
                              },
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  getText(
                                      context: context,
                                      title: "Event Time",
                                      fontSize: 12,
                                      weight: FontWeight.w400,
                                      color: AppColors.grey3),
                                  addVerticalSpace(10),
                                  getContainer(
                                      context: context,
                                      height: 48,
                                      width: double.infinity,
                                      decorationColor: AppColors.grey2,
                                      borderRadius: BorderRadius.circular(8),
                                      child: Padding(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 10),
                                        child: Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            getText(
                                                context: context,
                                                title: eventTime == null
                                                    ? "00:00"
                                                    : eventTime!
                                                        .format(context),
                                                fontSize: 12,
                                                weight: FontWeight.w400,
                                                color: AppColors.lightBrown2),
                                            CommonImageView(
                                              imagePath: AppFilePaths.calendar,
                                              height: 16,
                                              width: 16,
                                              fit: BoxFit.scaleDown,
                                            )
                                          ],
                                        ),
                                      )),
                                ],
                              ),
                            ),
                            addVerticalSpace(20),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
              child: SizedBox(
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
                    ),
                  ),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () {
                        // context.push(AppRoutes.login);
                      },
                      child: const Center(
                        child: Text(
                          "Next",
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
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
    );
  }

  Widget _buildReportPage(String text, int index) {
    final active = selected == index;

    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => selected = index),
        child: Center(
          child: AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w400,
                color: active ? Colors.white : AppColors.neutralDarkGrey),
            child: Text(text),
          ),
        ),
      ),
    );
  }
}
