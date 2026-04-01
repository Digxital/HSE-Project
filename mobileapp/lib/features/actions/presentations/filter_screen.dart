// ─────────────────────────────────────────────────────────────────────────────
// lib/features/action/view/filter_screen.dart
// ─────────────────────────────────────────────────────────────────────────────

import 'package:aegix/core/themes/app_colors.dart';
import 'package:aegix/core/utils/custom_text.dart';
import 'package:aegix/shared/widgets/custom_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:go_router/go_router.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../providers/action_provider.dart';

class FilterScreen extends HookConsumerWidget {
  const FilterScreen({super.key});

  static const _options = ["All", "Open", "In Progress", "Completed"];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Local hook state – selection lives only within this screen
    final selected = useState(_options.first);

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 10.h),
            CustomAppBar(
              text: "Filter",
              more: "Reset",
              isMore: true,
              onTapMore: () => selected.value = _options.first,
              onTap: () => context.pop(),
            ),
            SizedBox(height: 20.h),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CustomText(
                    text: "Sort by",
                    fontSize: 16.sp,
                    fontWeight: FontWeight.w500,
                  ),
                  SizedBox(height: 20.h),

                  ..._options.map((option) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      child: InkWell(
                        onTap: () => selected.value = option,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            CustomText(
                              text: option,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                            _RadioDot(isSelected: option == selected.value),
                          ],
                        ),
                      ),
                    );
                  }),

                  SizedBox(height: 200.h),

                  SizedBox(
                    width: double.infinity,
                    height: 44,
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        gradient: const LinearGradient(
                          colors: [
                            AppColors.secondaryColor,
                            AppColors.primaryColor,
                          ],
                        ),
                      ),
                      child: Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () {
                            final idx = _options.indexOf(selected.value);
                            ref.read(actionTabIndexProvider.notifier).state =
                                idx;
                            context.pop();
                          },
                          child: const Center(
                            child: Text(
                              "Show Result",
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.white,
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
          ],
        ),
      ),
    );
  }
}

class _RadioDot extends StatelessWidget {
  final bool isSelected;
  const _RadioDot({required this.isSelected});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: Colors.black),
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
