import 'package:aegix/core/network/api_client.dart';
import 'package:aegix/features/actions/models/action_model.dart';
import 'package:aegix/features/auth/repositories/auth_repository.dart';
import 'package:aegix/features/auth/services/auth_service.dart'
    hide AuthService;
import 'package:dio/dio.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
// ✅ changed from flutter_riverpod

class ActionRepository {
  final Dio _dio;
  final AuthService _authService;

  ActionRepository(this._dio, this._authService);

  Future<ActionReportsResponse> fetchReports() async {
    final user = await _authService.getCurrentUser();
    final userId = user?.id;
    print("userId:$userId");

    if (userId == null || userId.isEmpty) {
      throw Exception('User not found. Please log in again.');
    }

    final response = await _dio.get('/api/reports/user/$userId');
    return ActionReportsResponse.fromJson(
      response.data as Map<String, dynamic>,
    );
  }

  Future<void> submitAction({
    required String reportId,
    String? comment,
    List<String>? attachmentPaths,
  }) async {
    final formData = FormData.fromMap({
      'reportId': reportId,
      if (comment != null && comment.isNotEmpty) 'comment': comment,
    });

    await _dio.post('/api/reports/$reportId/submit', data: formData);
  }
}

final actionRepositoryProvider = Provider<ActionRepository>((ref) {
  final dio = ref.watch(apiClientProvider).dio;
  final authService = ref.watch(authServiceProvider); // ✅ inject AuthService
  return ActionRepository(dio, authService);
});
