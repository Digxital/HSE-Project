import 'package:flutter/material.dart';
import 'package:invera_hse/api/api_status.dart';
import 'package:invera_hse/api/report_service.dart';
import 'package:invera_hse/error_model/error_model/data_error.dart';
import 'package:invera_hse/model/reports_model.dart';

class ReportViewModel extends ChangeNotifier {
  bool _loading = false;
  ReportModel? _reportModel;
  DataError? _dataError;
  Failure? _failure;

  bool get loading => _loading;
  ReportModel? get reportModel => _reportModel;
  DataError? get dataError => _dataError;
  Failure? get failure => _failure;

  ReportViewModel();

  setLoading(bool loading) {
    _loading = loading;
    notifyListeners();
  }

  setReportModel(dynamic reportModel) => _reportModel = reportModel;

  setDataError(DataError dataError) => _dataError = dataError;

  createReportData(data) async {
    setLoading(true);
    var response = await ReportService.createReport(data);
    print("report-response: $response");
    if (response is Success) {
      setReportModel(response.data);
    }
    if (response is Failure) {
      print("response-error-code: ${response.message}");
      print("response-eror-message: ${response.errors}");
      DataError dataError = DataError(
          code: int.parse(response.message.toString()),
          message: response.errors.toString());
      setDataError(dataError);
    }
    if (response is Failure) {
      DataError dataError = DataError(message: response.errors.toString());
      setDataError(dataError);
    }
    setLoading(false);
  }
}
