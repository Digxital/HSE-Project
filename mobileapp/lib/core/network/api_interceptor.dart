import 'package:dio/dio.dart';
import 'package:aegix/core/constants/api_endpoints.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiInterceptor extends Interceptor {
  final _secureStorage = const FlutterSecureStorage();
  
  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Add auth token if available
    final token = await _secureStorage.read(key: 'auth_token');
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    
    // Add device info for security
    options.headers['X-Device-ID'] = await _getDeviceId();
    options.headers['X-App-Version'] = '1.0.0';
    options.headers['X-Platform'] = 'flutter';
    
    // For fintech, always use HTTPS
    if (!options.uri.toString().startsWith('https')) {
      throw DioException(
        requestOptions: options,
        error: 'HTTPS is required for all API calls',
      );
    }
    
    handler.next(options);
  }
  
  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    // Handle 401 Unauthorized - token expired
    if (err.response?.statusCode == 401) {
      try {
        // Attempt to refresh token
        final newToken = await _refreshToken();
        if (newToken != null) {
          // Retry the request with new token
          final options = err.requestOptions;
          options.headers['Authorization'] = 'Bearer $newToken';
          
          final response = await Dio().fetch(options);
          return handler.resolve(response);
        }
      } catch (e) {
        // Refresh failed, force logout
        await _secureStorage.deleteAll();
        // You might want to emit an event to logout the user
      }
    }
    
    // Log errors in debug mode
    if (kDebugMode) {
      print('API Error: ${err.response?.statusCode} - ${err.message}');
      print('Data: ${err.response?.data}');
    }
    
    handler.next(err);
  }
  
  Future<String?> _refreshToken() async {
    try {
      final refreshToken = await _secureStorage.read(key: 'refresh_token');
      if (refreshToken == null) return null;
      
      final response = await Dio().post(
        '${ApiEndpoints.baseUrl}${ApiEndpoints.refreshToken}',
        data: {'refreshToken': refreshToken},
      );
      
      final newToken = response.data['token'];
      await _secureStorage.write(key: 'auth_token', value: newToken);
      
      return newToken;
    } catch (e) {
      return null;
    }
  }
  
  Future<String> _getDeviceId() async {
    // Implement device ID generation
    // You can use device_info_plus package
    return 'device-id-placeholder';
  }
}