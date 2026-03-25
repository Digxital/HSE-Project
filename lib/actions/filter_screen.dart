import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/custom_app_bar.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';

class FilterScreen extends StatefulWidget {
  const FilterScreen({super.key});

  @override
  State<FilterScreen> createState() => _FilterScreenState();
}

class _FilterScreenState extends State<FilterScreen> {
  String selectedValue = "All";

  final List<String> options = [
    "All",
    "Open",
    "In Progress",
    "Completed",
  ];

  @override
  void initState() {
    super.initState();
    selectedValue = options.first; // default = "All"
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            addVerticalSpace(10),
            CustomAppBar(
                text: "Filter",
                more: "Reset",
                isMore: true,
                onTapMore: () {
                  setState(() {
                    selectedValue = options.first; // Reset to "All"
                  });
                },
                onTap: () => context.pop()),
            addVerticalSpace(20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  getText(
                      context: context,
                      title: "Sort by",
                      fontSize: 16,
                      weight: FontWeight.w500),

                  addVerticalSpace(20),

                  /// Options
                  ...options.map((option) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      child: InkWell(
                        onTap: () {
                          setState(() {
                            selectedValue = option;
                          });
                        },
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            getText(
                                context: context,
                                title: option,
                                fontSize: 16,
                                weight: FontWeight.w500),

                            /// Custom radio
                            _buildRadio(option == selectedValue),
                          ],
                        ),
                      ),
                    );
                  }),
                  addVerticalSpace(200),
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
                          onTap: () => context.pop(),
                          child: const Center(
                            child: Text(
                              "Show Result",
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
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRadio(bool isSelected) {
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: isSelected ? Colors.black : Colors.black,
        ),
      ),
      child: isSelected
          ? Center(
              child: Container(
                width: 10,
                height: 10,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.black,
                ),
              ),
            )
          : null,
    );
  }
}
