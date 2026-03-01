import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:aegix/core/constants/api_endpoints.dart';
import 'package:aegix/core/network/api_interceptor.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
 
class ApiClient {
  late Dio dio; 
  
  ApiClient() {
    dio = Dio( 
      BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
    
    // Add interceptors
    dio.interceptors.add(ApiInterceptor());
    
    if (kDebugMode) {
      dio.interceptors.add(LogInterceptor(
        request: true,
        requestHeader: true,
        requestBody: true,
        responseHeader: true,
        responseBody: true,
        error: true,
      ));
    }
  }
}

// Provider for ApiClient
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient();
});