// To parse this JSON data, do
//
//     final userModel = userModelFromJson(jsonString);

import 'dart:convert';

ReportModel reportModelFromJson(Map<String, dynamic> data) =>
    ReportModel.fromJson(data);

String repportModelToJson(ReportModel data) => json.encode(data.toJson());

class ReportModel {
  ReportModel({
    required this.data,
  });

  final Data data;

  factory ReportModel.fromJson(Map<String, dynamic> json) => ReportModel(
        data: Data.fromJson(json["data"]),
      );

  Map<String, dynamic> toJson() => {
        "data": data.toJson(),
      };
}

class Data {
  Data({
    required this.id,
    required this.title,
    required this.description,
  });

  String? id;
  String? title;
  String? description;

  factory Data.fromJson(Map<String, dynamic> json) {
    return Data(
      id: json["id"],
      title: json["title"],
      description: json["description"],
    );
  }

  Map<String, dynamic> toJson() => {
        "id": id,
        "title": title,
        "description": description,
      };
}
