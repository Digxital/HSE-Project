import 'package:freezed_annotation/freezed_annotation.dart';

part 'login_request_model.freezed.dart';
part 'login_request_model.g.dart';

@freezed
abstract class LoginRequestModel with _$LoginRequestModel {
  const factory LoginRequestModel({
    @Default('') String email,
    @Default('') String password,
    @Default(false) bool rememberMe,
    @Default('email') String provider,
    String? providerToken,
    Map<String, dynamic>? providerData,
    
  }) = _LoginRequestModel;

  factory LoginRequestModel.fromJson(Map<String, dynamic> json) => 
      _$LoginRequestModelFromJson(json);
      
}