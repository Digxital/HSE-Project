class ApiResponse {
  String? message;
}

class Success extends ApiResponse {
  Object? data;
  @override
  String? message;
  Success({this.data, this.message});
}

class Failure {
  String? message;
  Object? errors;
  Failure({this.message, this.errors});
}

class LoginFailure {
  String? message;
  LoginFailure({this.message});
}
