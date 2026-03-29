import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:shared_preferences/shared_preferences.dart';

class MicrosoftAuthService {
  static final FlutterAppAuth _appAuth = const FlutterAppAuth();

  static const String _clientId = 'da372529-e417-4944-9145-515aa8187388';
  static const String _tenantId = 'f50045de-252f-4788-af9b-d2a2e2e3eda1';
  static const String _redirectUri =
      'msauth://com.aegix.app/omuJqnPpJrvSf0PhDHhQWvUK+i0=';
  static const String _issuer =
      'https://login.microsoftonline.com/$_tenantId/v2.0';

  static const List<String> _scopes = [
    'openid',
    'profile',
    'email',
    'User.Read',
    'offline_access',
  ];

  /// Interactive sign-in. Returns the access token, or null if cancelled.
  static Future<String?> signIn() async {
    final result = await _appAuth.authorizeAndExchangeCode(
      AuthorizationTokenRequest(
        _clientId,
        _redirectUri,
        issuer: _issuer,
        scopes: _scopes,
        promptValues: ['select_account'],
      ),
    );
    final token = result?.accessToken;
    if (token != null) await _storeToken(token);
    return token;
  }

  /// Silent refresh using a stored refresh token.
  /// Falls back to interactive sign-in on failure.
  static Future<String?> signInSilently() async {
    final prefs = await SharedPreferences.getInstance();
    final refreshToken = prefs.getString('ms_refresh_token');
    if (refreshToken == null) return signIn();

    try {
      final result = await _appAuth.token(
        TokenRequest(
          _clientId,
          _redirectUri,
          issuer: _issuer,
          scopes: _scopes,
          refreshToken: refreshToken,
        ),
      );
      final token = result?.accessToken;
      if (token != null) await _storeToken(token, result?.refreshToken);
      return token;
    } catch (_) {
      return signIn();
    }
  }

  /// Clears stored tokens (AppAuth has no logout endpoint call needed).
  static Future<void> signOut() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('ms_token');
    await prefs.remove('ms_refresh_token');
  }

  // ─── Token storage ───────────────────────────────────────────────────────

  static Future<void> _storeToken(String token, [String? refreshToken]) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('ms_token', token);
    if (refreshToken != null) {
      await prefs.setString('ms_refresh_token', refreshToken);
    }
  }

  static Future<String?> getStoredToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('ms_token');
  }
}
