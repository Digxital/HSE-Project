import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:intl/intl.dart';

part 'assets_model.freezed.dart';
part 'assets_model.g.dart';

// Custom converter to handle both String and num
class NumToStringConverter implements JsonConverter<String, dynamic> {
  const NumToStringConverter();

  @override
  String fromJson(dynamic json) {
    if (json == null) return '0';
    if (json is String) return json;
    if (json is num) return json.toString();
    return '0';
  }

  @override
  dynamic toJson(String object) => object;
}

@freezed
abstract class AssetsResponse with _$AssetsResponse {
  const factory AssetsResponse({
    @JsonKey(name: 'referralsMade') required List<dynamic> referralsMade,
    @JsonKey(name: 'hasMoreReferrals') required bool hasMoreReferrals,
    @JsonKey(name: 'totalAmount') @NumToStringConverter() required String totalAmount,
    @JsonKey(name: 'walletBalance') @NumToStringConverter() required String walletBalance,
    @JsonKey(name: 'totalPropertyAmount') @NumToStringConverter() required String totalPropertyAmount,
    @JsonKey(name: 'totalAssets') @NumToStringConverter() required String totalAssets,
    @JsonKey(name: 'transactions') required List<dynamic> transactions,
  }) = _AssetsResponse;

  factory AssetsResponse.fromJson(Map<String, dynamic> json) => 
      _$AssetsResponseFromJson(json);
}

// Extension for computed properties with conversion
extension AssetsResponseX on AssetsResponse {
  // Convert string fields to num for calculations
  num get totalAmountNum => num.tryParse(totalAmount) ?? 0;
  num get walletBalanceNum => num.tryParse(walletBalance) ?? 0;
  num get totalPropertyAmountNum => num.tryParse(totalPropertyAmount) ?? 0;
  num get totalAssetsNum => num.tryParse(totalAssets) ?? 0;
  
  // Formatted getters
  String get formattedTotalAmount => '₦${totalAmountNum.toStringAsFixed(2)}';
  String get formattedPropertyAmount => '₦${totalPropertyAmountNum.toStringAsFixed(2)}';
  String get formattedWalletBalance {
    final value = walletBalanceNum; // This is your num getter
    final formatter = NumberFormat('#,##0.00', 'en_US');
    return formatter.format(value);
  }
  
  // Boolean checks
  bool get hasAssets => totalAssetsNum > 0;
  bool get hasTransactions => transactions.isNotEmpty;
}