// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'login_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_LoginRequestModel _$LoginRequestModelFromJson(Map<String, dynamic> json) =>
    _LoginRequestModel(
      email: json['email'] as String? ?? '',
      password: json['password'] as String? ?? '',
      rememberMe: json['rememberMe'] as bool? ?? false,
      provider: json['provider'] as String? ?? 'email',
      providerToken: json['providerToken'] as String?,
      providerData: json['providerData'] as Map<String, dynamic>?,
    );

Map<String, dynamic> _$LoginRequestModelToJson(_LoginRequestModel instance) =>
    <String, dynamic>{
      'email': instance.email,
      'password': instance.password,
      'rememberMe': instance.rememberMe,
      'provider': instance.provider,
      'providerToken': instance.providerToken,
      'providerData': instance.providerData,
    };
