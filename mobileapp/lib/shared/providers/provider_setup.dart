import 'package:aegix/core/constants/shared_preferences_keys.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
 
Future<void> initializeProviders() async {
  // Initialize any async providers here
  final sharedPreferences = await SharedPreferences.getInstance();
  // You can store this in a global variable or use a different approach
} 

// Provider for SharedPreferences
final sharedPreferencesProvider = FutureProvider<SharedPreferences>((ref) async {
  return SharedPreferences.getInstance();
});

// Provider for FlutterSecureStorage
final secureStorageProvider = Provider((ref) => const FlutterSecureStorage());

// Provider for checking if onboarding is completed
final onboardingCompletedProvider = FutureProvider<bool>((ref) async {
  final prefs = await ref.watch(sharedPreferencesProvider.future);
  return prefs.getBool(StorageKeys.onboardingCompleted) ?? false;
});

// Provider for checking if user is remembered
final rememberMeProvider = FutureProvider<bool>((ref) async {
  final prefs = await ref.watch(sharedPreferencesProvider.future);
  return prefs.getBool(StorageKeys.rememberMe) ?? false;
});