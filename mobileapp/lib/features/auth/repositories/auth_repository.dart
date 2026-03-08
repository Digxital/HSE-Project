import 'dart:convert';

import 'package:aegix/features/auth/models/login/login_request_model.dart';
import 'package:aegix/features/auth/models/user/user_model.dart';
import 'package:dio/dio.dart';
import 'package:aegix/core/constants/api_endpoints.dart';
import 'package:aegix/core/network/api_client.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  final dio = ref.watch(apiClientProvider).dio;
  return AuthService(dio);
});
 
class AuthService { 
  final Dio _dio;
  final _secureStorage = const FlutterSecureStorage();
  
  // Storage keys
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';
  static const String _refreshTokenKey = 'refresh_token';
  
  AuthService(this._dio);
  
  // MARK: - Authentication Methods
   
  /// Unified login method - handles both email/password and provider logins
  Future<AuthResponse> login(LoginRequestModel request) async {
    try {
      Map<String, dynamic> requestData;
      
      if (request.provider == 'email') {
        // Regular email/password login
        requestData = {
          'email': request.email,
          'password': request.password,
        };
        print('📤 Email login request for: ${request.email}');
      } else {
        // Provider login (Microsoft, Google, etc.)
        requestData = {
          'provider': request.provider,
          'email': request.email,
          'providerData': request.providerData,
          if (request.providerToken != null)
            'providerToken': request.providerToken,
        };
        print('📤 Provider login request for: ${request.provider} - ${request.email}');
      }
      
      final response = await _dio.post(
        ApiEndpoints.login,
        data: requestData,
      );
      
      // Handle successful response
      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = response.data;
        
        // Check if success is true
        if (responseData['success'] == true) {
          print('✅ Login successful: ${responseData['message']}');
          
          // Extract data from the 'data' field
          final data = responseData['data'];
          final token = data['token'];
          final role = data['role'];
          
          // FIXED: Create user with proper ID from token or response
          // You should decode the JWT token to get user ID
          final userId = _extractUserIdFromToken(token); // Implement this helper
          
          final user = UserModel(
            id: userId, // Use extracted ID instead of empty string
            email: request.email,
            name: request.email.split('@').first,
            role: role,
          );
          
          // Store token securely
          await _saveTokens(token, null);
          await _saveUser(user);
          
          return AuthResponse(user: user, token: token);
        } else {
          throw Exception(responseData['message'] ?? 'Login failed');
        }
        
      } else if (response.statusCode == 401) {
        // Handle 401 Unauthorized - Invalid credentials
        final data = response.data;
        final errorMessage = data['message'] ?? 'Invalid credentials';
        print('❌ 401 Unauthorized: $errorMessage');
        throw Exception(errorMessage);
        
      } else if (response.statusCode == 403) {
        // Handle 403 Forbidden - Account pending/inactive
        final data = response.data;
        final errorMessage = data['message'] ?? 'Account is PENDING. Contact admin.';
        print('❌ 403 Forbidden: $errorMessage');
        throw Exception(errorMessage);
        
      } else {
        throw Exception('Login failed: ${response.statusMessage}');
      }
      
    } on DioException catch (e) {
      // Handle Dio specific errors
      if (e.response?.statusCode == 401) {
        final data = e.response?.data;
        final errorMessage = data?['message'] ?? 'Invalid credentials';
        throw Exception(errorMessage);
      }
      
      if (e.response?.statusCode == 403) {
        final data = e.response?.data;
        final errorMessage = data?['message'] ?? 'Account is PENDING. Contact admin.';
        throw Exception(errorMessage);
      }
      
      // FIXED: Better error message extraction
      String errorMessage = 'Login failed';
      if (e.response?.data != null) {
        errorMessage = e.response?.data['message'] ?? 
                      e.response?.data['error'] ?? 
                      'Login failed';
      } else if (e.message != null) {
        errorMessage = e.message!;
      }
      
      throw Exception(errorMessage);
      
    } catch (e) {
      throw Exception('Login failed: $e');
    }
  }

  // Helper method to extract user ID from JWT token
  String _extractUserIdFromToken(String token) {
    try {
      // JWT tokens are in format: header.payload.signature
      final parts = token.split('.');
      if (parts.length >= 2) {
        // Decode the payload (second part)
        final payload = utf8.decode(base64Url.decode(base64Url.normalize(parts[1])));
        final Map<String, dynamic> payloadData = json.decode(payload);
        
        // Return user ID - adjust field name based on your JWT structure
        return payloadData['id'] ?? payloadData['sub'] ?? payloadData['userId'] ?? '';
      }
    } catch (e) {
      print('❌ Error extracting user ID from token: $e');
    }
    return '';
  }
  
  /// Logout user
  Future<void> logout() async {
    try {
      final token = await getToken();
      if (token != null) {
        // Optional: Call logout endpoint
        await _dio.post(
          ApiEndpoints.logout,
          options: Options(
            headers: {'Authorization': 'Bearer $token'},
          ),
        );
      }
    } catch (e) {
      // Log error but don't throw - we still want to clear local data
      print('Logout API error: $e');
    } finally {
      // Always clear local storage
      await _clearStorage();
    }
  }
  
  /// Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }
  
  /// Get current user from storage
  Future<UserModel?> getCurrentUser() async {
    try {
      final userString = await _secureStorage.read(key: _userKey);
      if (userString != null) {
        // FIXED: Proper JSON parsing
        final Map<String, dynamic> userMap = json.decode(userString);
        return UserModel.fromJson(userMap);
      }
      return null;
    } catch (e) {
      print('Error getting current user: $e');
      return null;
    }
  }
  
  /// Get auth token
  Future<String?> getToken() async {
    return await _secureStorage.read(key: _tokenKey);
  }
  
  /// Refresh token
  Future<String?> refreshToken() async {
    try {
      final refreshToken = await _secureStorage.read(key: _refreshTokenKey);
      if (refreshToken == null) return null;
      
      final response = await _dio.post(
        ApiEndpoints.refreshToken,
        data: {'refresh_token': refreshToken},
      );
      
      if (response.statusCode == 200) {
        final newToken = response.data['token'] ?? response.data['access_token'];
        final newRefreshToken = response.data['refresh_token'];
        
        await _saveTokens(newToken, newRefreshToken);
        return newToken;
      }
      return null;
    } catch (e) {
      print('Token refresh failed: $e');
      return null;
    }
  }
  
  // MARK: - Private Methods
  
  /// Save tokens to secure storage
  Future<void> _saveTokens(String token, String? refreshToken) async {
    await _secureStorage.write(key: _tokenKey, value: token);
    if (refreshToken != null) {
      await _secureStorage.write(key: _refreshTokenKey, value: refreshToken);
    }
  }
  
  /// Save user to secure storage - FIXED
  Future<void> _saveUser(UserModel user) async {
    // FIXED: Use json.encode instead of .toString()
    final userJson = json.encode(user.toJson());
    await _secureStorage.write(key: _userKey, value: userJson);
  }
  
  /// Clear all stored data
  Future<void> _clearStorage() async {
    await _secureStorage.delete(key: _tokenKey);
    await _secureStorage.delete(key: _refreshTokenKey);
    await _secureStorage.delete(key: _userKey);
  }
}

// Response model
class AuthResponse {
  final UserModel user;
  final String token;
  
  AuthResponse({required this.user, required this.token});
}