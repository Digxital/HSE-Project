import 'dart:convert';
import 'dart:io';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:invera_hse/api/auth_service.dart';
import 'package:invera_hse/utils/url_paths.dart';
import 'package:logger/logger.dart';

class NetworkHandler {
  var log = Logger();
  final storage = const FlutterSecureStorage();

  Future getLoadedFile(String url) async {
    final response = await http.get(Uri.parse(url));
    final bytes = response.bodyBytes;

    try {
      if (response.statusCode == 200 || response.statusCode == 201) {
        dynamic file = await _storeFile(url, bytes);
        return {"data": file, "code": response.statusCode};
      } else {
        print("failed-response-body: $url ${response.body}");
        return {"data": response, "code": response.statusCode};
      }
    } catch (e) {
      print(e.toString());
    }
  }

  static Future<File> _storeFile(String url, List<int> bytes) async {
    final fileName = url.split('/').last;
    final directory = Directory.systemTemp;
    final file = File('${directory.path}/$fileName');

    await file.writeAsBytes(bytes);
    return file;
  }

  // get request
  Future getRequest(
      {String? urlPath,
      bool? isProfile,
      bool? isPortfolio,
      bool? isProperty,
      bool? isSlot,
      bool? isShortlet,
      bool? isReservation,
      bool? isHistory,
      bool? isWallet,
      bool? isTransactionHistory,
      bool? isNotification,
      bool? isBlog,
      bool? isOpen,
      required bool isToken}) async {
    dynamic response;
    dynamic url;

    url = Uri.parse(formater(urlPath!));

    log.i("URL: $url");

    if (isToken) {
      String? token = await AuthService.getAccessToken();
      log.i('read Token  $token');
      response = await http.get(
        url,
        headers: {
          "content-type": "application/json",
          "X-Version": "2.2",
          "X-Tenant": "01jj0kxqv8rzjy3xnwc5p7htmb",
          "Authorization": "Bearer $token"
        },
      );
      log.i("response-body: ${response.body}");
    } else {
      response = await http.get(
        url,
      );
    }

    try {
      if (response.statusCode == 200 || response.statusCode == 201) {
        log.i("success-response-body: ${response.body}");

        // return json.decode(response.body);
        return {"data": response, "code": response.statusCode};
      } else {
        log.i("failed-response-body: $url ${response.body}");
        // return json.decode(response.body);
        return {"data": response, "code": response.statusCode};
      }
    } catch (e) {
      log.i(e.toString());
    }
  }

  // get request
  Future getRequestWithBody(
      {String? urlPath,
      required Map<String, dynamic> body,
      bool? isProfile,
      bool? isPortfolio,
      bool? isProperty,
      bool? isSlot,
      bool? isShortlet,
      bool? isReservation,
      bool? isHistory,
      bool? isWallet,
      bool? isTransactionHistory,
      required bool isToken}) async {
    http.StreamedResponse? response;
    dynamic url;

    url = Uri.parse(formater(urlPath!));

    log.i("URL: $url");

    if (isToken) {
      String? token = await AuthService.getAccessToken();
      log.i('read Token  $token');
      try {
        final request = http.Request('GET', Uri.parse(url.toString()));
        request.body = jsonEncode(body);
        request.headers.addAll({
          "content-type": "application/json",
          "X-Version": "2.2",
          "X-Tenant": "01jj0kxqv8rzjy3xnwc5p7htmb",
          "Authorization": "Bearer $token",
        });

        response = await request.send();
      } catch (e) {
        print('Error creating request: $e');
      }
    } else {
      final request = http.Request('GET', Uri.parse(url));
      request.body = jsonEncode(body);
      request.headers.addAll({
        "content-type": "application/json",
        "X-Version": "2.2",
        "X-Tenant": "01jj0kxqv8rzjy3xnwc5p7htmb",
      });

      response = await request.send();
    }

    try {
      if (response!.statusCode == 200 || response.statusCode == 201) {
        final responseBody = await response.stream.bytesToString();
        log.i('success-response-body: $responseBody');

        return {"data": responseBody, "code": response.statusCode};
      } else {
        final responseBody = await response.stream.bytesToString();
        log.i('success-response-body: $responseBody');

        return {"data": responseBody, "code": response.statusCode};
      }
    } catch (e) {
      log.i(e.toString());
    }
  }

  // post request
  Future<dynamic> postRequest(
      {String? urlPath,
      required Map<String, dynamic> body,
      required bool isToken,
      bool? isProfile,
      bool? isWallet,
      bool? isProperty,
      bool? isSlot,
      bool? isReservation,
      bool? isNotification,
      bool? isShortlet,
      bool? isReview}) async {
    dynamic response;
    dynamic url;
    url = Uri.parse(formater(urlPath!));

    log.i("URL: $url");

    if (isToken) {
      String? token = await AuthService.getAccessToken();
      response = await http.post(url,
          headers: {
            "content-type": "application/json",
            "accept": "application/json",
            "X-Version": "2.2",
            "X-Tenant": "01jj0kxqv8rzjy3xnwc5p7htmb",
            "Authorization": "Bearer $token"
          },
          body: json.encode(body));
      log.i("token: $token");
      print("respo: ${response.body}");
    } else {
      response = await http.post(url,
          headers: {
            "content-type": "application/json",
            "X-Version": "2.2",
            "X-Tenant": "01jj0kxqv8rzjy3xnwc5p7htmb",
            "accept": "application/json"
          },
          // headers: {"accept": "application/json"},
          body: json.encode(body));
      print("ResponseData: $response");
    }
    print("check");

    try {
      if (response.statusCode == 200 || response.statusCode == 201) {
        print("Statuss code: ${response.statusCode}");
        log.i(response.body);
        log.i(response.statusCode);
        return {"data": response, "code": response.statusCode};
      } else {
        print("Statuss code 2: ${response.statusCode}");
        log.d(response.statusCode);
        log.i(response.body);
        return {"data": response, "code": response.statusCode};
      }
    } catch (e) {
      log.i(e.toString());
    }
  }

  // patch request
  Future<dynamic> patchRequest(
      dynamic urlPath, Map<String, dynamic> data) async {
    var url = Uri.parse(formater(urlPath));
    log.i("URL: $url");
    String? token = await AuthService.getAccessToken();
    var response = await http.patch(url,
        headers: {"Authorization": "Bearer $token"}, body: jsonEncode(data));

    try {
      if (response.statusCode == 200 || response.statusCode == 201) {
        log.i(response.body);
        return response;
      } else {
        log.d(response.statusCode);
        log.d(response.body);
        return response;
      }
    } catch (e) {
      log.i(e.toString());
    }
  }

  // put request
  Future<dynamic> putRequest(
      {required String urlPath,
      required Map<String, dynamic> body,
      required bool isToken}) async {
    String? token = await AuthService.getAccessToken();
    dynamic response;
    dynamic url;

    url = Uri.parse(formater(urlPath));
    log.i("URL: $url");

    response = await http.put(url,
        headers: {
          "Content-type": "application/json",
          "X-Version": "2.2",
          "X-Tenant": "01jj0kxqv8rzjy3xnwc5p7htmb",
          "Authorization": "Bearer $token"
        },
        body: jsonEncode(body));
    try {
      if (response.statusCode == 200 || response.statusCode == 201) {
        log.i(response.body);
        return response;
      } else {
        log.i(response.statusCode);
        log.i(response.body);
        return response;
      }
    } catch (e) {
      log.i(e.toString());
    }
  }

  // delete requesrt
  Future<dynamic> deleteRequest(
      dynamic urlPath, Map<String, dynamic> data) async {
    String? token = await AuthService.getAccessToken();
    var url = Uri.parse(formater(urlPath));
    log.i("URL: $url");
    var response = await http.put(url,
        headers: {
          "Content-type": "application/json",
          "X-Version": "2.2",
          "X-Tenant": "01jj0kxqv8rzjy3xnwc5p7htmb",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode(data));

    try {
      if (response.statusCode == 200 || response.statusCode == 201) {
        log.i(response.body);
        return response;
      } else {
        log.d(response.statusCode);
        log.d(response.body);
        return response;
      }
    } catch (e) {
      log.i(e.toString());
    }
  }

  // format url
  String formater(String url) {
    return baseUrl + authApi + url;
  }

  // format url
  String openFormater(String url) {
    return baseUrl + api + url;
  }
}
