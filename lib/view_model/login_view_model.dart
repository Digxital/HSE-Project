import 'package:flutter/material.dart';
import 'package:invera_hse/api/api_status.dart';
import 'package:invera_hse/api/login_service.dart';
import 'package:invera_hse/error_model/error_model/auth_error.dart';
import 'package:invera_hse/model/login_model.dart';

class LoginViewModel extends ChangeNotifier {
  bool _loading = false;
  LoginModel? _loginModel;
  AuthError? _authError;
  LoginFailure? _loginFailure;

  bool get loading => _loading;
  LoginModel? get loginModel => _loginModel;
  AuthError? get authError => _authError;
  LoginFailure? get loginFailure => _loginFailure;

  LoginViewModel();

  setLoading(bool loading) {
    _loading = loading;
    notifyListeners();
  }

  setLoginModel(dynamic loginModel) => _loginModel = loginModel;

  setAuthError(AuthError authError) => _authError = authError;

  loginUser(data) async {
    setLoading(true);
    var response = await LoginService.loginUser(data);
    print("login-response: $response");
    if (response is Success) {
      setLoginModel(response.data);
    }
    if (response is Failure) {
      print("response-error-code: ${response.message}");
      print("response-eror-message: ${response.errors}");
      AuthError authError = AuthError(
          code: int.parse(response.message.toString()),
          responseMessage: response.errors.toString());
      setAuthError(authError);
    }
    if (response is LoginFailure) {
      AuthError authError = AuthError(responseMessage: response.message);
      setAuthError(authError);
    }
    setLoading(false);
  }
}
