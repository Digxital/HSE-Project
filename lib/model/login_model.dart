// To parse this JSON data, do
//
//     final loginModel = loginModelFromJson(jsonString);

import 'dart:convert';

LoginModel loginModelFromJson(String str) =>
    LoginModel.fromJson(json.decode(str));

String loginModelToJson(LoginModel data) => json.encode(data.toJson());

class User {
  final String id;
  final String email;
  final String name;
  final String firstName;
  final String lastName;
  final String tenantId;
  final dynamic location;

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.firstName,
    required this.lastName,
    required this.tenantId,
    required this.location,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String? ?? '',
      email: json['email'] as String? ?? '',
      name: json['name'] as String? ?? '',
      firstName: json['firstName'] as String? ?? '',
      lastName: json['lastName'] as String? ?? '',
      tenantId: json['tenantId'] as String? ?? '',
      location: json['location'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'firstName': firstName,
      'lastName': lastName,
      'tenantId': tenantId,
      'location': location,
    };
  }
}

class Data {
  final String token;
  final String role;
  final User user;

  Data({
    required this.token,
    required this.role,
    required this.user,
  });

  factory Data.fromJson(Map<String, dynamic> json) {
    return Data(
      token: json['token'] as String? ?? '',
      role: json['role'] as String? ?? '',
      user: User.fromJson(json['user'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'token': token,
      'role': role,
      'user': user.toJson(),
    };
  }
}

class LoginModel {
  final bool success;
  final String message;
  final Data data;

  LoginModel({
    required this.success,
    required this.message,
    required this.data,
  });

  factory LoginModel.fromJson(Map<String, dynamic> json) {
    return LoginModel(
      success: json['success'] as bool? ?? false,
      message: json['message'] as String? ?? '',
      data: Data.fromJson(json['data'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'success': success,
      'message': message,
      'data': data.toJson(),
    };
  }
}
