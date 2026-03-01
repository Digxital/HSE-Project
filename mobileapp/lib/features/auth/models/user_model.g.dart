// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_UserModel _$UserModelFromJson(Map<String, dynamic> json) => _UserModel(
  id: const StringConverter().fromJson(json['id']),
  email: json['email'] as String? ?? '',
  firstName: json['first_name'] as String? ?? '',
  lastName: json['last_name'] as String? ?? '',
  profileImage: json['profile_image'] as String? ?? '',
  phone: json['phone'] as String?,
  emailVerifiedAt: json['email_verified_at'] == null
      ? null
      : DateTime.parse(json['email_verified_at'] as String),
  isAdmin: json['is_admin'] as bool?,
  recipientId: json['recipient_id'] as String?,
  isActive: json['is_active'] as bool?,
  referralCode: json['referral_code'] as String?,
  hideBalance: json['hide_balance'] as bool?,
  authMethod: json['auth_method'] as String?,
  createdAt: json['created_at'] == null
      ? null
      : DateTime.parse(json['created_at'] as String),
  updatedAt: json['updated_at'] == null
      ? null
      : DateTime.parse(json['updated_at'] as String),
);

Map<String, dynamic> _$UserModelToJson(_UserModel instance) =>
    <String, dynamic>{
      'id': const StringConverter().toJson(instance.id),
      'email': instance.email,
      'first_name': instance.firstName,
      'last_name': instance.lastName,
      'profile_image': instance.profileImage,
      'phone': instance.phone,
      'email_verified_at': instance.emailVerifiedAt?.toIso8601String(),
      'is_admin': instance.isAdmin,
      'recipient_id': instance.recipientId,
      'is_active': instance.isActive,
      'referral_code': instance.referralCode,
      'hide_balance': instance.hideBalance,
      'auth_method': instance.authMethod,
      'created_at': instance.createdAt?.toIso8601String(),
      'updated_at': instance.updatedAt?.toIso8601String(),
    };
