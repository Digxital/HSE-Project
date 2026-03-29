// To parse this JSON data, do
//
//     final userModel = userModelFromJson(jsonString);

import 'dart:convert';

UserModel userModelFromJson(Map<String, dynamic> data) =>
    UserModel.fromJson(data);

String userModelToJson(UserModel data) => json.encode(data.toJson());

class UserModel {
  UserModel({
    required this.data,
  });

  final Data data;

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        data: Data.fromJson(json["data"]),
      );

  Map<String, dynamic> toJson() => {
        "data": data.toJson(),
      };
}

class Data {
  Data({
    required this.id,
    required this.firstName,
    required this.surname,
    required this.email,
    required this.phone,
  });

  String? id;
  String? firstName;
  String? surname;
  String? email;
  String? phone;

  factory Data.fromJson(Map<String, dynamic> json) {
    return Data(
      id: json["id"],
      firstName: json["first_name"],
      surname: json["surname"],
      email: json["email"],
      phone: json["phone"],
    );
  }

  Map<String, dynamic> toJson() => {
        "id": id,
        "first_name": firstName,
        "surname": surname,
        "email": email,
        "phone": phone,
      };
}
