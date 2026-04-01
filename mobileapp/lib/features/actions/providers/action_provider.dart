// lib/features/action/provider/action_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/action_model.dart';
import '../repositories/action_repository.dart';

// ─── Tab index provider ───────────────────────────────────────────────────────

final actionTabIndexProvider = StateProvider<int>((ref) => 0);

// ─── Reports provider ─────────────────────────────────────────────────────────

final actionReportsProvider =
    AsyncNotifierProvider<ActionReportsNotifier, List<ActionReport>>(
      ActionReportsNotifier.new,
    );

class ActionReportsNotifier extends AsyncNotifier<List<ActionReport>> {
  @override
  Future<List<ActionReport>> build() async {
    return _fetch();
  }

  Future<List<ActionReport>> _fetch() async {
    final repo = ref.watch(actionRepositoryProvider);
    final response = await repo.fetchReports();
    return response.data;
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(_fetch);
  }
}

// ─── Filtered reports (derived) ───────────────────────────────────────────────

final filteredActionReportsProvider = Provider<List<ActionReport>>((ref) {
  final tabIndex = ref.watch(actionTabIndexProvider);
  final reportsAsync = ref.watch(actionReportsProvider);

  return reportsAsync.maybeWhen(
    data: (reports) {
      switch (tabIndex) {
        case 0:
          return reports;
        case 1:
          return reports
              .where((r) => r.status.toLowerCase() == 'open')
              .toList();
        case 2:
          return reports
              .where((r) => r.status.toLowerCase() == 'in_progress')
              .toList();
        case 3:
          return reports
              .where((r) => r.status.toLowerCase() == 'completed')
              .toList();
        default:
          return []; // ✅ unknown index returns empty, not all reports
      }
    },
    orElse: () => [],
  );
});

// ─── Submit action provider ───────────────────────────────────────────────────

final submitActionProvider = AsyncNotifierProvider<SubmitActionNotifier, void>(
  SubmitActionNotifier.new,
);

class SubmitActionNotifier extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<bool> submit({
    required String reportId,
    String? comment,
    List<String>? attachmentPaths,
  }) async {
    state = const AsyncLoading();
    final result = await AsyncValue.guard(() async {
      final repo = ref.read(actionRepositoryProvider);
      await repo.submitAction(
        reportId: reportId,
        comment: comment,
        attachmentPaths: attachmentPaths,
      );
    });
    state = result;
    return result is AsyncData;
  }
}
