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
import 'package:invera_hse/utils/route.dart';

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
  int step = 1;

  int? selectedLikelihood;
  int? selectedSeverity;

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
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              InkWell(
                onTap: () {
                  setState(() {
                    if (step == 1) {
                      context.pop();
                    } else if (step == 2) {
                      step = 1;
                    } else if (step == 3) {
                      step = 2;
                    }
                  });
                },
                child: CommonImageView(
                  imagePath: AppFilePaths.arrowBack,
                  height: 24,
                  width: 24,
                  fit: BoxFit.scaleDown,
                ),
              ),
              addVerticalSpace(30),
              Container(
                width: double.infinity,
                height: 45,
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
              addVerticalSpace(15),
              Visibility(
                visible: step == 1 ? true : false,
                child: Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
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
                                      value: "incident",
                                      child: Text("Incident")),
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
                                      value: "incident",
                                      child: Text("Incident")),
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
                                                imagePath:
                                                    AppFilePaths.calendar,
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
                                                imagePath:
                                                    AppFilePaths.calendar,
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
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              Visibility(
                visible: step == 2 ? true : false,
                child: Expanded(
                    child: SingleChildScrollView(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      getText(
                          context: context,
                          title: "Evidence & Attachments (Step 2)",
                          fontSize: 20,
                          weight: FontWeight.w500),
                      addVerticalSpace(20),
                      GestureDetector(
                        onTap: () {},
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            getText(
                                context: context,
                                title: "Photo Attachment (Optional)",
                                fontSize: 12,
                                weight: FontWeight.w400,
                                color: AppColors.grey3),
                            addVerticalSpace(10),
                            InkWell(
                              onTap: () {},
                              child: getContainer(
                                  context: context,
                                  height: 146,
                                  width: double.infinity,
                                  decorationColor: AppColors.grey2,
                                  borderRadius: BorderRadius.circular(8),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      CommonImageView(
                                        imagePath: AppFilePaths.gallery,
                                        height: 16,
                                        width: 16,
                                        fit: BoxFit.scaleDown,
                                      ),
                                      addHorizontalSpace(5),
                                      getText(
                                          context: context,
                                          title: "File Upload",
                                          fontSize: 12,
                                          weight: FontWeight.w400),
                                    ],
                                  )),
                            ),
                          ],
                        ),
                      ),
                      addVerticalSpace(20),
                      GestureDetector(
                        onTap: () {},
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            addVerticalSpace(10),
                            CustomTextArea(
                              controller: descCtrl,
                              title: "Additional Information (Optional)",
                              hintText: "Placeholder",
                              isFilled: true,
                              isSuffix: false,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )),
              ),
              Visibility(
                  visible: step == 3 ? true : false,
                  child: Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          getText(
                              context: context,
                              title: "Evidence & Attachments (Step 3)",
                              fontSize: 20,
                              weight: FontWeight.w500),
                          getText(
                              context: context,
                              title:
                                  "Select severity and likelihood to calcuslate risk level",
                              fontSize: 12,
                              weight: FontWeight.w400,
                              color: AppColors.grey3),
                          addVerticalSpace(10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const RiskLevelCard(),
                              addVerticalSpace(30),
                              getText(
                                context: context,
                                title: "Likelihood",
                                fontSize: 12,
                                weight: FontWeight.w400,
                              ),
                              addVerticalSpace(10),
                              GridView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                gridDelegate:
                                    const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 5,
                                  crossAxisSpacing: 8,
                                  mainAxisSpacing: 8,
                                  childAspectRatio: 1.0,
                                ),
                                itemCount: 25,
                                itemBuilder: (context, index) {
                                  final chipNumber = index + 1;
                                  final isSelected =
                                      selectedLikelihood == chipNumber;

                                  // Determine colors based on chip number
                                  Color bgColor;
                                  Color digitColor;
                                  Color borderColor;

                                  if (chipNumber <= 7) {
                                    // Green range
                                    bgColor = isSelected
                                        ? AppColors.green
                                        : AppColors.lightGreen;
                                    digitColor = isSelected
                                        ? Colors.white
                                        : AppColors.green;
                                    borderColor = AppColors.green;
                                  } else if (chipNumber <= 14) {
                                    // Orange range
                                    bgColor = isSelected
                                        ? AppColors.orange
                                        : AppColors.lightOrange4;
                                    digitColor = isSelected
                                        ? Colors.white
                                        : AppColors.orange;
                                    borderColor = AppColors.orange;
                                  } else {
                                    // Red range (15-25)
                                    bgColor = isSelected
                                        ? AppColors.red
                                        : AppColors.lightOrange;
                                    digitColor = isSelected
                                        ? Colors.white
                                        : AppColors.red;
                                    borderColor = AppColors.red;
                                  }

                                  return GestureDetector(
                                    onTap: () => setState(() {
                                      selectedLikelihood =
                                          isSelected ? null : chipNumber;
                                    }),
                                    child: CustomChip(
                                      digit: chipNumber.toString(),
                                      bgColor: bgColor,
                                      digitColor: digitColor,
                                      borderColor: borderColor,
                                    ),
                                  );
                                },
                              )
                            ],
                          ),
                          addVerticalSpace(40),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              getText(
                                context: context,
                                title: "Severity",
                                fontSize: 12,
                                weight: FontWeight.w400,
                              ),
                              addVerticalSpace(10),
                              GridView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                gridDelegate:
                                    const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 5,
                                  crossAxisSpacing: 8,
                                  mainAxisSpacing: 8,
                                  childAspectRatio: 1.0,
                                ),
                                itemCount: 25,
                                itemBuilder: (context, index) {
                                  final chipNumber = index + 1;
                                  final isSelected =
                                      selectedSeverity == chipNumber;

                                  // Determine colors based on chip number
                                  Color bgColor;
                                  Color digitColor;
                                  Color borderColor;

                                  if (chipNumber <= 7) {
                                    // Green range
                                    bgColor = isSelected
                                        ? AppColors.green
                                        : AppColors.lightGreen;
                                    digitColor = isSelected
                                        ? Colors.white
                                        : AppColors.green;
                                    borderColor = AppColors.green;
                                  } else if (chipNumber <= 14) {
                                    // Orange range
                                    bgColor = isSelected
                                        ? AppColors.secondaryColor
                                        : const Color(0xFFFFF3E0);
                                    digitColor = isSelected
                                        ? Colors.white
                                        : AppColors.secondaryColor;
                                    borderColor = AppColors.secondaryColor;
                                  } else {
                                    // Red range (15-25)
                                    bgColor = isSelected
                                        ? AppColors.primaryColor
                                        : const Color(0xFFFFEBEE);
                                    digitColor = isSelected
                                        ? Colors.white
                                        : AppColors.primaryColor;
                                    borderColor = AppColors.primaryColor;
                                  }

                                  return GestureDetector(
                                    onTap: () => setState(() {
                                      selectedSeverity =
                                          isSelected ? null : chipNumber;
                                    }),
                                    child: CustomChip(
                                      digit: chipNumber.toString(),
                                      bgColor: bgColor,
                                      digitColor: digitColor,
                                      borderColor: borderColor,
                                    ),
                                  );
                                },
                              )
                            ],
                          ),
                          addVerticalSpace(40),
                          const RiskLevelColorGuide(),
                          addVerticalSpace(40),
                          const RiskCategory(),
                          addVerticalSpace(20)
                        ],
                      ),
                    ),
                  )),
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 15),
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
                          setState(() {
                            if (step == 1) {
                              step = 2;
                            } else if (step == 2) {
                              step = 3;
                            } else if (step == 3) {
                              context.push(AppRoutes.successScreen);
                            }
                          });
                        },
                        child: Center(
                          child: Text(
                            step == 3 ? "Submit Report" : "Next",
                            style: const TextStyle(
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

class CustomChip extends StatelessWidget {
  final String digit;
  final Color digitColor;
  final Color bgColor;
  final Color borderColor;
  const CustomChip(
      {super.key,
      required this.digit,
      required this.digitColor,
      required this.bgColor,
      required this.borderColor});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: getContainer(
          context: context,
          height: 48,
          width: 62,
          borderRadius: BorderRadius.circular(8),
          decorationColor: bgColor,
          border: Border.all(color: borderColor),
          child: Center(
            child: getText(
                context: context,
                title: digit,
                fontSize: 16,
                weight: FontWeight.w500,
                color: digitColor),
          )),
    );
  }
}

class RiskLevelCard extends StatelessWidget {
  const RiskLevelCard({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return getContainer(
        context: context,
        height: 88,
        width: double.infinity,
        decorationColor: AppColors.lightOrange,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getText(
                      context: context,
                      title: "Current Risk Level",
                      fontSize: 12,
                      weight: FontWeight.w400,
                      color: AppColors.grey3),
                  getText(
                      context: context,
                      title: "Score: 8",
                      fontSize: 12,
                      weight: FontWeight.w400),
                ],
              ),
              getContainer(
                  context: context,
                  height: 40,
                  width: 92,
                  borderRadius: BorderRadius.circular(24),
                  decorationColor: AppColors.orange,
                  child: Center(
                    child: getText(
                        context: context,
                        title: "Medium",
                        fontSize: 16,
                        weight: FontWeight.w400,
                        color: Colors.white),
                  ))
            ],
          ),
        ));
  }
}

class RiskCategory extends StatelessWidget {
  const RiskCategory({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return getContainer(
        context: context,
        height: 124,
        width: double.infinity,
        decorationColor: AppColors.lightOrange,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getText(
                      context: context,
                      title: "Severity",
                      fontSize: 12,
                      weight: FontWeight.w400,
                      color: AppColors.grey3),
                  getText(
                      context: context,
                      title: "Moderate",
                      fontSize: 14,
                      weight: FontWeight.w500),
                  getText(
                      context: context,
                      title: "Medical treatment,\nContained spill",
                      fontSize: 12,
                      weight: FontWeight.w400,
                      color: AppColors.grey3),
                ],
              ),
              Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getText(
                      context: context,
                      title: "Likelihood",
                      fontSize: 12,
                      weight: FontWeight.w400,
                      color: AppColors.grey3),
                  getText(
                      context: context,
                      title: "Possible",
                      fontSize: 14,
                      weight: FontWeight.w500),
                  getText(
                      context: context,
                      title: "Might occur",
                      fontSize: 12,
                      weight: FontWeight.w400,
                      color: AppColors.grey3),
                ],
              ),
            ],
          ),
        ));
  }
}

class RiskLevelColorGuide extends StatelessWidget {
  const RiskLevelColorGuide({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return getContainer(
        context: context,
        height: 87,
        width: double.infinity,
        decorationColor: AppColors.lightOrange,
        borderRadius: BorderRadius.circular(12),
        child: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              RiskRange(range: "Low (1-6)", rangeColor: AppColors.green),
              RiskRange(range: "Medium (7-12)", rangeColor: AppColors.orange),
              RiskRange(range: "Hard (13-25)", rangeColor: AppColors.red),
            ],
          ),
        ));
  }
}

class RiskRange extends StatelessWidget {
  final String range;
  final Color rangeColor;
  const RiskRange({super.key, required this.range, required this.rangeColor});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        getContainer(
            context: context,
            height: 15,
            width: 15,
            borderRadius: BorderRadius.circular(4),
            decorationColor: rangeColor),
        addHorizontalSpace(5),
        getText(
            context: context,
            title: range,
            fontSize: 12,
            weight: FontWeight.w400,
            color: AppColors.grey3),
      ],
    );
  }
}
