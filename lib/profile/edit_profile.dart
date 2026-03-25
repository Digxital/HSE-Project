import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:invera_hse/component/custom_app_bar.dart';
import 'package:invera_hse/component/custom_textfield.dart';
import 'package:invera_hse/component/get_container.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/constant/extension.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  State<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends State<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  final _firstNameController = TextEditingController();
  final _surnameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

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
                CustomAppBar(
                  text: "Profile",
                  onTap: () => context.pop(),
                ),
                addVerticalSpace(40),
                Align(
                  alignment: Alignment.center,
                  child: Stack(
                    children: [
                      CommonImageView(
                        imagePath: AppFilePaths.avatar2,
                        height: 98,
                        width: 98,
                        fit: BoxFit.scaleDown,
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: getContainer(
                          context: context,
                          height: 30,
                          width: 30,
                          decorationColor: AppColors.bgColor,
                          shape: BoxShape.circle,
                          child: Center(
                            child: CommonImageView(
                              imagePath: AppFilePaths.camera,
                              height: 18,
                              width: 18,
                              fit: BoxFit.scaleDown,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                addVerticalSpace(20),
                getText(
                    context: context,
                    title: "Basic Details",
                    fontSize: 16,
                    weight: FontWeight.w500),
                addVerticalSpace(20),
                Form(
                  key: _formKey,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CustomTextField(
                        controller: _firstNameController,
                        title: "First Name",
                        textInputType: TextInputType.name,
                        hintText: "John",
                        validator: (val) {
                          if (!val!.isValidEmail) {
                            return 'Enter a valid name';
                          }
                          return null;
                        },
                      ),
                      addVerticalSpace(20),
                      CustomTextField(
                        controller: _surnameController,
                        title: "Surname",
                        textInputType: TextInputType.name,
                        hintText: "Matthews",
                        validator: (val) {
                          if (!val!.isValidPassword) {
                            return 'Enter a valid name';
                          }
                          return null;
                        },
                      ),
                      addVerticalSpace(20),
                      CustomTextField(
                        controller: _emailController,
                        title: "Email",
                        textInputType: TextInputType.emailAddress,
                        hintText: "john@inveraenergy.com",
                        validator: (val) {
                          if (!val!.isValidEmail) {
                            return 'Enter a valid email';
                          }
                          return null;
                        },
                      ),
                      addVerticalSpace(20),
                      CustomTextField(
                        controller: _phoneController,
                        title: "Phone Number",
                        textInputType: TextInputType.phone,
                        hintText: "+234 807 526 5161",
                        validator: (val) {
                          if (!val!.isValidEmail) {
                            return 'Enter a valid phone number';
                          }
                          return null;
                        },
                      ),
                      addVerticalSpace(40),
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
                                  "Save Changes",
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
        ),
      ),
    );
  }
}
