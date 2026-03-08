import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/services.dart';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:aegix/features/auth/models/user/user_model.dart';

class MicrosoftAuthService {
  // Microsoft Azure AD Configuration
  static const String _tenantId = 'f50045de-252f-4788-af9b-d2a2e2e3eda1';
  static const String _clientId = 'da372529-e417-4944-9145-515aa8187388';
  
  // CORRECTED Redirect URIs
  static const String _androidRedirectUri = 'msauth://com.aegix.app/omuJqnPpJrvSf0PhDHhQWvUK+i0=';
  static const String _iosRedirectUri = 'msauth.com.aegix.app://auth';
   
  // Scopes for Microsoft Graph API
  static const List<String> _scopes = <String>[
    'openid',
    'profile',
    'email',
    'offline_access',
    'User.Read',
  ];
  
  final FlutterAppAuth _appAuth = const FlutterAppAuth();
  
  // Get redirect URI based on platform
  String get _platformRedirectUri {
    if (kIsWeb) {
      return 'http://localhost:8080';
    } else if (Platform.isIOS) {
      return _iosRedirectUri;
    } else {
      return _androidRedirectUri;
    }
  }
  
  // Login with Microsoft
  Future<MicrosoftAuthResult> login() async {
    try {
      if (kIsWeb) {
        return _loginWeb();
      } else {
        return _loginMobile();
      }
    } catch (e) {
      throw Exception('Microsoft login failed: $e');
    }
  }
  
  // Mobile login (iOS/Android) - WITH PROMPT VALUES ADDED
  Future<MicrosoftAuthResult> _loginMobile() async {
  try {
    // SIMPLIFY: Remove complex parameters and let plugin handle state
    final AuthorizationTokenRequest request = AuthorizationTokenRequest(
      _clientId,
      _platformRedirectUri,
      issuer: 'https://login.microsoftonline.com/$_tenantId/v2.0',
      scopes: _scopes,
      serviceConfiguration: AuthorizationServiceConfiguration(
        authorizationEndpoint: 'https://login.microsoftonline.com/$_tenantId/oauth2/v2.0/authorize',
        tokenEndpoint: 'https://login.microsoftonline.com/$_tenantId/oauth2/v2.0/token',
      ),
      // Keep only these essential parameters
      promptValues: ['login'], // Bypasses "Continue" screen
      allowInsecureConnections: false, // Force HTTPS
    );
    
    // IMPORTANT: Don't modify or wrap this call
    final AuthorizationTokenResponse? result = await _appAuth.authorizeAndExchangeCode(request);
    
    if (result != null && result.accessToken != null) {
      final UserModel userInfo = await _getUserInfo(result.accessToken!);
      
      return MicrosoftAuthResult(
        accessToken: result.accessToken!,
        refreshToken: result.refreshToken,
        idToken: result.idToken,
        user: userInfo,
      );
    } else {
      throw Exception('Login cancelled');
    }
  } on PlatformException catch (e) {
    print('Authentication can:$e');
    // Handle the specific "CANCELED" error [citation:2]
    if (e.code == 'CANCELED') {
      print('Authentication was cancelled:$e');
      throw Exception('Authentication was cancelled');
    }
    print('Microsoft login failed::$e');
    throw Exception('Microsoft login failed: $e');
  } catch (e) {
    print('Microsoft login failed::$e');
    throw Exception('Microsoft login failed: $e');
  }
}
  
  // Web login
  Future<MicrosoftAuthResult> _loginWeb() async {
    throw UnimplementedError('Web implementation pending');
  }
  
  // Get user info from Microsoft Graph
  Future<UserModel> _getUserInfo(String accessToken) async {
    final HttpClient client = HttpClient();
    try {
      final Uri uri = Uri.parse('https://graph.microsoft.com/v1.0/me');
      final HttpClientRequest request = await client.getUrl(uri);
      request.headers.set('Authorization', 'Bearer $accessToken');
      request.headers.set('Content-Type', 'application/json');
      
      final HttpClientResponse response = await request.close();
      
      if (response.statusCode == 200) {
        final String jsonString = await response.transform(utf8.decoder).join();
        final Map<String, dynamic> userData = json.decode(jsonString);
        
        return UserModel(
          id: userData['id'],
          email: userData['userPrincipalName'] ?? userData['mail'] ?? '',
          name: userData['displayName'],
          profileImage: null,
          provider: 'microsoft',
          providerData: userData,
        );
      } else {
        throw Exception('Failed to get user info: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to get user info: $e');
    } finally {
      client.close();
    }
  }
  
  // Logout
  Future<void> logout() async {
    // Clear local session
  }
}

class MicrosoftAuthResult {
  final String accessToken;
  final String? refreshToken;
  final String? idToken;
  final UserModel user;
  
  MicrosoftAuthResult({
    required this.accessToken,
    this.refreshToken,
    this.idToken,
    required this.user,
  });
}