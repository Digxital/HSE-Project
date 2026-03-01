// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'assets_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$AssetsResponse {

@JsonKey(name: 'referralsMade') List<dynamic> get referralsMade;@JsonKey(name: 'hasMoreReferrals') bool get hasMoreReferrals;@JsonKey(name: 'totalAmount')@NumToStringConverter() String get totalAmount;@JsonKey(name: 'walletBalance')@NumToStringConverter() String get walletBalance;@JsonKey(name: 'totalPropertyAmount')@NumToStringConverter() String get totalPropertyAmount;@JsonKey(name: 'totalAssets')@NumToStringConverter() String get totalAssets;@JsonKey(name: 'transactions') List<dynamic> get transactions;
/// Create a copy of AssetsResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$AssetsResponseCopyWith<AssetsResponse> get copyWith => _$AssetsResponseCopyWithImpl<AssetsResponse>(this as AssetsResponse, _$identity);

  /// Serializes this AssetsResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is AssetsResponse&&const DeepCollectionEquality().equals(other.referralsMade, referralsMade)&&(identical(other.hasMoreReferrals, hasMoreReferrals) || other.hasMoreReferrals == hasMoreReferrals)&&(identical(other.totalAmount, totalAmount) || other.totalAmount == totalAmount)&&(identical(other.walletBalance, walletBalance) || other.walletBalance == walletBalance)&&(identical(other.totalPropertyAmount, totalPropertyAmount) || other.totalPropertyAmount == totalPropertyAmount)&&(identical(other.totalAssets, totalAssets) || other.totalAssets == totalAssets)&&const DeepCollectionEquality().equals(other.transactions, transactions));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(referralsMade),hasMoreReferrals,totalAmount,walletBalance,totalPropertyAmount,totalAssets,const DeepCollectionEquality().hash(transactions));

@override
String toString() {
  return 'AssetsResponse(referralsMade: $referralsMade, hasMoreReferrals: $hasMoreReferrals, totalAmount: $totalAmount, walletBalance: $walletBalance, totalPropertyAmount: $totalPropertyAmount, totalAssets: $totalAssets, transactions: $transactions)';
}


}

/// @nodoc
abstract mixin class $AssetsResponseCopyWith<$Res>  {
  factory $AssetsResponseCopyWith(AssetsResponse value, $Res Function(AssetsResponse) _then) = _$AssetsResponseCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'referralsMade') List<dynamic> referralsMade,@JsonKey(name: 'hasMoreReferrals') bool hasMoreReferrals,@JsonKey(name: 'totalAmount')@NumToStringConverter() String totalAmount,@JsonKey(name: 'walletBalance')@NumToStringConverter() String walletBalance,@JsonKey(name: 'totalPropertyAmount')@NumToStringConverter() String totalPropertyAmount,@JsonKey(name: 'totalAssets')@NumToStringConverter() String totalAssets,@JsonKey(name: 'transactions') List<dynamic> transactions
});




}
/// @nodoc
class _$AssetsResponseCopyWithImpl<$Res>
    implements $AssetsResponseCopyWith<$Res> {
  _$AssetsResponseCopyWithImpl(this._self, this._then);

  final AssetsResponse _self;
  final $Res Function(AssetsResponse) _then;

/// Create a copy of AssetsResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? referralsMade = null,Object? hasMoreReferrals = null,Object? totalAmount = null,Object? walletBalance = null,Object? totalPropertyAmount = null,Object? totalAssets = null,Object? transactions = null,}) {
  return _then(_self.copyWith(
referralsMade: null == referralsMade ? _self.referralsMade : referralsMade // ignore: cast_nullable_to_non_nullable
as List<dynamic>,hasMoreReferrals: null == hasMoreReferrals ? _self.hasMoreReferrals : hasMoreReferrals // ignore: cast_nullable_to_non_nullable
as bool,totalAmount: null == totalAmount ? _self.totalAmount : totalAmount // ignore: cast_nullable_to_non_nullable
as String,walletBalance: null == walletBalance ? _self.walletBalance : walletBalance // ignore: cast_nullable_to_non_nullable
as String,totalPropertyAmount: null == totalPropertyAmount ? _self.totalPropertyAmount : totalPropertyAmount // ignore: cast_nullable_to_non_nullable
as String,totalAssets: null == totalAssets ? _self.totalAssets : totalAssets // ignore: cast_nullable_to_non_nullable
as String,transactions: null == transactions ? _self.transactions : transactions // ignore: cast_nullable_to_non_nullable
as List<dynamic>,
  ));
}

}


/// Adds pattern-matching-related methods to [AssetsResponse].
extension AssetsResponsePatterns on AssetsResponse {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _AssetsResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _AssetsResponse() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _AssetsResponse value)  $default,){
final _that = this;
switch (_that) {
case _AssetsResponse():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _AssetsResponse value)?  $default,){
final _that = this;
switch (_that) {
case _AssetsResponse() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'referralsMade')  List<dynamic> referralsMade, @JsonKey(name: 'hasMoreReferrals')  bool hasMoreReferrals, @JsonKey(name: 'totalAmount')@NumToStringConverter()  String totalAmount, @JsonKey(name: 'walletBalance')@NumToStringConverter()  String walletBalance, @JsonKey(name: 'totalPropertyAmount')@NumToStringConverter()  String totalPropertyAmount, @JsonKey(name: 'totalAssets')@NumToStringConverter()  String totalAssets, @JsonKey(name: 'transactions')  List<dynamic> transactions)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _AssetsResponse() when $default != null:
return $default(_that.referralsMade,_that.hasMoreReferrals,_that.totalAmount,_that.walletBalance,_that.totalPropertyAmount,_that.totalAssets,_that.transactions);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'referralsMade')  List<dynamic> referralsMade, @JsonKey(name: 'hasMoreReferrals')  bool hasMoreReferrals, @JsonKey(name: 'totalAmount')@NumToStringConverter()  String totalAmount, @JsonKey(name: 'walletBalance')@NumToStringConverter()  String walletBalance, @JsonKey(name: 'totalPropertyAmount')@NumToStringConverter()  String totalPropertyAmount, @JsonKey(name: 'totalAssets')@NumToStringConverter()  String totalAssets, @JsonKey(name: 'transactions')  List<dynamic> transactions)  $default,) {final _that = this;
switch (_that) {
case _AssetsResponse():
return $default(_that.referralsMade,_that.hasMoreReferrals,_that.totalAmount,_that.walletBalance,_that.totalPropertyAmount,_that.totalAssets,_that.transactions);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'referralsMade')  List<dynamic> referralsMade, @JsonKey(name: 'hasMoreReferrals')  bool hasMoreReferrals, @JsonKey(name: 'totalAmount')@NumToStringConverter()  String totalAmount, @JsonKey(name: 'walletBalance')@NumToStringConverter()  String walletBalance, @JsonKey(name: 'totalPropertyAmount')@NumToStringConverter()  String totalPropertyAmount, @JsonKey(name: 'totalAssets')@NumToStringConverter()  String totalAssets, @JsonKey(name: 'transactions')  List<dynamic> transactions)?  $default,) {final _that = this;
switch (_that) {
case _AssetsResponse() when $default != null:
return $default(_that.referralsMade,_that.hasMoreReferrals,_that.totalAmount,_that.walletBalance,_that.totalPropertyAmount,_that.totalAssets,_that.transactions);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _AssetsResponse implements AssetsResponse {
  const _AssetsResponse({@JsonKey(name: 'referralsMade') required final  List<dynamic> referralsMade, @JsonKey(name: 'hasMoreReferrals') required this.hasMoreReferrals, @JsonKey(name: 'totalAmount')@NumToStringConverter() required this.totalAmount, @JsonKey(name: 'walletBalance')@NumToStringConverter() required this.walletBalance, @JsonKey(name: 'totalPropertyAmount')@NumToStringConverter() required this.totalPropertyAmount, @JsonKey(name: 'totalAssets')@NumToStringConverter() required this.totalAssets, @JsonKey(name: 'transactions') required final  List<dynamic> transactions}): _referralsMade = referralsMade,_transactions = transactions;
  factory _AssetsResponse.fromJson(Map<String, dynamic> json) => _$AssetsResponseFromJson(json);

 final  List<dynamic> _referralsMade;
@override@JsonKey(name: 'referralsMade') List<dynamic> get referralsMade {
  if (_referralsMade is EqualUnmodifiableListView) return _referralsMade;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_referralsMade);
}

@override@JsonKey(name: 'hasMoreReferrals') final  bool hasMoreReferrals;
@override@JsonKey(name: 'totalAmount')@NumToStringConverter() final  String totalAmount;
@override@JsonKey(name: 'walletBalance')@NumToStringConverter() final  String walletBalance;
@override@JsonKey(name: 'totalPropertyAmount')@NumToStringConverter() final  String totalPropertyAmount;
@override@JsonKey(name: 'totalAssets')@NumToStringConverter() final  String totalAssets;
 final  List<dynamic> _transactions;
@override@JsonKey(name: 'transactions') List<dynamic> get transactions {
  if (_transactions is EqualUnmodifiableListView) return _transactions;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_transactions);
}


/// Create a copy of AssetsResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$AssetsResponseCopyWith<_AssetsResponse> get copyWith => __$AssetsResponseCopyWithImpl<_AssetsResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$AssetsResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _AssetsResponse&&const DeepCollectionEquality().equals(other._referralsMade, _referralsMade)&&(identical(other.hasMoreReferrals, hasMoreReferrals) || other.hasMoreReferrals == hasMoreReferrals)&&(identical(other.totalAmount, totalAmount) || other.totalAmount == totalAmount)&&(identical(other.walletBalance, walletBalance) || other.walletBalance == walletBalance)&&(identical(other.totalPropertyAmount, totalPropertyAmount) || other.totalPropertyAmount == totalPropertyAmount)&&(identical(other.totalAssets, totalAssets) || other.totalAssets == totalAssets)&&const DeepCollectionEquality().equals(other._transactions, _transactions));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,const DeepCollectionEquality().hash(_referralsMade),hasMoreReferrals,totalAmount,walletBalance,totalPropertyAmount,totalAssets,const DeepCollectionEquality().hash(_transactions));

@override
String toString() {
  return 'AssetsResponse(referralsMade: $referralsMade, hasMoreReferrals: $hasMoreReferrals, totalAmount: $totalAmount, walletBalance: $walletBalance, totalPropertyAmount: $totalPropertyAmount, totalAssets: $totalAssets, transactions: $transactions)';
}


}

/// @nodoc
abstract mixin class _$AssetsResponseCopyWith<$Res> implements $AssetsResponseCopyWith<$Res> {
  factory _$AssetsResponseCopyWith(_AssetsResponse value, $Res Function(_AssetsResponse) _then) = __$AssetsResponseCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'referralsMade') List<dynamic> referralsMade,@JsonKey(name: 'hasMoreReferrals') bool hasMoreReferrals,@JsonKey(name: 'totalAmount')@NumToStringConverter() String totalAmount,@JsonKey(name: 'walletBalance')@NumToStringConverter() String walletBalance,@JsonKey(name: 'totalPropertyAmount')@NumToStringConverter() String totalPropertyAmount,@JsonKey(name: 'totalAssets')@NumToStringConverter() String totalAssets,@JsonKey(name: 'transactions') List<dynamic> transactions
});




}
/// @nodoc
class __$AssetsResponseCopyWithImpl<$Res>
    implements _$AssetsResponseCopyWith<$Res> {
  __$AssetsResponseCopyWithImpl(this._self, this._then);

  final _AssetsResponse _self;
  final $Res Function(_AssetsResponse) _then;

/// Create a copy of AssetsResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? referralsMade = null,Object? hasMoreReferrals = null,Object? totalAmount = null,Object? walletBalance = null,Object? totalPropertyAmount = null,Object? totalAssets = null,Object? transactions = null,}) {
  return _then(_AssetsResponse(
referralsMade: null == referralsMade ? _self._referralsMade : referralsMade // ignore: cast_nullable_to_non_nullable
as List<dynamic>,hasMoreReferrals: null == hasMoreReferrals ? _self.hasMoreReferrals : hasMoreReferrals // ignore: cast_nullable_to_non_nullable
as bool,totalAmount: null == totalAmount ? _self.totalAmount : totalAmount // ignore: cast_nullable_to_non_nullable
as String,walletBalance: null == walletBalance ? _self.walletBalance : walletBalance // ignore: cast_nullable_to_non_nullable
as String,totalPropertyAmount: null == totalPropertyAmount ? _self.totalPropertyAmount : totalPropertyAmount // ignore: cast_nullable_to_non_nullable
as String,totalAssets: null == totalAssets ? _self.totalAssets : totalAssets // ignore: cast_nullable_to_non_nullable
as String,transactions: null == transactions ? _self._transactions : transactions // ignore: cast_nullable_to_non_nullable
as List<dynamic>,
  ));
}


}

// dart format on
