import 'package:dio/dio.dart';
import 'package:aegix/core/constants/api_endpoints.dart';
import 'package:aegix/core/network/api_client.dart';
import 'package:aegix/features/auth/models/auth_response_model.dart';
import 'package:aegix/features/auth/models/user_model.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'auth_service.g.dart';

// MARK: - Auth Service Provider
@riverpod
AuthService authService(AuthServiceRef ref) {
  final dio = ref.watch(apiClientProvider).dio;
  return AuthService(dio);
} 
 
class AuthService {
  final Dio _dio;
  final _secureStorage = const FlutterSecureStorage();
  
  AuthService(this._dio);
  
  // MARK: - Authentication Methods
  
  /// Login with email and password
  Future<AuthResponse> login({
    required String email,
    required String password,
    bool rememberMe = false,
  }) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.login,
        data: {
          'email': email.trim().toLowerCase(),
          'password': password,
          'rememberMe': rememberMe,
        },
      );
      
      final authResponse = AuthResponse.fromJson(response.data);
      
      // Store tokens securely
      await _storeTokens(authResponse);
      
      // Store user email if remember me is true
      if (rememberMe) {
        await _secureStorage.write(
          key: 'remembered_email',
          value: email.trim().toLowerCase(),
        );
      }
      
      return authResponse;
      
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Register new user
  Future<AuthResponse> register({
    required String email,
    required String password,
    required String fullName,
    required String phoneNumber,
    String? referralCode,
  }) async {
    try {
      // Validate phone number format
      final formattedPhone = _formatPhoneNumber(phoneNumber);
      
      final response = await _dio.post(
        ApiEndpoints.register,
        data: {
          'email': email.trim().toLowerCase(),
          'password': password,
          'fullName': fullName.trim(),
          'phoneNumber': formattedPhone,
          'referralCode': referralCode,
          'deviceInfo': await _getDeviceInfo(),
        },
      );
      
      final authResponse = AuthResponse.fromJson(response.data);
      
      // Store tokens
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
  
  /// Verify email with OTP
  Future<void> verifyEmail(String otp) async {
    try {
      await _dio.post(
        ApiEndpoints.verifyEmail,
        data: {'otp': otp},
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Resend verification email
  Future<void> resendVerificationEmail() async {
    try {
      await _dio.post(ApiEndpoints.resendVerification);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Change password
  Future<void> changePassword({
    required String currentPassword,
    required String newPassword,
  }) async {
    try {
      await _dio.post(
        ApiEndpoints.changePassword,
        data: {
          'currentPassword': currentPassword,
          'newPassword': newPassword,
        },
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Update profile
  Future<UserModel> updateProfile({
    String? fullName,
    String? phoneNumber,
    String? profilePicture,
  }) async {
    try {
      final response = await _dio.put(
        ApiEndpoints.updateProfile,
        data: {
          if (fullName != null) 'fullName': fullName.trim(),
          if (phoneNumber != null) 'phoneNumber': _formatPhoneNumber(phoneNumber),
          if (profilePicture != null) 'profilePicture': profilePicture,
        },
      );
      
      return UserModel.fromJson(response.data);
      
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Setup two-factor authentication
  Future<TwoFactorSetup> setupTwoFactor() async {
    try {
      final response = await _dio.post(ApiEndpoints.setup2FA);
      return TwoFactorSetup.fromJson(response.data);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Enable two-factor authentication
  Future<void> enableTwoFactor(String otp) async {
    try {
      await _dio.post(
        ApiEndpoints.enable2FA,
        data: {'otp': otp},
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Disable two-factor authentication
  Future<void> disableTwoFactor(String otp) async {
    try {
      await _dio.post(
        ApiEndpoints.disable2FA,
        data: {'otp': otp},
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }
  
  /// Verify two-factor authentication during login
  Future<AuthResponse> verifyTwoFactor({
    required String userId,
    required String otp,
  }) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.verify2FA,
        data: {
          'userId': userId,
          'otp': otp,
        },
      );
      
      final authResponse = AuthResponse.fromJson(response.data);
      await _storeTokens(authResponse);
      
      return authResponse;
      
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
  
  /// Get remembered email (for login screen)
  Future<String?> getRememberedEmail() async {
    return await _secureStorage.read(key: 'remembered_email');
  }
  
  // MARK: - Private Helper Methods
  
  /// Store authentication tokens securely
  Future<void> _storeTokens(AuthResponse response) async {
    await _secureStorage.write(key: 'access_token', value: response.token);
    await _secureStorage.write(key: 'refresh_token', value: response.refreshToken);
    await _secureStorage.write(key: 'user_id', value: response.user.id.toString());
    
    // Store token expiry if provided
    // if (response.expiresAt != null) {
    //   await _secureStorage.write(
    //     key: 'token_expiry',
    //     value: response.expiresAt!.toIso8601String(),
    //   );
    // }
  }
  
  /// Clear all stored authentication data
  Future<void> _clearAllStoredData() async {
    await _secureStorage.delete(key: 'access_token');
    await _secureStorage.delete(key: 'refresh_token');
    await _secureStorage.delete(key: 'user_id');
    await _secureStorage.delete(key: 'token_expiry');
    // Don't delete remembered email
  }
  
  /// Format phone number to international format
  String _formatPhoneNumber(String phone) {
    // Remove all non-digit characters
    String digits = phone.replaceAll(RegExp(r'\D'), '');
    
    // Add country code if missing (assuming local number)
    if (digits.length == 10) {
      digits = '+1$digits'; // Adjust country code as needed
    } else if (!digits.startsWith('+')) {
      digits = '+$digits';
    }
    
    return digits;
  }
  
  /// Get device information for security
  Future<Map<String, dynamic>> _getDeviceInfo() async {
    // You can use device_info_plus package for detailed info
    return {
      'platform': 'flutter',
      'appVersion': '1.0.0',
      'deviceId': await _getDeviceId(),
    };
  }
  
  /// Get unique device identifier
  Future<String> _getDeviceId() async {
    // Implement device ID generation
    // You can use device_info_plus or a UUID
    return 'device_${DateTime.now().millisecondsSinceEpoch}';
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

// MARK: - Supporting Models

class TwoFactorSetup {
  final String secret;
  final String qrCodeUrl;
  final List<String> backupCodes;
  
  TwoFactorSetup({
    required this.secret,
    required this.qrCodeUrl,
    required this.backupCodes,
  });
  
  factory TwoFactorSetup.fromJson(Map<String, dynamic> json) {
    return TwoFactorSetup(
      secret: json['secret'] ?? '',
      qrCodeUrl: json['qrCodeUrl'] ?? '',
      backupCodes: List<String>.from(json['backupCodes'] ?? []),
    );
  }
}

// MARK: - Auth Service Extensions

extension AuthServiceX on AuthService {
  /// Check if token is expired
  Future<bool> isTokenExpired() async {
    final expiryString = await _secureStorage.read(key: 'token_expiry');
    if (expiryString == null) return true;
    
    try {
      final expiry = DateTime.parse(expiryString);
      return expiry.isBefore(DateTime.now());
    } catch (e) {
      return true;
    }
  }
  
  /// Get user ID from secure storage
  Future<String?> getUserId() async {
    return await _secureStorage.read(key: 'user_id');
  }
  
  /// Clear remembered email (for logout)
  Future<void> clearRememberedEmail() async {
    await _secureStorage.delete(key: 'remembered_email');
  }
}