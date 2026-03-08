import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:app_links/app_links.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:aegix/features/auth/models/user/user_model.dart';

class MicrosoftAuthServiceV2 {
  // Your Azure Configuration
  static const String _tenantId = 'f50045de-252f-4788-af9b-d2a2e2e3eda1';
  static const String _clientId = 'da372529-e417-4944-9145-515aa8187388';
  static const String _redirectUri = 'msauth://com.aegix.app/omuJqnPpJrvSf0PhDHhQWvUK+i0=';
  
  // State management
  final Map<String, Completer<String>> _pendingAuths = {};
  
  // Generate a random state for CSRF protection
  String _generateState() {
    final random = Random.secure();
    return base64Url.encode(List<int>.generate(32, (_) => random.nextInt(256)));
  }

  // Build the authorization URL
  String _buildAuthUrl(String state) {
    final uri = Uri.https(
      'login.microsoftonline.com',
      '/$_tenantId/oauth2/v2.0/authorize',
      {
        'client_id': _clientId,
        'response_type': 'code',
        'redirect_uri': _redirectUri,
        'scope': 'openid profile email User.Read offline_access',
        'state': state,
        'prompt': 'login',
        'response_mode': 'query',
      },
    );
    return uri.toString();
  }

  // Launch URL using url_launcher (no platform channel needed!)
  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw Exception('Could not launch browser');
    }
  }

  // Exchange code for token
  Future<Map<String, dynamic>> _exchangeCodeForToken(String code) async {
    final response = await http.post(
      Uri.https('login.microsoftonline.com', '/$_tenantId/oauth2/v2.0/token'),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: {
        'client_id': _clientId,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': _redirectUri,
        'scope': 'openid profile email User.Read offline_access',
      },
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Token exchange failed: ${response.body}');
    }
  }

  // Get user info from Microsoft Graph
  Future<UserModel> _getUserInfo(String accessToken) async {
    final response = await http.get(
      Uri.parse('https://graph.microsoft.com/v1.0/me'),
      headers: {'Authorization': 'Bearer $accessToken'},
    );

    if (response.statusCode == 200) {
      final userData = json.decode(response.body);
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
  }

  // Main login method
  Future<UserModel> login(BuildContext context) async {
    final state = _generateState();
    final completer = Completer<String>();
    _pendingAuths[state] = completer;
    
    final appLinks = AppLinks();
    final sub = appLinks.uriLinkStream.listen((Uri uri) {
      if (uri.scheme == 'msauth' && uri.host == 'com.aegix.app') {
        final returnedState = uri.queryParameters['state'];
        final code = uri.queryParameters['code'];
        
        if (returnedState != null && returnedState == state && code != null) {
          _pendingAuths[returnedState]?.complete(code);
          _pendingAuths.remove(returnedState);
        }
      }
    });

    try {
      await _launchUrl(_buildAuthUrl(state));
      
      final code = await completer.future.timeout(
        const Duration(minutes: 5),
        onTimeout: () => throw Exception('Authentication timeout'),
      );
      
      final tokenData = await _exchangeCodeForToken(code);
      final user = await _getUserInfo(tokenData['access_token']);
      
      return user;
      
    } finally {
      sub.cancel();
      _pendingAuths.remove(state);
    }
  }
}