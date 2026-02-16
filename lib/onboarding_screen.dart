import 'package:flutter/material.dart';
import 'package:invera_hse/api/auth_service.dart';
import 'package:invera_hse/component/get_text.dart';
import 'package:invera_hse/component/screen_properties.dart';
import 'package:invera_hse/utils/app_colours.dart';
import 'package:invera_hse/utils/app_file_paths.dart';
import 'package:invera_hse/utils/common_image_view.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int currentIndex = 0;
  PageController? _controller;

  @override
  void initState() {
    _controller = PageController(initialPage: 0);
    super.initState();
  }

  @override
  void dispose() {
    _controller!.dispose();
    super.dispose();
  }

  _storeOnBoardingInfo() async {
    await AuthService.storeOnboardedUser();
    bool onboard = await AuthService.getOnboardedUser();
    print("onbaord: $onboard");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Stack(
      children: [
        SizedBox.expand(
            child: PageView.builder(
                controller: _controller,
                itemCount: contents.length,
                onPageChanged: (int index) {
                  setState(() {
                    currentIndex = index;
                  });
                },
                itemBuilder: (_, i) {
                  return Stack(
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 0),
                        child: Stack(
                          children: [
                            CommonImageView(
                              imagePath: "${contents[i].image}",
                              fit: BoxFit.scaleDown,
                            ),
                            Container(
                              width: double.infinity,
                              height: double.infinity,
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  begin: Alignment.topCenter,
                                  end: Alignment.bottomCenter,
                                  colors: [
                                    Colors.transparent,
                                    Colors.black.withOpacity(1),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  );
                })),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: Container(
            height: 379,
            width: double.infinity,
            decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(30),
                    topRight: Radius.circular(30))),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: List.generate(
                      contents.length,
                      (index) => buildDot(index, context),
                    ),
                  ),
                  addVerticalSpace(15),
                  getText(
                      context: context,
                      title: "${contents[currentIndex].title}",
                      fontSize: 24,
                      weight: FontWeight.w700),
                  addVerticalSpace(5),
                  getText(
                    context: context,
                    title: "${contents[currentIndex].description}",
                    fontSize: 14,
                    weight: FontWeight.w400,
                    color: AppColors.neutralDarkGrey,
                  ),
                  addVerticalSpace(30),
                  if (currentIndex < contents.length - 1)
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        GestureDetector(
                          onTap: () {
                            _controller!.jumpToPage(contents.length - 1);
                          },
                          child: Row(
                            children: [
                              const Text(
                                "Skip",
                                style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w500,
                                    color: AppColors.lightGrey),
                              ),
                              addHorizontalSpace(5),
                              CommonImageView(
                                imagePath: AppFilePaths.skip,
                                height: 16,
                                width: 16,
                                fit: BoxFit.scaleDown,
                              ),
                            ],
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            _controller!.nextPage(
                              duration: const Duration(milliseconds: 300),
                              curve: Curves.easeInOut,
                            );
                          },
                          child: Container(
                            height: 44,
                            width: 44,
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(12),
                                gradient: const LinearGradient(
                                  colors: [
                                    AppColors.secondaryColor,
                                    AppColors.primaryColor
                                  ],
                                )),
                            child: const Icon(
                              Icons.arrow_forward_ios_rounded,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ],
                    )
                  else
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
                            onTap: () {
                              _storeOnBoardingInfo();
                            },
                            child: const Center(
                              child: Text(
                                "Get Started",
                                style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
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
          ),
        ),
      ],
    ));
  }

  Padding buildDot(int index, BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(right: index < 2 ? 7 : 0),
      child: Container(
        height: currentIndex == index ? 10 : 7,
        width: currentIndex == index ? 10 : 7,
        decoration: BoxDecoration(
            color: currentIndex == index
                ? AppColors.primaryColor
                : AppColors.lightRed,
            shape: BoxShape.circle),
      ),
    );
  }
}

class UnboardingContent {
  String? image;
  String? title;
  String? description;

  UnboardingContent({this.image, this.title, this.description});
}

List<UnboardingContent> contents = [
  UnboardingContent(
    title: "Safety Starts With You",
    image: AppFilePaths.onboarding1,
    description:
        "Report hazards and incidents quickly.\nHelp keep everyone safe.",
  ),
  UnboardingContent(
      title: 'Report in Seconds',
      image: AppFilePaths.onboarding2,
      description: "Create reports fast.\nAdd photos, voice, location easily."),
  UnboardingContent(
      title: 'Safety Made Visible',
      image: AppFilePaths.onboarding3,
      description: "Track actions and see progress in\nreal time."),
];
