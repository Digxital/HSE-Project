import 'package:flutter/material.dart';
import 'package:invera_hse/api/auth_service.dart';
import 'package:invera_hse/utils/router.dart';
import 'package:invera_hse/view_model/login_view_model.dart';
import 'package:invera_hse/view_model/profile_view_model.dart';
import 'package:invera_hse/view_model/report_view_model.dart';
import 'package:invera_hse/view_model/theme_provider.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final themeProvider = ThemeProvider();
  await themeProvider.initializeTheme();
  final bool isLoggedIn = await AuthService.getLoggedInUser();
  final bool isOnboardedUser = await AuthService.getOnboardedUser();
  runApp(MyApp(
      themeProvider: themeProvider,
      isLoggedIn: isLoggedIn,
      isOnBoarded: isOnboardedUser));
}

class MyApp extends StatelessWidget {
  final ThemeProvider themeProvider;
  final bool isLoggedIn;
  final bool isOnBoarded;

  const MyApp(
      {super.key,
      required this.themeProvider,
      required this.isLoggedIn,
      required this.isOnBoarded});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LoginViewModel()),
        ChangeNotifierProvider(create: (_) => ProfileViewModel()),
        ChangeNotifierProvider(create: (_) => ReportViewModel()),
        ChangeNotifierProvider.value(value: themeProvider),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, _) {
          return GestureDetector(
            onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
            child: MaterialApp.router(
              debugShowCheckedModeBanner: false,
              title: 'Flutter Demo',
              theme: themeProvider.themeData,
              routerConfig: AppRouter.router,
            ),
          );
        },
      ),
    );
  }
}
