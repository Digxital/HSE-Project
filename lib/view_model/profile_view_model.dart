import 'package:flutter/material.dart';
import 'package:invera_hse/api/api_status.dart';
import 'package:invera_hse/api/profile_service.dart';
import 'package:invera_hse/error_model/error_model/auth_error.dart';
import 'package:invera_hse/error_model/error_model/data_error.dart';
import 'package:invera_hse/model/user_model.dart';

class ProfileViewModel extends ChangeNotifier {
  bool _loading = false;
  UserModel? _userModel;
  String? _successUpdateMessage;
  AuthError? _authError;
  DataError? _dataError;
  Failure? _failure;

  bool get loading => _loading;
  UserModel? get userModel => _userModel;
  String? get successUpdateMessage => _successUpdateMessage;
  AuthError? get authError => _authError;
  DataError? get dataError => _dataError;
  Failure? get failure => _failure;

  ProfileViewModel();

  setLoading(bool loading) {
    _loading = loading;
    notifyListeners();
  }

  setUserModel(dynamic userModel) => _userModel = userModel;

  setAuthError(AuthError authError) => _authError = authError;

  setDataError(DataError dataError) => _dataError = dataError;

  getUser({data, String? userId}) async {
    setLoading(true);
    var response = await ProfileService.getUserProfile(userId);
    print("user-resp-data: $response");
    if (response is Success) {
      setUserModel(response.data);
    }
    if (response is Failure) {
      AuthError authError = AuthError(responseMessage: response.message);
      setAuthError(authError);
    }
    setLoading(false);
  }

  // updateProfile({data, userId}) async {
  //   setLoading(true);
  //   var response =
  //       await ProfileService.updateProfile(data: data, userId: userId);
  //   if (response is Success) {
  //     _successUpdateMessage = response.message;
  //   }
  //   if (response is Failure) {
  //     AuthError authError = AuthError(responseMessage: response.message);
  //     setAuthError(authError);
  //   }
  //   setLoading(false);
  // }

  // logOut() async {
  //   setLoading(true);
  //   var response = await ProfileService.logOut();
  //   if (response is Success) {
  //     _successUpdateMessage = response.message;
  //   }
  //   if (response is Failure) {
  //     AuthError authError = AuthError(responseMessage: response.message);
  //     setAuthError(authError);
  //   }
  //   setLoading(false);
  // }
}
