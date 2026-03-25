import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:invera_hse/api/api_status.dart';
import 'package:invera_hse/model/reports_model.dart';
import 'package:invera_hse/utils/network_handler.dart';
import 'package:invera_hse/utils/url_paths.dart';

class ReportService {
  static getRepors(userId) async {
    NetworkHandler networkHandler = NetworkHandler();
    Map<String, dynamic>? decodedData;
    int? errorCode;
    try {
      var response = await networkHandler.getRequest(
        urlPath: ReportUrls.getReports,
        isToken: true,
      );
      decodedData = jsonDecode(response['data'].body);
      print("get-reports-status-code: ${response['code']}");
      print("get-reports-response-data: ${decodedData?['data']}");
      if (response['code'] == 200 || response['code'] == 201) {
        return Success(data: reportModelFromJson(decodedData!));
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
      return Failure(message: "${decodedData?['message']}");
    }
  }
}
