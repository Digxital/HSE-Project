import 'package:dio/dio.dart';
import 'package:aegix/core/constants/api_endpoints.dart';
import 'package:aegix/core/network/api_client.dart';
import 'package:aegix/features/auth/models/auth_response_model.dart';
import 'package:aegix/features/auth/models/user_model.dart';
import 'package:aegix/features/auth/models/login_request_model.dart';
import 'package:aegix/features/auth/models/register_request_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  final dio = ref.watch(apiClientProvider).dio;
  return AuthService(dio);
});

class AuthService {
  final Dio _dio;
  final _secureStorage = const FlutterSecureStorage();
  
  AuthService(this._dio);
  
  // MARK: - Authentication Methods
  
  /// Login with email and password
  Future<AuthResponse> login(LoginRequest request) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.login,
        data: request.toJson(), 
      ); 
      // Print response for debugging
      debugPrint('Login response: ${response.data}');
      final authResponse = AuthResponse.fromJson(response.data);
       // Store tokens if they exist in response
      if (authResponse.token != null) {
        await _storeTokens(authResponse);
      }
      return authResponse;
      
    } on DioException catch (e) {
      print("Error:$e");
      throw _handleDioError(e);
    }
  }
  
  /// Register new user
  Future<AuthResponse> register(RegisterRequest request) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.register,
        data: request.toJson(),
      );
      
      final authResponse = AuthResponse.fromJson(response.data);
      
      // Store tokens securely
      await _storeTokens(authResponse);
      
      return authResponse;
      
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Logout user
  Future<void> logout() async {
    try {
      final token = await _secureStorage.read(key: 'access_token');
      
      if (token != null) {
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
      // Always clear local storage regardless of API response
      await _clearAllStoredData();
    }
  }
  
  /// Refresh access token
  Future<String?> refreshToken() async {
    try {
      final refreshToken = await _secureStorage.read(key: 'refresh_token');
      
      if (refreshToken == null) {
        return null;
      }
      
      final response = await _dio.post(
        ApiEndpoints.refreshToken,
        data: {'refreshToken': refreshToken},
      );
      
      final newAccessToken = response.data['accessToken'];
      final newRefreshToken = response.data['refreshToken'];
      
      // Store new tokens
      await _secureStorage.write(key: 'access_token', value: newAccessToken);
      if (newRefreshToken != null) {
        await _secureStorage.write(key: 'refresh_token', value: newRefreshToken);
      }
      
      return newAccessToken;
      
    } catch (e) {
      // If refresh fails, clear tokens
      await _secureStorage.delete(key: 'access_token');
      await _secureStorage.delete(key: 'refresh_token');
      return null;
    }
  }
  
  /// Get current user profile
  Future<UserModel> getCurrentUser() async {
    try {
      final response = await _dio.get(ApiEndpoints.me);
      return UserModel.fromJson(response.data);
      
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Request password reset
  Future<void> forgotPassword(String email) async {
    try {
      await _dio.post(
        ApiEndpoints.forgotPassword,
        data: {'email': email.trim().toLowerCase()},
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
   
  /// Reset password with token
  Future<void> resetPassword({
    required String token,
    required String newPassword,
  }) async {
    try {
      await _dio.post(
        ApiEndpoints.resetPassword,
        data: {
          'token': token,
          'newPassword': newPassword,
        },
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Check if user has active session
  Future<bool> hasActiveSession() async {
    final token = await _secureStorage.read(key: 'access_token');
    if (token == null) return false;
    
    try {
      // Try to get current user to verify token is still valid
      await getCurrentUser();
      return true;
    } catch (e) {
      // Token is invalid
      await _secureStorage.delete(key: 'access_token');
      return false;
    }
  }
  
  /// Get stored access token
  Future<String?> getAccessToken() async {
    return await _secureStorage.read(key: 'access_token');
  }
  
  // MARK: - Private Helper Methods
  
  /// Store authentication tokens securely
  Future<void> _storeTokens(AuthResponse response) async {
    // Only store if token exists
    if (response.token != null) {
      await _secureStorage.write(key: 'access_token', value: response.token);
    }
    if (response.refreshToken != null) {
      await _secureStorage.write(key: 'refresh_token', value: response.refreshToken);
    }
    await _secureStorage.write(key: 'user_id', value: response.user.id.toString());
  }
  
  /// Clear all stored authentication data
  Future<void> _clearAllStoredData() async {
    await _secureStorage.delete(key: 'access_token');
    await _secureStorage.delete(key: 'refresh_token');
    await _secureStorage.delete(key: 'user_id');
  }
  
  /// Handle Dio errors gracefully
  String _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return 'Connection timeout. Please check your internet connection.';
        
      case DioExceptionType.connectionError:
        return 'No internet connection. Please check your network.';
        
      case DioExceptionType.cancel:
        return 'Request was cancelled.';
        
      case DioExceptionType.badResponse:
        return _handleBadResponse(error.response);
        
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  
  /// Handle HTTP error responses
  String _handleBadResponse(Response? response) {
    if (response == null) return 'Unknown error occurred.';
    
    final statusCode = response.statusCode;
    final data = response.data;
    
    // Try to get error message from response
    String message = 'Server error occurred.';
    
    if (data is Map) {
      if (data.containsKey('message')) {
        message = data['message'].toString();
      } else if (data.containsKey('error')) {
        message = data['error'].toString();
      }
    }
    
    switch (statusCode) {
      case 400:
        return 'Bad request: $message';
      case 401:
        return 'Unauthorized: Invalid email or password.';
      case 403:
        return 'Access denied. Please contact support.';
      case 404:
        return 'Resource not found.';
      case 422:
        return 'Validation error: $message';
      case 429:
        return 'Too many attempts. Please try again later.';
      case 500:
      case 502:
      case 503:
        return 'Server error. Please try again later.';
      default:
        return 'Error $statusCode: $message';
    }
  }
}