import 'dart:math';

import 'package:dio/dio.dart';
import 'package:aegix/core/constants/api_endpoints.dart';
import 'package:aegix/core/network/api_client.dart';
import 'package:aegix/features/auth/models/assets_model.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

final assetsRepositoryProvider = Provider<AssetsRepository>((ref) {
  final dio = ref.watch(apiClientProvider).dio;
  return AssetsRepository(dio);
});

class AssetsRepository {
  final Dio _dio;
  final _secureStorage = const FlutterSecureStorage();

  AssetsRepository(this._dio);

  Future<AssetsResponse> getAssets() async {
    try {
      // Get token from secure storage
      final token = await _secureStorage.read(key: 'access_token');
      
      if (token == null) {
        throw Exception('No authentication token found');
      }
      
      final response = await _dio.get(
        ApiEndpoints.assets,
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
        ),
      ); 
      
      // print('📡 Response Status: ${response.statusCode}');
      // print('📡 Response Data: ${response.data}');
      
      // Verify the response structure
      final data = response.data;
      print('✅ totalAmount: ${data['totalAmount']}');
      print('✅ totalAssets: ${data['totalAssets']}'); 
      print('✅ walletBalance: ${data['walletBalance']}');
      print('✅ totalPropertyAmount: ${data['totalPropertyAmount']}');
      
      return AssetsResponse.fromJson(data);
      
    } on DioException catch (e) {
      print('❌ Dio Error: ${e.response?.statusCode}');
      print('❌ Error Data: ${e.response?.data}');
      throw _handleError(e);
    }
  }

  String _handleError(DioException error) {
    if (error.response != null) {
      // Handle specific status codes
      switch (error.response?.statusCode) {
        case 401:
          return 'Session expired. Please login again.';
        case 403:
          return 'Access denied.';
        case 404:
          return 'Assets endpoint not found.';
        default:
          return error.response?.data['message'] ?? 'Failed to load assets';
      }
    }
    return 'Network error. Please check your connection.';
  }
}