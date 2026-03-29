import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:invera_hse/utils/router.dart';
import 'package:invera_hse/view_model/profile_view_model.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProfileViewModel()),
      ],
      child: GestureDetector(
        onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
        child: MaterialApp.router(
          debugShowCheckedModeBanner: false,
          title: 'Flutter Demo',
          theme: ThemeData(
            useMaterial3: true,
            textTheme: GoogleFonts.spaceGroteskTextTheme(
              Theme.of(context).textTheme,
            ),
          ),
          routerConfig: AppRouter.router,
        ),
      ),
    );
  }
}
