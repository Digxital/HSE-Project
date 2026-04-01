// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'action_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ClientId _$ClientIdFromJson(Map<String, dynamic> json) =>
    _ClientId(id: json['_id'] as String, name: json['name'] as String);

Map<String, dynamic> _$ClientIdToJson(_ClientId instance) => <String, dynamic>{
  '_id': instance.id,
  'name': instance.name,
};

_SiteId _$SiteIdFromJson(Map<String, dynamic> json) =>
    _SiteId(id: json['_id'] as String, name: json['name'] as String);

Map<String, dynamic> _$SiteIdToJson(_SiteId instance) => <String, dynamic>{
  '_id': instance.id,
  'name': instance.name,
};

_ReportLocation _$ReportLocationFromJson(Map<String, dynamic> json) =>
    _ReportLocation(
      clientId: ClientId.fromJson(json['clientId'] as Map<String, dynamic>),
      siteId: SiteId.fromJson(json['siteId'] as Map<String, dynamic>),
      specificArea: json['specificArea'] as String,
      latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
    );

Map<String, dynamic> _$ReportLocationToJson(_ReportLocation instance) =>
    <String, dynamic>{
      'clientId': instance.clientId,
      'siteId': instance.siteId,
      'specificArea': instance.specificArea,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
    };

_UserId _$UserIdFromJson(Map<String, dynamic> json) =>
    _UserId(id: json['_id'] as String, email: json['email'] as String);

Map<String, dynamic> _$UserIdToJson(_UserId instance) => <String, dynamic>{
  '_id': instance.id,
  'email': instance.email,
};

_ReportedBy _$ReportedByFromJson(Map<String, dynamic> json) => _ReportedBy(
  userId: UserId.fromJson(json['userId'] as Map<String, dynamic>),
  role: json['role'] as String,
);

Map<String, dynamic> _$ReportedByToJson(_ReportedBy instance) =>
    <String, dynamic>{'userId': instance.userId, 'role': instance.role};

_ReportAttachment _$ReportAttachmentFromJson(Map<String, dynamic> json) =>
    _ReportAttachment(
      id: json['_id'] as String,
      type: json['type'] as String,
      url: json['url'] as String,
    );

Map<String, dynamic> _$ReportAttachmentToJson(_ReportAttachment instance) =>
    <String, dynamic>{
      '_id': instance.id,
      'type': instance.type,
      'url': instance.url,
    };

_ActionReport _$ActionReportFromJson(
  Map<String, dynamic> json,
) => _ActionReport(
  id: json['_id'] as String,
  location: ReportLocation.fromJson(json['location'] as Map<String, dynamic>),
  reportedBy: ReportedBy.fromJson(json['reportedBy'] as Map<String, dynamic>),
  recordCategory: json['recordCategory'] as String? ?? '',
  title: json['title'] as String,
  description: json['description'] as String,
  riskLevel: json['riskLevel'] as String,
  eventDate: json['eventDate'] as String,
  eventTime: json['eventTime'] as String,
  peopleAffected: (json['peopleAffected'] as num?)?.toInt() ?? 0,
  injuryDetails: json['injuryDetails'] as String? ?? '',
  equipmentInvolved: json['equipmentInvolved'] as String? ?? '',
  attachments:
      (json['attachments'] as List<dynamic>?)
          ?.map((e) => ReportAttachment.fromJson(e as Map<String, dynamic>))
          .toList() ??
      const [],
  status: json['status'] as String,
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$ActionReportToJson(_ActionReport instance) =>
    <String, dynamic>{
      '_id': instance.id,
      'location': instance.location,
      'reportedBy': instance.reportedBy,
      'recordCategory': instance.recordCategory,
      'title': instance.title,
      'description': instance.description,
      'riskLevel': instance.riskLevel,
      'eventDate': instance.eventDate,
      'eventTime': instance.eventTime,
      'peopleAffected': instance.peopleAffected,
      'injuryDetails': instance.injuryDetails,
      'equipmentInvolved': instance.equipmentInvolved,
      'attachments': instance.attachments,
      'status': instance.status,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };

_ActionReportsResponse _$ActionReportsResponseFromJson(
  Map<String, dynamic> json,
) => _ActionReportsResponse(
  success: json['success'] as bool,
  data: (json['data'] as List<dynamic>)
      .map((e) => ActionReport.fromJson(e as Map<String, dynamic>))
      .toList(),
);

Map<String, dynamic> _$ActionReportsResponseToJson(
  _ActionReportsResponse instance,
) => <String, dynamic>{'success': instance.success, 'data': instance.data};
