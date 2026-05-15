import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:invera_hse/api/api_status.dart';
import 'package:invera_hse/model/login_model.dart';
import 'package:invera_hse/utils/network_handler.dart';
import 'package:invera_hse/utils/url_paths.dart';

class LoginService {
  static loginUser(Map<String, dynamic>? data) async {
    NetworkHandler networkHandler = NetworkHandler();
    Map<String, dynamic>? decodedData;
    try {
      var response = await networkHandler.postRequest(
        urlPath: AuthUrls.login,
        isToken: false,
        isOpen: false,
        body: data!,
      );
      print("resp-login: $response");
      decodedData = jsonDecode(response['data'].body);
      if (response['code'] == 200 || response['code'] == 201) {
        return Success(data: loginModelFromJson(response['data'].body));
      } else {
        return Failure(
            message: "${response?['code']}",
            errors: "${decodedData?['message']}");
      }
    } on SocketException catch (_) {
      return LoginFailure(message: "Kindly, check your internet connection.");
    } on TimeoutException catch (_) {
      return LoginFailure(message: "Request Timeout.");
    } on FormatException catch (_) {
      return LoginFailure(message: "Invalid Format");
    } catch (e) {
      return LoginFailure(message: "${decodedData?['errors']}");
    }
  }
}
