import 'dart:io';
import 'package:flutter/material.dart';
import 'package:msal_auth/msal_auth.dart';
import 'package:aegix/features/auth/models/user/user_model.dart';

class MsalAuthService {
  // Your Azure Configuration
  static const String _tenantId = 'f50045de-252f-4788-af9b-d2a2e2e3eda1';
  static const String _clientId = 'da372529-e417-4944-9145-515aa8187388';
  
  // Platform-specific redirect URIs
  String get _redirectUri {
    if (Platform.isIOS) {
      return 'msauth.com.aegix.app://auth';
    } else {
      return 'msauth://com.aegix.app/omuJqnPpJrvSf0PhDHhQWvUK+i0=';
    }
  }

  late MultipleAccountPca _multipleAccountPca;
  bool _isInitialized = false;

  /// Initialize MSAL with proper error handling
  Future<void> initialize() async {
    if (_isInitialized) return;
    
    try {
      _multipleAccountPca = await MultipleAccountPca.create(
        clientId: _clientId,
        androidConfig: AndroidConfig(
          configFilePath: 'assets/msal_config.json', // Make sure this path is correct
          redirectUri: _redirectUri, // Required parameter [citation:1]
        ),
        appleConfig: AppleConfig(
          authority: 'https://login.microsoftonline.com/$_tenantId',
          broker: Broker.webView, // Use WEBVIEW to avoid browser issues [citation:1]
          authorityType: AuthorityType.aad, // For Entra ID (AAD) [citation:1]
        ),
      );
      
      _isInitialized = true;
      debugPrint('✅ MSAL initialized successfully');
    } catch (e) {
      debugPrint('❌ MSAL initialization failed: $e');
      // Don't rethrow - handle gracefully
      throw Exception('Failed to initialize Microsoft authentication: $e');
    }
  }

  /// Sign in with Microsoft - Professional implementation
  Future<UserModel> signIn() async {
    try {
      await initialize();
      
      debugPrint('🔄 Starting Microsoft sign-in...');
      
      // According to changelog, scopes are passed to acquireToken() [citation:1]
      final result = await _multipleAccountPca.acquireToken(
        scopes: <String>[
          'https://graph.microsoft.com/user.read',
          'openid',
          'profile',
          'email',
        ],
        prompt: Prompt.login, // Force interactive login [citation:1]
      );
      
      if (result == null) {
        throw Exception('Sign-in was cancelled');
      }
      
      debugPrint('✅ Sign-in successful for: ${result.account.username}');
      
      // Return clean user model - no token storage
      return UserModel(
        id: result.account.username ?? '',
        email: result.account.username ?? '',
        name: result.account.username?.split('@').first ?? 'Microsoft User',
        profileImage: null,
        provider: 'microsoft',
        providerData: {
          'email': result.account.username,
          'authMethod': 'microsoft',
          'authTime': DateTime.now().toIso8601String(),
        },
      );
      
    } on MsalUserCancelException catch (e) {
      debugPrint('❌ User cancelled: $e');
      throw Exception('Sign-in cancelled');
    } catch (e) {
      debugPrint('❌ Sign-in failed: $e');
      throw Exception('Microsoft authentication failed: ${_extractErrorMessage(e)}');
    }
  }

  /// Sign out - clear MSAL accounts
  Future<void> signOut() async {
    try {
      await initialize();
      
      final accounts = await _multipleAccountPca.getAccounts();
      debugPrint('📋 Found ${accounts.length} account(s) to sign out');
      
      for (var account in accounts) {
        try {
          // According to changelog, removeAccount requires identifier [citation:1]
          // We need to get the identifier from the account object
          // Try to access account identifier via available properties
          String accountId = account.username!; // Fallback
          
          // Attempt to remove account
          await _multipleAccountPca.removeAccount(identifier: accountId);
          debugPrint('✅ Removed account: ${account.username}');
        } catch (e) {
          debugPrint('⚠️ Could not remove account ${account.username}: $e');
        }
      }
      
      debugPrint('✅ Sign-out completed');
    } catch (e) {
      debugPrint('❌ Sign-out failed: $e');
      // Don't throw - this is cleanup
    }
  }

  /// Helper to extract clean error messages
  String _extractErrorMessage(dynamic error) {
    String errorString = error.toString();
    
    if (errorString.contains('multiple_account_pca_init_fail_unknown_reason')) {
      return 'Failed to initialize Microsoft authentication. Please check your configuration.';
    }
    
    if (errorString.contains('MsalClientException')) {
      final messageRegex = RegExp(r'message: ([^,}]+)');
      final match = messageRegex.firstMatch(errorString);
      if (match != null) {
        return match.group(1)?.trim() ?? 'Authentication failed';
      }
    }
    
    if (errorString.startsWith('Exception: ')) {
      errorString = errorString.substring(11);
    }
    
    return errorString;
  }
}