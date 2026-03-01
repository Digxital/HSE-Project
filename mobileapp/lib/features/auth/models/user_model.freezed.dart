// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$UserModel {

@StringConverter() String get id;// 👈 This converts int to String
@JsonKey(defaultValue: '') String get email;@JsonKey(name: 'first_name', defaultValue: '') String get firstName;@JsonKey(name: 'last_name', defaultValue: '') String get lastName;@JsonKey(name: 'profile_image', defaultValue: '') String get profileImage;@JsonKey(name: 'phone') String? get phone;@JsonKey(name: 'email_verified_at') DateTime? get emailVerifiedAt;@JsonKey(name: 'is_admin') bool? get isAdmin;@JsonKey(name: 'recipient_id') String? get recipientId;@JsonKey(name: 'is_active') bool? get isActive;@JsonKey(name: 'referral_code') String? get referralCode;@JsonKey(name: 'hide_balance') bool? get hideBalance;@JsonKey(name: 'auth_method') String? get authMethod;@JsonKey(name: 'created_at') DateTime? get createdAt;@JsonKey(name: 'updated_at') DateTime? get updatedAt;
/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserModelCopyWith<UserModel> get copyWith => _$UserModelCopyWithImpl<UserModel>(this as UserModel, _$identity);

  /// Serializes this UserModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserModel&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email)&&(identical(other.firstName, firstName) || other.firstName == firstName)&&(identical(other.lastName, lastName) || other.lastName == lastName)&&(identical(other.profileImage, profileImage) || other.profileImage == profileImage)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.emailVerifiedAt, emailVerifiedAt) || other.emailVerifiedAt == emailVerifiedAt)&&(identical(other.isAdmin, isAdmin) || other.isAdmin == isAdmin)&&(identical(other.recipientId, recipientId) || other.recipientId == recipientId)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.referralCode, referralCode) || other.referralCode == referralCode)&&(identical(other.hideBalance, hideBalance) || other.hideBalance == hideBalance)&&(identical(other.authMethod, authMethod) || other.authMethod == authMethod)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,email,firstName,lastName,profileImage,phone,emailVerifiedAt,isAdmin,recipientId,isActive,referralCode,hideBalance,authMethod,createdAt,updatedAt);

@override
String toString() {
  return 'UserModel(id: $id, email: $email, firstName: $firstName, lastName: $lastName, profileImage: $profileImage, phone: $phone, emailVerifiedAt: $emailVerifiedAt, isAdmin: $isAdmin, recipientId: $recipientId, isActive: $isActive, referralCode: $referralCode, hideBalance: $hideBalance, authMethod: $authMethod, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $UserModelCopyWith<$Res>  {
  factory $UserModelCopyWith(UserModel value, $Res Function(UserModel) _then) = _$UserModelCopyWithImpl;
@useResult
$Res call({
@StringConverter() String id,@JsonKey(defaultValue: '') String email,@JsonKey(name: 'first_name', defaultValue: '') String firstName,@JsonKey(name: 'last_name', defaultValue: '') String lastName,@JsonKey(name: 'profile_image', defaultValue: '') String profileImage,@JsonKey(name: 'phone') String? phone,@JsonKey(name: 'email_verified_at') DateTime? emailVerifiedAt,@JsonKey(name: 'is_admin') bool? isAdmin,@JsonKey(name: 'recipient_id') String? recipientId,@JsonKey(name: 'is_active') bool? isActive,@JsonKey(name: 'referral_code') String? referralCode,@JsonKey(name: 'hide_balance') bool? hideBalance,@JsonKey(name: 'auth_method') String? authMethod,@JsonKey(name: 'created_at') DateTime? createdAt,@JsonKey(name: 'updated_at') DateTime? updatedAt
});




}
/// @nodoc
class _$UserModelCopyWithImpl<$Res>
    implements $UserModelCopyWith<$Res> {
  _$UserModelCopyWithImpl(this._self, this._then);

  final UserModel _self;
  final $Res Function(UserModel) _then;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? email = null,Object? firstName = null,Object? lastName = null,Object? profileImage = null,Object? phone = freezed,Object? emailVerifiedAt = freezed,Object? isAdmin = freezed,Object? recipientId = freezed,Object? isActive = freezed,Object? referralCode = freezed,Object? hideBalance = freezed,Object? authMethod = freezed,Object? createdAt = freezed,Object? updatedAt = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,firstName: null == firstName ? _self.firstName : firstName // ignore: cast_nullable_to_non_nullable
as String,lastName: null == lastName ? _self.lastName : lastName // ignore: cast_nullable_to_non_nullable
as String,profileImage: null == profileImage ? _self.profileImage : profileImage // ignore: cast_nullable_to_non_nullable
as String,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,emailVerifiedAt: freezed == emailVerifiedAt ? _self.emailVerifiedAt : emailVerifiedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,isAdmin: freezed == isAdmin ? _self.isAdmin : isAdmin // ignore: cast_nullable_to_non_nullable
as bool?,recipientId: freezed == recipientId ? _self.recipientId : recipientId // ignore: cast_nullable_to_non_nullable
as String?,isActive: freezed == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool?,referralCode: freezed == referralCode ? _self.referralCode : referralCode // ignore: cast_nullable_to_non_nullable
as String?,hideBalance: freezed == hideBalance ? _self.hideBalance : hideBalance // ignore: cast_nullable_to_non_nullable
as bool?,authMethod: freezed == authMethod ? _self.authMethod : authMethod // ignore: cast_nullable_to_non_nullable
as String?,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

}


/// Adds pattern-matching-related methods to [UserModel].
extension UserModelPatterns on UserModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserModel value)  $default,){
final _that = this;
switch (_that) {
case _UserModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserModel value)?  $default,){
final _that = this;
switch (_that) {
case _UserModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@StringConverter()  String id, @JsonKey(defaultValue: '')  String email, @JsonKey(name: 'first_name', defaultValue: '')  String firstName, @JsonKey(name: 'last_name', defaultValue: '')  String lastName, @JsonKey(name: 'profile_image', defaultValue: '')  String profileImage, @JsonKey(name: 'phone')  String? phone, @JsonKey(name: 'email_verified_at')  DateTime? emailVerifiedAt, @JsonKey(name: 'is_admin')  bool? isAdmin, @JsonKey(name: 'recipient_id')  String? recipientId, @JsonKey(name: 'is_active')  bool? isActive, @JsonKey(name: 'referral_code')  String? referralCode, @JsonKey(name: 'hide_balance')  bool? hideBalance, @JsonKey(name: 'auth_method')  String? authMethod, @JsonKey(name: 'created_at')  DateTime? createdAt, @JsonKey(name: 'updated_at')  DateTime? updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserModel() when $default != null:
return $default(_that.id,_that.email,_that.firstName,_that.lastName,_that.profileImage,_that.phone,_that.emailVerifiedAt,_that.isAdmin,_that.recipientId,_that.isActive,_that.referralCode,_that.hideBalance,_that.authMethod,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@StringConverter()  String id, @JsonKey(defaultValue: '')  String email, @JsonKey(name: 'first_name', defaultValue: '')  String firstName, @JsonKey(name: 'last_name', defaultValue: '')  String lastName, @JsonKey(name: 'profile_image', defaultValue: '')  String profileImage, @JsonKey(name: 'phone')  String? phone, @JsonKey(name: 'email_verified_at')  DateTime? emailVerifiedAt, @JsonKey(name: 'is_admin')  bool? isAdmin, @JsonKey(name: 'recipient_id')  String? recipientId, @JsonKey(name: 'is_active')  bool? isActive, @JsonKey(name: 'referral_code')  String? referralCode, @JsonKey(name: 'hide_balance')  bool? hideBalance, @JsonKey(name: 'auth_method')  String? authMethod, @JsonKey(name: 'created_at')  DateTime? createdAt, @JsonKey(name: 'updated_at')  DateTime? updatedAt)  $default,) {final _that = this;
switch (_that) {
case _UserModel():
return $default(_that.id,_that.email,_that.firstName,_that.lastName,_that.profileImage,_that.phone,_that.emailVerifiedAt,_that.isAdmin,_that.recipientId,_that.isActive,_that.referralCode,_that.hideBalance,_that.authMethod,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@StringConverter()  String id, @JsonKey(defaultValue: '')  String email, @JsonKey(name: 'first_name', defaultValue: '')  String firstName, @JsonKey(name: 'last_name', defaultValue: '')  String lastName, @JsonKey(name: 'profile_image', defaultValue: '')  String profileImage, @JsonKey(name: 'phone')  String? phone, @JsonKey(name: 'email_verified_at')  DateTime? emailVerifiedAt, @JsonKey(name: 'is_admin')  bool? isAdmin, @JsonKey(name: 'recipient_id')  String? recipientId, @JsonKey(name: 'is_active')  bool? isActive, @JsonKey(name: 'referral_code')  String? referralCode, @JsonKey(name: 'hide_balance')  bool? hideBalance, @JsonKey(name: 'auth_method')  String? authMethod, @JsonKey(name: 'created_at')  DateTime? createdAt, @JsonKey(name: 'updated_at')  DateTime? updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _UserModel() when $default != null:
return $default(_that.id,_that.email,_that.firstName,_that.lastName,_that.profileImage,_that.phone,_that.emailVerifiedAt,_that.isAdmin,_that.recipientId,_that.isActive,_that.referralCode,_that.hideBalance,_that.authMethod,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserModel implements UserModel {
  const _UserModel({@StringConverter() required this.id, @JsonKey(defaultValue: '') required this.email, @JsonKey(name: 'first_name', defaultValue: '') required this.firstName, @JsonKey(name: 'last_name', defaultValue: '') required this.lastName, @JsonKey(name: 'profile_image', defaultValue: '') required this.profileImage, @JsonKey(name: 'phone') this.phone, @JsonKey(name: 'email_verified_at') this.emailVerifiedAt, @JsonKey(name: 'is_admin') this.isAdmin, @JsonKey(name: 'recipient_id') this.recipientId, @JsonKey(name: 'is_active') this.isActive, @JsonKey(name: 'referral_code') this.referralCode, @JsonKey(name: 'hide_balance') this.hideBalance, @JsonKey(name: 'auth_method') this.authMethod, @JsonKey(name: 'created_at') this.createdAt, @JsonKey(name: 'updated_at') this.updatedAt});
  factory _UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);

@override@StringConverter() final  String id;
// 👈 This converts int to String
@override@JsonKey(defaultValue: '') final  String email;
@override@JsonKey(name: 'first_name', defaultValue: '') final  String firstName;
@override@JsonKey(name: 'last_name', defaultValue: '') final  String lastName;
@override@JsonKey(name: 'profile_image', defaultValue: '') final  String profileImage;
@override@JsonKey(name: 'phone') final  String? phone;
@override@JsonKey(name: 'email_verified_at') final  DateTime? emailVerifiedAt;
@override@JsonKey(name: 'is_admin') final  bool? isAdmin;
@override@JsonKey(name: 'recipient_id') final  String? recipientId;
@override@JsonKey(name: 'is_active') final  bool? isActive;
@override@JsonKey(name: 'referral_code') final  String? referralCode;
@override@JsonKey(name: 'hide_balance') final  bool? hideBalance;
@override@JsonKey(name: 'auth_method') final  String? authMethod;
@override@JsonKey(name: 'created_at') final  DateTime? createdAt;
@override@JsonKey(name: 'updated_at') final  DateTime? updatedAt;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserModelCopyWith<_UserModel> get copyWith => __$UserModelCopyWithImpl<_UserModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserModel&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email)&&(identical(other.firstName, firstName) || other.firstName == firstName)&&(identical(other.lastName, lastName) || other.lastName == lastName)&&(identical(other.profileImage, profileImage) || other.profileImage == profileImage)&&(identical(other.phone, phone) || other.phone == phone)&&(identical(other.emailVerifiedAt, emailVerifiedAt) || other.emailVerifiedAt == emailVerifiedAt)&&(identical(other.isAdmin, isAdmin) || other.isAdmin == isAdmin)&&(identical(other.recipientId, recipientId) || other.recipientId == recipientId)&&(identical(other.isActive, isActive) || other.isActive == isActive)&&(identical(other.referralCode, referralCode) || other.referralCode == referralCode)&&(identical(other.hideBalance, hideBalance) || other.hideBalance == hideBalance)&&(identical(other.authMethod, authMethod) || other.authMethod == authMethod)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,email,firstName,lastName,profileImage,phone,emailVerifiedAt,isAdmin,recipientId,isActive,referralCode,hideBalance,authMethod,createdAt,updatedAt);

@override
String toString() {
  return 'UserModel(id: $id, email: $email, firstName: $firstName, lastName: $lastName, profileImage: $profileImage, phone: $phone, emailVerifiedAt: $emailVerifiedAt, isAdmin: $isAdmin, recipientId: $recipientId, isActive: $isActive, referralCode: $referralCode, hideBalance: $hideBalance, authMethod: $authMethod, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$UserModelCopyWith<$Res> implements $UserModelCopyWith<$Res> {
  factory _$UserModelCopyWith(_UserModel value, $Res Function(_UserModel) _then) = __$UserModelCopyWithImpl;
@override @useResult
$Res call({
@StringConverter() String id,@JsonKey(defaultValue: '') String email,@JsonKey(name: 'first_name', defaultValue: '') String firstName,@JsonKey(name: 'last_name', defaultValue: '') String lastName,@JsonKey(name: 'profile_image', defaultValue: '') String profileImage,@JsonKey(name: 'phone') String? phone,@JsonKey(name: 'email_verified_at') DateTime? emailVerifiedAt,@JsonKey(name: 'is_admin') bool? isAdmin,@JsonKey(name: 'recipient_id') String? recipientId,@JsonKey(name: 'is_active') bool? isActive,@JsonKey(name: 'referral_code') String? referralCode,@JsonKey(name: 'hide_balance') bool? hideBalance,@JsonKey(name: 'auth_method') String? authMethod,@JsonKey(name: 'created_at') DateTime? createdAt,@JsonKey(name: 'updated_at') DateTime? updatedAt
});




}
/// @nodoc
class __$UserModelCopyWithImpl<$Res>
    implements _$UserModelCopyWith<$Res> {
  __$UserModelCopyWithImpl(this._self, this._then);

  final _UserModel _self;
  final $Res Function(_UserModel) _then;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? email = null,Object? firstName = null,Object? lastName = null,Object? profileImage = null,Object? phone = freezed,Object? emailVerifiedAt = freezed,Object? isAdmin = freezed,Object? recipientId = freezed,Object? isActive = freezed,Object? referralCode = freezed,Object? hideBalance = freezed,Object? authMethod = freezed,Object? createdAt = freezed,Object? updatedAt = freezed,}) {
  return _then(_UserModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,firstName: null == firstName ? _self.firstName : firstName // ignore: cast_nullable_to_non_nullable
as String,lastName: null == lastName ? _self.lastName : lastName // ignore: cast_nullable_to_non_nullable
as String,profileImage: null == profileImage ? _self.profileImage : profileImage // ignore: cast_nullable_to_non_nullable
as String,phone: freezed == phone ? _self.phone : phone // ignore: cast_nullable_to_non_nullable
as String?,emailVerifiedAt: freezed == emailVerifiedAt ? _self.emailVerifiedAt : emailVerifiedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,isAdmin: freezed == isAdmin ? _self.isAdmin : isAdmin // ignore: cast_nullable_to_non_nullable
as bool?,recipientId: freezed == recipientId ? _self.recipientId : recipientId // ignore: cast_nullable_to_non_nullable
as String?,isActive: freezed == isActive ? _self.isActive : isActive // ignore: cast_nullable_to_non_nullable
as bool?,referralCode: freezed == referralCode ? _self.referralCode : referralCode // ignore: cast_nullable_to_non_nullable
as String?,hideBalance: freezed == hideBalance ? _self.hideBalance : hideBalance // ignore: cast_nullable_to_non_nullable
as bool?,authMethod: freezed == authMethod ? _self.authMethod : authMethod // ignore: cast_nullable_to_non_nullable
as String?,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,updatedAt: freezed == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}


}

// dart format on
