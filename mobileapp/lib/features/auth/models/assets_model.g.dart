// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assets_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_AssetsResponse _$AssetsResponseFromJson(Map<String, dynamic> json) =>
    _AssetsResponse(
      referralsMade: json['referralsMade'] as List<dynamic>,
      hasMoreReferrals: json['hasMoreReferrals'] as bool,
      totalAmount: const NumToStringConverter().fromJson(json['totalAmount']),
      walletBalance: const NumToStringConverter().fromJson(
        json['walletBalance'],
      ),
      totalPropertyAmount: const NumToStringConverter().fromJson(
        json['totalPropertyAmount'],
      ),
      totalAssets: const NumToStringConverter().fromJson(json['totalAssets']),
      transactions: json['transactions'] as List<dynamic>,
    );

Map<String, dynamic> _$AssetsResponseToJson(
  _AssetsResponse instance,
) => <String, dynamic>{
  'referralsMade': instance.referralsMade,
  'hasMoreReferrals': instance.hasMoreReferrals,
  'totalAmount': const NumToStringConverter().toJson(instance.totalAmount),
  'walletBalance': const NumToStringConverter().toJson(instance.walletBalance),
  'totalPropertyAmount': const NumToStringConverter().toJson(
    instance.totalPropertyAmount,
  ),
  'totalAssets': const NumToStringConverter().toJson(instance.totalAssets),
  'transactions': instance.transactions,
};
