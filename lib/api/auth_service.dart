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

  static storeAccessToken(token) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString("token", token);
  }

  static getAccessToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("token");
  }

  static storeUserId(userId) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString("userId", userId);
  }

  static getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("userId");
  }

  static storeUserEmail(email) async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setString("email", email);
  }

  static getUserEmail() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("email");
  }

  static storeLoggedInUser() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setBool("isLoggedIn", true);
  }

  static removeLoggedInUser() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setBool("isLoggedIn", false);
  }

  static Future<bool> getLoggedInUser() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool("isLoggedIn") ?? false;
  }
}
