// lib/features/action/models/action_model.dart
// Run: dart run build_runner build --delete-conflicting-outputs

import 'package:freezed_annotation/freezed_annotation.dart';

part 'action_model.freezed.dart';
part 'action_model.g.dart';

// ─── Sub-models ───────────────────────────────────────────────────────────────

@freezed
abstract class ClientId with _$ClientId {
  const factory ClientId({
    @JsonKey(name: '_id') required String id,
    required String name,
  }) = _ClientId;

  factory ClientId.fromJson(Map<String, dynamic> json) =>
      _$ClientIdFromJson(json);
}

@freezed
abstract class SiteId with _$SiteId {
  const factory SiteId({
    @JsonKey(name: '_id') required String id,
    required String name,
  }) = _SiteId;

  factory SiteId.fromJson(Map<String, dynamic> json) => _$SiteIdFromJson(json);
}

@freezed
abstract class ReportLocation with _$ReportLocation {
  const factory ReportLocation({
    required ClientId clientId,
    required SiteId siteId,
    required String specificArea,
    @Default(0.0) double latitude,
    @Default(0.0) double longitude,
  }) = _ReportLocation;

  factory ReportLocation.fromJson(Map<String, dynamic> json) =>
      _$ReportLocationFromJson(json);
}

@freezed
abstract class UserId with _$UserId {
  const factory UserId({
    @JsonKey(name: '_id') required String id,
    required String email,
  }) = _UserId;

  factory UserId.fromJson(Map<String, dynamic> json) => _$UserIdFromJson(json);
}

@freezed
abstract class ReportedBy with _$ReportedBy {
  const factory ReportedBy({required UserId userId, required String role}) =
      _ReportedBy;

  factory ReportedBy.fromJson(Map<String, dynamic> json) =>
      _$ReportedByFromJson(json);
}

@freezed
abstract class ReportAttachment with _$ReportAttachment {
  const factory ReportAttachment({
    @JsonKey(name: '_id') required String id,
    required String type,
    required String url,
  }) = _ReportAttachment;

  factory ReportAttachment.fromJson(Map<String, dynamic> json) =>
      _$ReportAttachmentFromJson(json);
}

// ─── Main Report Model ────────────────────────────────────────────────────────

@freezed
abstract class ActionReport with _$ActionReport {
  const factory ActionReport({
    @JsonKey(name: '_id') required String id,
    required ReportLocation location,
    required ReportedBy reportedBy,

    // API sends "recordCategory" not "recordType"
    @JsonKey(name: 'recordCategory') @Default('') String recordCategory,

    required String title,
    required String description,
    required String riskLevel,
    required String eventDate,
    required String eventTime,
    @Default(0) int peopleAffected,
    @Default('') String injuryDetails,
    @Default('') String equipmentInvolved,
    @Default([]) List<ReportAttachment> attachments,
    required String status,
    required String createdAt,
    required String updatedAt,
  }) = _ActionReport;

  factory ActionReport.fromJson(Map<String, dynamic> json) =>
      _$ActionReportFromJson(json);
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

@freezed
abstract class ActionReportsResponse with _$ActionReportsResponse {
  const factory ActionReportsResponse({
    required bool success,
    required List<ActionReport> data,
  }) = _ActionReportsResponse;

  factory ActionReportsResponse.fromJson(Map<String, dynamic> json) =>
      _$ActionReportsResponseFromJson(json);
}
