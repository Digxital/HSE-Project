import 'package:aegix/core/utils/validators.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'login_form_model.freezed.dart';

@freezed
abstract class LoginFormModel with _$LoginFormModel {
  const factory LoginFormModel({
    @Default('') String email,
    @Default('') String password,
    @Default(false) bool rememberMe,
    @Default(false) bool isLoading,
    String? errorMessage,
  }) = _LoginFormModel;

  factory LoginFormModel.initial() => const LoginFormModel();
}

// Extension for validation
extension LoginFormModelX on LoginFormModel {
  bool get isEmailValid => email.isValidEmail;
  bool get isPasswordValid => password.isValidPassword;
  bool get isFormValid => isEmailValid && isPasswordValid;
}