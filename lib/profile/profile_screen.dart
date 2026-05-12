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
import 'package:invera_hse/view_model/theme_provider.dart';
import 'package:provider/provider.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Theme.of(context).colorScheme.surface,
        body: SingleChildScrollView(
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CustomAppBar(
                    text: "Profile",
                    onTap: () => context.push(AppRoutes.bottomNav),
                  ),
                  addVerticalSpace(30),
                  const ProfileOverview(),
                  addVerticalSpace(35),
                  const ReportCard(
                      title: "Reports Submitted", description: "8"),
                  addVerticalSpace(15),
                  Row(
                    children: [
                      const ActionCard(
                          title: "Actions Assigned", description: "3"),
                      addHorizontalSpace(15),
                      const ActionCard(
                          title: "Actions Completed", description: "2"),
                      addHorizontalSpace(15),
                    ],
                  ),
                  addVerticalSpace(70),
                  ProfileTile(
                      onTap: () => context.push(AppRoutes.editProfile),
                      icon: AppFilePaths.profile3,
                      text: "My Profile"),
                  addVerticalSpace(10),
                  ProfileTile(
                      onTap: () => context.push(AppRoutes.certification),
                      icon: AppFilePaths.personalCard,
                      text: "Certification"),
                  addVerticalSpace(10),
                  ProfileTile(
                      onTap: () =>
                          Provider.of<ThemeProvider>(context, listen: false)
                              .toggleTheme(),
                      icon: AppFilePaths.sun,
                      text: "Night Mode",
                      isSwitch: true),
                  addVerticalSpace(10),
                  ProfileTile(
                      onTap: () {},
                      icon: AppFilePaths.logout,
                      text: "Logout",
                      isLogout: true),
                ],
              ),
            ),
          ),
        ));
  }
}

class ProfileTile extends StatelessWidget {
  final String icon;
  final String text;
  final bool isSwitch;
  final bool isLogout;
  final dynamic onTap;
  const ProfileTile(
      {super.key,
      required this.icon,
      required this.text,
      this.isSwitch = false,
      this.isLogout = false,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    CommonImageView(
                        imagePath: icon,
                        height: 18,
                        width: 18,
                        color: Theme.of(context).colorScheme.onSurface,
                        fit: BoxFit.scaleDown),
                    addHorizontalSpace(15),
                    getText(
                        context: context,
                        title: text,
                        fontSize: 14,
                        color: Theme.of(context).colorScheme.onSurface,
                        weight: FontWeight.w400)
                  ],
                ),
                isSwitch
                    ? Consumer<ThemeProvider>(
                        builder: (context, themeProvider, _) {
                          final isDarkMode =
                              themeProvider.themeData.brightness ==
                                  Brightness.dark;
                          return CommonImageView(
                              imagePath: isDarkMode
                                  ? AppFilePaths.toggleDarkMode
                                  : AppFilePaths.toggleOff,
                              height: 17,
                              width: 34,
                              fit: BoxFit.scaleDown);
                        },
                      )
                    : isLogout
                        ? const SizedBox()
                        : CommonImageView(
                            imagePath: AppFilePaths.arrowForward,
                            height: 20,
                            width: 20,
                            fit: BoxFit.scaleDown),
              ],
            ),
          ),
        ),
        const Divider(thickness: 0.2, color: AppColors.lightGrey4)
      ],
    );
  }
}

class ActionCard extends StatelessWidget {
  final String title;
  final String description;
  const ActionCard({
    super.key,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: getContainer(
          context: context,
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 30),
          borderRadius: BorderRadius.circular(20),
          decorationColor: AppColors.lightGrey7,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              getText(
                  context: context,
                  title: title,
                  fontSize: 12,
                  weight: FontWeight.w400,
                  color: Theme.of(context).textTheme.bodyMedium?.color),
              addVerticalSpace(5),
              getText(
                  context: context,
                  title: description,
                  fontSize: 18,
                  weight: FontWeight.w500,
                  color: Theme.of(context).textTheme.bodyLarge?.color),
            ],
          )),
    );
  }
}

class ReportCard extends StatelessWidget {
  final String title;
  final String description;
  const ReportCard({
    super.key,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: getContainer(
          context: context,
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 30),
          borderRadius: BorderRadius.circular(20),
          decorationColor: AppColors.lightOrange2,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              getText(
                  context: context,
                  title: title,
                  fontSize: 12,
                  weight: FontWeight.w400,
                  color: Theme.of(context).textTheme.bodyMedium?.color),
              addVerticalSpace(5),
              getText(
                  context: context,
                  title: description,
                  fontSize: 18,
                  weight: FontWeight.w500,
                  color: Theme.of(context).textTheme.bodyLarge?.color),
            ],
          )),
    );
  }
}

class ProfileOverview extends StatelessWidget {
  const ProfileOverview({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CommonImageView(
          imagePath: AppFilePaths.avatar2,
          height: 50,
          width: 50,
          fit: BoxFit.scaleDown,
        ),
        addHorizontalSpace(20),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            getText(
              context: context,
              title: "John Matthews",
              fontSize: 16,
              weight: FontWeight.w500,
              color: Theme.of(context).textTheme.bodyLarge?.color,
            ),
            addVerticalSpace(5),
            getText(
                context: context,
                title: "john@inveraenergy.com",
                fontSize: 16,
                weight: FontWeight.w400,
                color: Theme.of(context).colorScheme.onSurface),
          ],
        )
      ],
    );
  }
}
