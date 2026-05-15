// To parse this JSON data, do
//
//     final userModel = userModelFromJson(jsonString);

import 'dart:convert';

UserModel userModelFromJson(Map<String, dynamic> data) =>
    UserModel.fromJson(data);

String userModelToJson(UserModel data) => json.encode(data.toJson());

class User {
  final String location;
  final bool isUnderInvestigation;
  final String id;
  final String tenantId;
  final String firstName;
  final String lastName;
  final String email;
  final String role;
  final String status;
  final String createdAt;
  final String updatedAt;
  final int v;

  User({
    required this.location,
    required this.isUnderInvestigation,
    required this.id,
    required this.tenantId,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.role,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    required this.v,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      location: json['location'] as String? ?? '',
      isUnderInvestigation: json['isUnderInvestigation'] as bool? ?? false,
      id: json['_id'] as String? ?? '',
      tenantId: json['tenantId'] as String? ?? '',
      firstName: json['firstName'] as String? ?? '',
      lastName: json['lastName'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? '',
      status: json['status'] as String? ?? '',
      createdAt: json['createdAt'] as String? ?? '',
      updatedAt: json['updatedAt'] as String? ?? '',
      v: (json['__v'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'location': location,
      'isUnderInvestigation': isUnderInvestigation,
      '_id': id,
      'tenantId': tenantId,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'role': role,
      'status': status,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      '__v': v,
    };
  }
}

class Data {
  final User user;

  Data({
    required this.user,
  });

  factory Data.fromJson(Map<String, dynamic> json) {
    return Data(
      user: User.fromJson(json['user'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user': user.toJson(),
    };
  }
}

class UserModel {
  final bool success;
  final String message;
  final Data data;

  UserModel({
    required this.success,
    required this.message,
    required this.data,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
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
