import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:invera_hse/api/api_status.dart';
import 'package:invera_hse/api/auth_service.dart';
import 'package:invera_hse/model/user_model.dart';
import 'package:invera_hse/utils/network_handler.dart';
import 'package:invera_hse/utils/url_paths.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfileService {
  static getUserProfile(userId) async {
    NetworkHandler networkHandler = NetworkHandler();
    Map<String, dynamic>? decodedData;
    int? errorCode;
    try {
      var response = await networkHandler.getRequest(
          urlPath: "${UserUrls.userProfile}/$userId",
          isProfile: true,
          isToken: true,
          isProperty: false,
          isSlot: false,
          isReservation: false,
          isHistory: false,
          isPortfolio: false,
          isShortlet: false,
          isTransactionHistory: false,
          isNotification: false,
          isBlog: false,
          isOpen: false,
          isWallet: false);
      decodedData = jsonDecode(response['data'].body);
      print("user-profile-status-code: ${response['code']}");
      print("user-profile-response-data: ${decodedData?['data']}");
      if (response['code'] == 200 || response['code'] == 201) {
        return Success(data: userModelFromJson(decodedData!));
      } else {
        return Failure(message: "${response?['code']}");
      }
    } on SocketException catch (_) {
      return Failure(message: "Kindly, check your internet connection.");
    } on TimeoutException catch (_) {
      return Failure(message: "Request Timeout.");
    } on FormatException catch (_) {
      return Failure(message: "Invalid Format");
    } catch (e) {
      print("eeee:here: $e");
      return Failure(message: "${decodedData?['message']}");
    }
  }

  // static updateProfile({Map<String, dynamic>? data, String? userId}) async {
  //   NetworkHandler networkHandler = NetworkHandler();
  //   Map<String, dynamic>? decodedData;
  //   dynamic response;
  //   try {
  //     var response = await networkHandler.postRequest(
  //         urlPath: "${AuthenticationUrls.userUpdate}/$userId",
  //         isToken: true,
  //         isProfile: true,
  //         body: data!,
  //         isProperty: false,
  //         isShortlet: false,
  //         isSlot: false,
  //         isReservation: false,
  //         isReview: false,
  //         isNotification: false,
  //         isWallet: false);
  //     decodedData = jsonDecode(response['data'].body);
  //     if (response['code'] == 200 || response['code'] == 201) {
  //       return Success(message: decodedData?['message']);
  //     } else {
  //       return Failure(message: "${decodedData?['message']}");
  //     }
  //   } on SocketException catch (_) {
  //     return Failure(message: "Kindly, check your internet connection.");
  //   } on TimeoutException catch (_) {
  //     return Failure(message: "Request Timeout.");
  //   } on FormatException catch (_) {
  //     return Failure(message: "Invalid Format");
  //   } catch (e) {
  //     return Failure(message: "${decodedData!['message']}");
  //   }
  // }

  // static logOut() async {
  //   NetworkHandler networkHandler = NetworkHandler();
  //   Map<String, dynamic>? decodedData;
  //   dynamic response;
  //   try {
  //     var response = await networkHandler.postRequest(
  //         urlPath: AuthenticationUrls.logOut,
  //         isToken: true,);
  //     decodedData = jsonDecode(response['data'].body);
  //     if (response['code'] == 200 || response['code'] == 201) {
  //       const storage = FlutterSecureStorage();
  //       final prefs = await SharedPreferences.getInstance();
  //       storage.delete(key: "token");
  //       // prefs.remove("isLoggedIn");
  //       // await AuthService.removeLoggedInUser();
  //       // prefs.clear();
  //       return Success(message: decodedData?['message']);
  //     } else {
  //       return Failure(errors: "${decodedData?['errors']}");
  //     }
  //   } on SocketException catch (_) {
  //     return Failure(message: "Kindly, check your internet connection.");
  //   } on TimeoutException catch (_) {
  //     return Failure(message: "Request Timeout.");
  //   } on FormatException catch (_) {
  //     return Failure(message: "Invalid Format");
  //   } catch (e) {
  //     return Failure(message: "${response['message']}");
  //   }
  // }
}
