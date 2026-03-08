// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'login_form_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$LoginFormModel {

 String get email; String get password; bool get rememberMe; bool get isLoading; String? get errorMessage;
/// Create a copy of LoginFormModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LoginFormModelCopyWith<LoginFormModel> get copyWith => _$LoginFormModelCopyWithImpl<LoginFormModel>(this as LoginFormModel, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LoginFormModel&&(identical(other.email, email) || other.email == email)&&(identical(other.password, password) || other.password == password)&&(identical(other.rememberMe, rememberMe) || other.rememberMe == rememberMe)&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage));
}


@override
int get hashCode => Object.hash(runtimeType,email,password,rememberMe,isLoading,errorMessage);

@override
String toString() {
  return 'LoginFormModel(email: $email, password: $password, rememberMe: $rememberMe, isLoading: $isLoading, errorMessage: $errorMessage)';
}


}

/// @nodoc
abstract mixin class $LoginFormModelCopyWith<$Res>  {
  factory $LoginFormModelCopyWith(LoginFormModel value, $Res Function(LoginFormModel) _then) = _$LoginFormModelCopyWithImpl;
@useResult
$Res call({
 String email, String password, bool rememberMe, bool isLoading, String? errorMessage
});




}
/// @nodoc
class _$LoginFormModelCopyWithImpl<$Res>
    implements $LoginFormModelCopyWith<$Res> {
  _$LoginFormModelCopyWithImpl(this._self, this._then);

  final LoginFormModel _self;
  final $Res Function(LoginFormModel) _then;

/// Create a copy of LoginFormModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? email = null,Object? password = null,Object? rememberMe = null,Object? isLoading = null,Object? errorMessage = freezed,}) {
  return _then(_self.copyWith(
email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,rememberMe: null == rememberMe ? _self.rememberMe : rememberMe // ignore: cast_nullable_to_non_nullable
as bool,isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [LoginFormModel].
extension LoginFormModelPatterns on LoginFormModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LoginFormModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LoginFormModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LoginFormModel value)  $default,){
final _that = this;
switch (_that) {
case _LoginFormModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LoginFormModel value)?  $default,){
final _that = this;
switch (_that) {
case _LoginFormModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String email,  String password,  bool rememberMe,  bool isLoading,  String? errorMessage)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LoginFormModel() when $default != null:
return $default(_that.email,_that.password,_that.rememberMe,_that.isLoading,_that.errorMessage);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String email,  String password,  bool rememberMe,  bool isLoading,  String? errorMessage)  $default,) {final _that = this;
switch (_that) {
case _LoginFormModel():
return $default(_that.email,_that.password,_that.rememberMe,_that.isLoading,_that.errorMessage);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String email,  String password,  bool rememberMe,  bool isLoading,  String? errorMessage)?  $default,) {final _that = this;
switch (_that) {
case _LoginFormModel() when $default != null:
return $default(_that.email,_that.password,_that.rememberMe,_that.isLoading,_that.errorMessage);case _:
  return null;

}
}

}

/// @nodoc


class _LoginFormModel implements LoginFormModel {
  const _LoginFormModel({this.email = '', this.password = '', this.rememberMe = false, this.isLoading = false, this.errorMessage});
  

@override@JsonKey() final  String email;
@override@JsonKey() final  String password;
@override@JsonKey() final  bool rememberMe;
@override@JsonKey() final  bool isLoading;
@override final  String? errorMessage;

/// Create a copy of LoginFormModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LoginFormModelCopyWith<_LoginFormModel> get copyWith => __$LoginFormModelCopyWithImpl<_LoginFormModel>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LoginFormModel&&(identical(other.email, email) || other.email == email)&&(identical(other.password, password) || other.password == password)&&(identical(other.rememberMe, rememberMe) || other.rememberMe == rememberMe)&&(identical(other.isLoading, isLoading) || other.isLoading == isLoading)&&(identical(other.errorMessage, errorMessage) || other.errorMessage == errorMessage));
}


@override
int get hashCode => Object.hash(runtimeType,email,password,rememberMe,isLoading,errorMessage);

@override
String toString() {
  return 'LoginFormModel(email: $email, password: $password, rememberMe: $rememberMe, isLoading: $isLoading, errorMessage: $errorMessage)';
}


}

/// @nodoc
abstract mixin class _$LoginFormModelCopyWith<$Res> implements $LoginFormModelCopyWith<$Res> {
  factory _$LoginFormModelCopyWith(_LoginFormModel value, $Res Function(_LoginFormModel) _then) = __$LoginFormModelCopyWithImpl;
@override @useResult
$Res call({
 String email, String password, bool rememberMe, bool isLoading, String? errorMessage
});




}
/// @nodoc
class __$LoginFormModelCopyWithImpl<$Res>
    implements _$LoginFormModelCopyWith<$Res> {
  __$LoginFormModelCopyWithImpl(this._self, this._then);

  final _LoginFormModel _self;
  final $Res Function(_LoginFormModel) _then;

/// Create a copy of LoginFormModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? email = null,Object? password = null,Object? rememberMe = null,Object? isLoading = null,Object? errorMessage = freezed,}) {
  return _then(_LoginFormModel(
email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,password: null == password ? _self.password : password // ignore: cast_nullable_to_non_nullable
as String,rememberMe: null == rememberMe ? _self.rememberMe : rememberMe // ignore: cast_nullable_to_non_nullable
as bool,isLoading: null == isLoading ? _self.isLoading : isLoading // ignore: cast_nullable_to_non_nullable
as bool,errorMessage: freezed == errorMessage ? _self.errorMessage : errorMessage // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
