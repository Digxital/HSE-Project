import 'package:aegix/core/routes/app_routes.dart';
import 'package:aegix/core/themes/app_theme.dart';
import 'package:aegix/shared/providers/provider_setup.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import 'shared/providers/theme_provider.dart';
 
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize any services here
  await initializeProviders();
  
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends HookConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(goRouterProvider);
    final themeMode = ref.watch(themeModeProvider); // 👈 Watch theme mode
    
    
    return ScreenUtilInit(
     designSize: const Size(360, 690),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) { 
        return MaterialApp.router(
          title: 'Dohmany App',
          theme: AppTheme.lightTheme,
          darkTheme: AppTheme.darkTheme,
          themeMode: themeMode,
          routerConfig: router, 
          debugShowCheckedModeBanner: false,
        );
      }
    );
  }
}