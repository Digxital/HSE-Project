import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

// Custom converter for handling int -> String conversion
class StringConverter implements JsonConverter<String, dynamic> {
  const StringConverter();

  @override
  String fromJson(dynamic json) {
    if (json == null) return '';
    if (json is String) return json;
    if (json is int) return json.toString();
    if (json is double) return json.toString();
    return json.toString();
  }

  @override
  dynamic toJson(String object) => object;
}

@freezed
abstract class UserModel with _$UserModel {
  const factory UserModel({
    @StringConverter() required String id,  // 👈 This converts int to String
    @JsonKey(defaultValue: '') required String email,
    @JsonKey(name: 'first_name', defaultValue: '') required String firstName,
    @JsonKey(name: 'last_name', defaultValue: '') required String lastName,
    @JsonKey(name: 'profile_image', defaultValue: '') required String profileImage,
    @JsonKey(name: 'phone') String? phone, 
    @JsonKey(name: 'email_verified_at') DateTime? emailVerifiedAt,
    @JsonKey(name: 'is_admin') bool? isAdmin, 
    @JsonKey(name: 'recipient_id') String? recipientId,
    @JsonKey(name: 'is_active') bool? isActive,
    @JsonKey(name: 'referral_code') String? referralCode,
    @JsonKey(name: 'hide_balance') bool? hideBalance,
    @JsonKey(name: 'auth_method') String? authMethod,
    @JsonKey(name: 'created_at') DateTime? createdAt,
    @JsonKey(name: 'updated_at') DateTime? updatedAt,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) => 
      _$UserModelFromJson(json);
}

// Extension for custom getters
extension UserModelX on UserModel {
  String get fullName => '$firstName $lastName';
  
  bool get isEmailVerified => emailVerifiedAt != null;
}