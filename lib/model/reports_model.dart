// To parse this JSON data, do
//
//     final reportModel = reportModelFromJson(jsonString);

import 'dart:convert';

ReportModel reportModelFromJson(dynamic data) {
  final Map<String, dynamic> jsonMap = data is String ? json.decode(data) : data;
  return ReportModel.fromJson(jsonMap);
}

String repportModelToJson(ReportModel data) => json.encode(data.toJson());

class ReportModel {
  ReportModel({
    required this.data,
  });

  final Data data;

  factory ReportModel.fromJson(Map<String, dynamic> json) => ReportModel(
        data: Data.fromJson(json["data"] ?? <String, dynamic>{}),
      );

  Map<String, dynamic> toJson() => {
        "data": data.toJson(),
      };
}

class Data {
  Data({
    this.id,
    this.recordType,
    this.title,
    this.description,
    this.riskLevel,
    this.location,
    this.eventDate,
    this.eventTime,
    this.peopleAffected,
    this.injuryDetails,
    this.equipmentInvolved,
  });

  String? id;
  String? recordType;
  String? title;
  String? description;
  String? riskLevel;
  Location? location;
  String? eventDate;
  String? eventTime;
  int? peopleAffected;
  String? injuryDetails;
  String? equipmentInvolved;

  factory Data.fromJson(Map<String, dynamic> json) {
    return Data(
      id: json["id"],
      recordType: json["recordType"],
      title: json["title"],
      description: json["description"],
      riskLevel: json["riskLevel"],
      location: json["location"] != null
          ? Location.fromJson(json["location"])
          : null,
      eventDate: json["eventDate"],
      eventTime: json["eventTime"],
      peopleAffected: json["peopleAffected"] is int
          ? json["peopleAffected"]
          : (json["peopleAffected"] != null
              ? int.tryParse(json["peopleAffected"].toString())
              : null),
      injuryDetails: json["injuryDetails"],
      equipmentInvolved: json["equipmentInvolved"],
    );
  }

  Map<String, dynamic> toJson() => {
        "id": id,
        "recordType": recordType,
        "title": title,
        "description": description,
        "riskLevel": riskLevel,
        "location": location?.toJson(),
        "eventDate": eventDate,
        "eventTime": eventTime,
        "peopleAffected": peopleAffected,
        "injuryDetails": injuryDetails,
        "equipmentInvolved": equipmentInvolved,
      };
}

class Location {
  Location({this.clientId, this.siteId, this.specificArea});

  String? clientId;
  String? siteId;
  String? specificArea;

  factory Location.fromJson(Map<String, dynamic> json) => Location(
        clientId: json["clientId"],
        siteId: json["siteId"],
        specificArea: json["specificArea"],
      );

  Map<String, dynamic> toJson() => {
        "clientId": clientId,
        "siteId": siteId,
        "specificArea": specificArea,
      };
}
