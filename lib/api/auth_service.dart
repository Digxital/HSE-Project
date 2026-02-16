import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  // static int isOnBoarded = 0;

  static storeOnboardedUser() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setBool("isOnboarded", true);
  }

  static Future<bool> getOnboardedUser() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool("isOnboarded") ?? false;
  }
}
