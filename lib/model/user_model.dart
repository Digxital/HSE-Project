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
    required this.fullName,
    required this.firstName,
    required this.lastName,
    required this.otherName,
    required this.email,
    required this.phone,
    required this.status,
    required this.balance,
    required this.onesignalId,
    required this.paystackCustomerId,
    required this.paystackCustomerCode,
    required this.dob,
    required this.emailVerifiedAt,
    required this.dateJoined,
    required this.avatar,
    required this.bvnStatus,
    required this.govtIdStatus,
    required this.verificationStatus,
    required this.virtualAccount,
    required this.pinCreated,
    required this.referralCode,
    required this.salesManager,
    required this.pushNotification,
    required this.permissions,
    required this.preferences,
    required this.rentalIncome,
    required this.nextPayout,
    required this.daysLeft,
  });

  String? id;
  String? fullName;
  String? firstName;
  String? lastName;
  String? otherName;
  String? email;
  String? phone;
  String? status;
  String? balance;
  String? onesignalId;
  String? paystackCustomerId;
  String? paystackCustomerCode;
  String? dob;
  DateTime? emailVerifiedAt;
  String? dateJoined;
  dynamic avatar;
  String? bvnStatus;
  String? govtIdStatus;
  String? verificationStatus;
  VirtualAccount? virtualAccount;
  bool? pinCreated;
  String? referralCode;
  SalesManager? salesManager;
  bool? pushNotification;
  dynamic permissions;
  final Preferences? preferences;
  String? rentalIncome;
  String? nextPayout;
  dynamic daysLeft;

  factory Data.fromJson(Map<String, dynamic> json) {
    return Data(
      id: json["id"],
      fullName: json["full_name"],
      firstName: json["first_name"],
      lastName: json["last_name"],
      otherName: json["other_name"],
      email: json["email"],
      phone: json["phone"],
      status: json["status"],
      balance: json["balance"],
      onesignalId: json["onesignal_id"],
      paystackCustomerId: json["paystack_customer_id"],
      paystackCustomerCode: json["paystack_customer_code"],
      dob: json["dob"],
      emailVerifiedAt: DateTime.tryParse(json["email_verified_at"] ?? ""),
      dateJoined: json["date_joined"],
      avatar: json["avatar"],
      bvnStatus: json["bvn_status"],
      govtIdStatus: json["govt_id_status"],
      verificationStatus: json["verification_status"],
      virtualAccount: json["virtual_account"] == null
          ? null
          : VirtualAccount.fromJson(json["virtual_account"]),
      pinCreated: json["pin_created"],
      referralCode: json["referral_code"],
      salesManager: json["sales_manager"] == null
          ? null
          : SalesManager.fromJson(json["sales_manager"]),
      pushNotification: json["push_notification"],
      permissions: json["permissions"],
      preferences: json["preferences"] == null
          ? null
          : Preferences.fromJson(json["preferences"]),
      rentalIncome: json["rental_income"],
      nextPayout: json["next_payout"],
      daysLeft: json["days_left"],
    );
  }

  Map<String, dynamic> toJson() => {
        "id": id,
        "full_name": fullName,
        "first_name": firstName,
        "last_name": lastName,
        "other_name": otherName,
        "email": email,
        "phone": phone,
        "status": status,
        "balance": balance,
        "onesignal_id": onesignalId,
        "paystack_customer_id": paystackCustomerId,
        "paystack_customer_code": paystackCustomerCode,
        "dob": dob,
        "email_verified_at": emailVerifiedAt?.toIso8601String(),
        "date_joined": dateJoined,
        "avatar": avatar,
        "bvn_status": bvnStatus,
        "govt_id_status": govtIdStatus,
        "verification_status": verificationStatus,
        "virtual_account": virtualAccount?.toJson(),
        "pin_created": pinCreated,
        "referral_code": referralCode,
        "sales_manager": salesManager?.toJson(),
        "push_notification": pushNotification,
        "permissions": permissions,
        "preferences": preferences?.toJson(),
        "rental_income": rentalIncome,
        "next_payout": nextPayout,
        "days_left": daysLeft,
      };
}

class Preferences {
  Preferences({
    required this.propertyDeals,
  });

  final String? propertyDeals;

  factory Preferences.fromJson(Map<String, dynamic> json) {
    return Preferences(
      propertyDeals: json["property_deals"],
    );
  }

  Map<String, dynamic> toJson() => {
        "property_deals": propertyDeals,
      };
}

class SalesManager {
  SalesManager({
    required this.name,
    required this.phone,
    required this.profilePhotoPath,
    required this.email,
  });

  final String? name;
  final dynamic phone;
  final dynamic profilePhotoPath;
  final String? email;

  factory SalesManager.fromJson(Map<String, dynamic> json) {
    return SalesManager(
      name: json["name"],
      phone: json["phone"],
      profilePhotoPath: json["profile_photo_path"],
      email: json["email"],
    );
  }

  Map<String, dynamic> toJson() => {
        "name": name,
        "phone": phone,
        "profile_photo_path": profilePhotoPath,
        "email": email,
      };
}

class VirtualAccount {
  VirtualAccount({
    required this.id,
    required this.userId,
    required this.bankName,
    required this.accountName,
    required this.accountNumber,
    required this.currency,
    required this.bankId,
    required this.accountType,
  });

  String id;
  String userId;
  String bankName;
  String accountName;
  String accountNumber;
  String currency;
  String bankId;
  String accountType;

  factory VirtualAccount.fromJson(Map<String, dynamic> json) {
    return VirtualAccount(
      id: json["id"],
      userId: json["user_id"],
      bankName: json["bank_name"],
      accountName: json["account_name"],
      accountNumber: json["account_number"],
      currency: json["currency"],
      bankId: json["bank_id"],
      accountType: json["account_type"],
    );
  }

  Map<String, dynamic> toJson() => {
        "id": id,
        "user_id": userId,
        "bank_name": bankName,
        "account_name": accountName,
        "account_number": accountNumber,
        "currency": currency,
        "bank_id": bankId,
        "account_type": accountType,
      };
}
