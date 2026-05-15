import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:invera_hse/api/api_status.dart';
import 'package:invera_hse/model/reports_model.dart';
import 'package:invera_hse/utils/network_handler.dart';
import 'package:invera_hse/utils/url_paths.dart';

class ReportService {
  static createReport(Map<String, dynamic>? data) async {
    NetworkHandler networkHandler = NetworkHandler();
    Map<String, dynamic>? decodedData;
    try {
      var response = await networkHandler.postRequest(
        urlPath: ReportUrls.createReports,
        isToken: true,
        isOpen: true,
        body: data!,
      );
      print("resp-report: $response");
      decodedData = jsonDecode(response['data'].body);
      if (response['code'] == 200 || response['code'] == 201) {
        return Success(data: reportModelFromJson(response['data'].body));
      } else {
        return Failure(
            message: "${response?['code']}",
            errors: "${decodedData?['message']}");
      }
    } on SocketException catch (_) {
      return Failure(message: "Kindly, check your internet connection.");
    } on TimeoutException catch (_) {
      return Failure(message: "Request Timeout.");
    } on FormatException catch (_) {
      return Failure(message: "Invalid Format");
    } catch (e) {
      return Failure(message: "${decodedData?['errors']}");
    }
  }

  static getReports(userId) async {
    NetworkHandler networkHandler = NetworkHandler();
    Map<String, dynamic>? decodedData;
    try {
      var response = await networkHandler.getRequest(
          urlPath: ReportUrls.getReports, isToken: true, isOpen: true);
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
