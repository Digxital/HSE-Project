// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'action_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$ClientId {

@JsonKey(name: '_id') String get id; String get name;
/// Create a copy of ClientId
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ClientIdCopyWith<ClientId> get copyWith => _$ClientIdCopyWithImpl<ClientId>(this as ClientId, _$identity);

  /// Serializes this ClientId to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ClientId&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name);

@override
String toString() {
  return 'ClientId(id: $id, name: $name)';
}


}

/// @nodoc
abstract mixin class $ClientIdCopyWith<$Res>  {
  factory $ClientIdCopyWith(ClientId value, $Res Function(ClientId) _then) = _$ClientIdCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: '_id') String id, String name
});




}
/// @nodoc
class _$ClientIdCopyWithImpl<$Res>
    implements $ClientIdCopyWith<$Res> {
  _$ClientIdCopyWithImpl(this._self, this._then);

  final ClientId _self;
  final $Res Function(ClientId) _then;

/// Create a copy of ClientId
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ClientId].
extension ClientIdPatterns on ClientId {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ClientId value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ClientId() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ClientId value)  $default,){
final _that = this;
switch (_that) {
case _ClientId():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ClientId value)?  $default,){
final _that = this;
switch (_that) {
case _ClientId() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  String name)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ClientId() when $default != null:
return $default(_that.id,_that.name);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  String name)  $default,) {final _that = this;
switch (_that) {
case _ClientId():
return $default(_that.id,_that.name);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: '_id')  String id,  String name)?  $default,) {final _that = this;
switch (_that) {
case _ClientId() when $default != null:
return $default(_that.id,_that.name);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ClientId implements ClientId {
  const _ClientId({@JsonKey(name: '_id') required this.id, required this.name});
  factory _ClientId.fromJson(Map<String, dynamic> json) => _$ClientIdFromJson(json);

@override@JsonKey(name: '_id') final  String id;
@override final  String name;

/// Create a copy of ClientId
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ClientIdCopyWith<_ClientId> get copyWith => __$ClientIdCopyWithImpl<_ClientId>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ClientIdToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ClientId&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name);

@override
String toString() {
  return 'ClientId(id: $id, name: $name)';
}


}

/// @nodoc
abstract mixin class _$ClientIdCopyWith<$Res> implements $ClientIdCopyWith<$Res> {
  factory _$ClientIdCopyWith(_ClientId value, $Res Function(_ClientId) _then) = __$ClientIdCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: '_id') String id, String name
});




}
/// @nodoc
class __$ClientIdCopyWithImpl<$Res>
    implements _$ClientIdCopyWith<$Res> {
  __$ClientIdCopyWithImpl(this._self, this._then);

  final _ClientId _self;
  final $Res Function(_ClientId) _then;

/// Create a copy of ClientId
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,}) {
  return _then(_ClientId(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$SiteId {

@JsonKey(name: '_id') String get id; String get name;
/// Create a copy of SiteId
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SiteIdCopyWith<SiteId> get copyWith => _$SiteIdCopyWithImpl<SiteId>(this as SiteId, _$identity);

  /// Serializes this SiteId to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SiteId&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name);

@override
String toString() {
  return 'SiteId(id: $id, name: $name)';
}


}

/// @nodoc
abstract mixin class $SiteIdCopyWith<$Res>  {
  factory $SiteIdCopyWith(SiteId value, $Res Function(SiteId) _then) = _$SiteIdCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: '_id') String id, String name
});




}
/// @nodoc
class _$SiteIdCopyWithImpl<$Res>
    implements $SiteIdCopyWith<$Res> {
  _$SiteIdCopyWithImpl(this._self, this._then);

  final SiteId _self;
  final $Res Function(SiteId) _then;

/// Create a copy of SiteId
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [SiteId].
extension SiteIdPatterns on SiteId {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SiteId value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SiteId() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SiteId value)  $default,){
final _that = this;
switch (_that) {
case _SiteId():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SiteId value)?  $default,){
final _that = this;
switch (_that) {
case _SiteId() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  String name)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SiteId() when $default != null:
return $default(_that.id,_that.name);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  String name)  $default,) {final _that = this;
switch (_that) {
case _SiteId():
return $default(_that.id,_that.name);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: '_id')  String id,  String name)?  $default,) {final _that = this;
switch (_that) {
case _SiteId() when $default != null:
return $default(_that.id,_that.name);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SiteId implements SiteId {
  const _SiteId({@JsonKey(name: '_id') required this.id, required this.name});
  factory _SiteId.fromJson(Map<String, dynamic> json) => _$SiteIdFromJson(json);

@override@JsonKey(name: '_id') final  String id;
@override final  String name;

/// Create a copy of SiteId
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SiteIdCopyWith<_SiteId> get copyWith => __$SiteIdCopyWithImpl<_SiteId>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SiteIdToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SiteId&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,name);

@override
String toString() {
  return 'SiteId(id: $id, name: $name)';
}


}

/// @nodoc
abstract mixin class _$SiteIdCopyWith<$Res> implements $SiteIdCopyWith<$Res> {
  factory _$SiteIdCopyWith(_SiteId value, $Res Function(_SiteId) _then) = __$SiteIdCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: '_id') String id, String name
});




}
/// @nodoc
class __$SiteIdCopyWithImpl<$Res>
    implements _$SiteIdCopyWith<$Res> {
  __$SiteIdCopyWithImpl(this._self, this._then);

  final _SiteId _self;
  final $Res Function(_SiteId) _then;

/// Create a copy of SiteId
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,}) {
  return _then(_SiteId(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$ReportLocation {

 ClientId get clientId; SiteId get siteId; String get specificArea; double get latitude; double get longitude;
/// Create a copy of ReportLocation
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReportLocationCopyWith<ReportLocation> get copyWith => _$ReportLocationCopyWithImpl<ReportLocation>(this as ReportLocation, _$identity);

  /// Serializes this ReportLocation to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReportLocation&&(identical(other.clientId, clientId) || other.clientId == clientId)&&(identical(other.siteId, siteId) || other.siteId == siteId)&&(identical(other.specificArea, specificArea) || other.specificArea == specificArea)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,clientId,siteId,specificArea,latitude,longitude);

@override
String toString() {
  return 'ReportLocation(clientId: $clientId, siteId: $siteId, specificArea: $specificArea, latitude: $latitude, longitude: $longitude)';
}


}

/// @nodoc
abstract mixin class $ReportLocationCopyWith<$Res>  {
  factory $ReportLocationCopyWith(ReportLocation value, $Res Function(ReportLocation) _then) = _$ReportLocationCopyWithImpl;
@useResult
$Res call({
 ClientId clientId, SiteId siteId, String specificArea, double latitude, double longitude
});


$ClientIdCopyWith<$Res> get clientId;$SiteIdCopyWith<$Res> get siteId;

}
/// @nodoc
class _$ReportLocationCopyWithImpl<$Res>
    implements $ReportLocationCopyWith<$Res> {
  _$ReportLocationCopyWithImpl(this._self, this._then);

  final ReportLocation _self;
  final $Res Function(ReportLocation) _then;

/// Create a copy of ReportLocation
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? clientId = null,Object? siteId = null,Object? specificArea = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(_self.copyWith(
clientId: null == clientId ? _self.clientId : clientId // ignore: cast_nullable_to_non_nullable
as ClientId,siteId: null == siteId ? _self.siteId : siteId // ignore: cast_nullable_to_non_nullable
as SiteId,specificArea: null == specificArea ? _self.specificArea : specificArea // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,
  ));
}
/// Create a copy of ReportLocation
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ClientIdCopyWith<$Res> get clientId {
  
  return $ClientIdCopyWith<$Res>(_self.clientId, (value) {
    return _then(_self.copyWith(clientId: value));
  });
}/// Create a copy of ReportLocation
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SiteIdCopyWith<$Res> get siteId {
  
  return $SiteIdCopyWith<$Res>(_self.siteId, (value) {
    return _then(_self.copyWith(siteId: value));
  });
}
}


/// Adds pattern-matching-related methods to [ReportLocation].
extension ReportLocationPatterns on ReportLocation {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReportLocation value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReportLocation() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReportLocation value)  $default,){
final _that = this;
switch (_that) {
case _ReportLocation():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReportLocation value)?  $default,){
final _that = this;
switch (_that) {
case _ReportLocation() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( ClientId clientId,  SiteId siteId,  String specificArea,  double latitude,  double longitude)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReportLocation() when $default != null:
return $default(_that.clientId,_that.siteId,_that.specificArea,_that.latitude,_that.longitude);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( ClientId clientId,  SiteId siteId,  String specificArea,  double latitude,  double longitude)  $default,) {final _that = this;
switch (_that) {
case _ReportLocation():
return $default(_that.clientId,_that.siteId,_that.specificArea,_that.latitude,_that.longitude);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( ClientId clientId,  SiteId siteId,  String specificArea,  double latitude,  double longitude)?  $default,) {final _that = this;
switch (_that) {
case _ReportLocation() when $default != null:
return $default(_that.clientId,_that.siteId,_that.specificArea,_that.latitude,_that.longitude);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReportLocation implements ReportLocation {
  const _ReportLocation({required this.clientId, required this.siteId, required this.specificArea, this.latitude = 0.0, this.longitude = 0.0});
  factory _ReportLocation.fromJson(Map<String, dynamic> json) => _$ReportLocationFromJson(json);

@override final  ClientId clientId;
@override final  SiteId siteId;
@override final  String specificArea;
@override@JsonKey() final  double latitude;
@override@JsonKey() final  double longitude;

/// Create a copy of ReportLocation
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReportLocationCopyWith<_ReportLocation> get copyWith => __$ReportLocationCopyWithImpl<_ReportLocation>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReportLocationToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReportLocation&&(identical(other.clientId, clientId) || other.clientId == clientId)&&(identical(other.siteId, siteId) || other.siteId == siteId)&&(identical(other.specificArea, specificArea) || other.specificArea == specificArea)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,clientId,siteId,specificArea,latitude,longitude);

@override
String toString() {
  return 'ReportLocation(clientId: $clientId, siteId: $siteId, specificArea: $specificArea, latitude: $latitude, longitude: $longitude)';
}


}

/// @nodoc
abstract mixin class _$ReportLocationCopyWith<$Res> implements $ReportLocationCopyWith<$Res> {
  factory _$ReportLocationCopyWith(_ReportLocation value, $Res Function(_ReportLocation) _then) = __$ReportLocationCopyWithImpl;
@override @useResult
$Res call({
 ClientId clientId, SiteId siteId, String specificArea, double latitude, double longitude
});


@override $ClientIdCopyWith<$Res> get clientId;@override $SiteIdCopyWith<$Res> get siteId;

}
/// @nodoc
class __$ReportLocationCopyWithImpl<$Res>
    implements _$ReportLocationCopyWith<$Res> {
  __$ReportLocationCopyWithImpl(this._self, this._then);

  final _ReportLocation _self;
  final $Res Function(_ReportLocation) _then;

/// Create a copy of ReportLocation
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? clientId = null,Object? siteId = null,Object? specificArea = null,Object? latitude = null,Object? longitude = null,}) {
  return _then(_ReportLocation(
clientId: null == clientId ? _self.clientId : clientId // ignore: cast_nullable_to_non_nullable
as ClientId,siteId: null == siteId ? _self.siteId : siteId // ignore: cast_nullable_to_non_nullable
as SiteId,specificArea: null == specificArea ? _self.specificArea : specificArea // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,
  ));
}

/// Create a copy of ReportLocation
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ClientIdCopyWith<$Res> get clientId {
  
  return $ClientIdCopyWith<$Res>(_self.clientId, (value) {
    return _then(_self.copyWith(clientId: value));
  });
}/// Create a copy of ReportLocation
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$SiteIdCopyWith<$Res> get siteId {
  
  return $SiteIdCopyWith<$Res>(_self.siteId, (value) {
    return _then(_self.copyWith(siteId: value));
  });
}
}


/// @nodoc
mixin _$UserId {

@JsonKey(name: '_id') String get id; String get email;
/// Create a copy of UserId
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$UserIdCopyWith<UserId> get copyWith => _$UserIdCopyWithImpl<UserId>(this as UserId, _$identity);

  /// Serializes this UserId to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserId&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,email);

@override
String toString() {
  return 'UserId(id: $id, email: $email)';
}


}

/// @nodoc
abstract mixin class $UserIdCopyWith<$Res>  {
  factory $UserIdCopyWith(UserId value, $Res Function(UserId) _then) = _$UserIdCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: '_id') String id, String email
});




}
/// @nodoc
class _$UserIdCopyWithImpl<$Res>
    implements $UserIdCopyWith<$Res> {
  _$UserIdCopyWithImpl(this._self, this._then);

  final UserId _self;
  final $Res Function(UserId) _then;

/// Create a copy of UserId
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? email = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [UserId].
extension UserIdPatterns on UserId {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserId value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _UserId() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserId value)  $default,){
final _that = this;
switch (_that) {
case _UserId():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserId value)?  $default,){
final _that = this;
switch (_that) {
case _UserId() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  String email)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _UserId() when $default != null:
return $default(_that.id,_that.email);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  String email)  $default,) {final _that = this;
switch (_that) {
case _UserId():
return $default(_that.id,_that.email);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: '_id')  String id,  String email)?  $default,) {final _that = this;
switch (_that) {
case _UserId() when $default != null:
return $default(_that.id,_that.email);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _UserId implements UserId {
  const _UserId({@JsonKey(name: '_id') required this.id, required this.email});
  factory _UserId.fromJson(Map<String, dynamic> json) => _$UserIdFromJson(json);

@override@JsonKey(name: '_id') final  String id;
@override final  String email;

/// Create a copy of UserId
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$UserIdCopyWith<_UserId> get copyWith => __$UserIdCopyWithImpl<_UserId>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$UserIdToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserId&&(identical(other.id, id) || other.id == id)&&(identical(other.email, email) || other.email == email));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,email);

@override
String toString() {
  return 'UserId(id: $id, email: $email)';
}


}

/// @nodoc
abstract mixin class _$UserIdCopyWith<$Res> implements $UserIdCopyWith<$Res> {
  factory _$UserIdCopyWith(_UserId value, $Res Function(_UserId) _then) = __$UserIdCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: '_id') String id, String email
});




}
/// @nodoc
class __$UserIdCopyWithImpl<$Res>
    implements _$UserIdCopyWith<$Res> {
  __$UserIdCopyWithImpl(this._self, this._then);

  final _UserId _self;
  final $Res Function(_UserId) _then;

/// Create a copy of UserId
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? email = null,}) {
  return _then(_UserId(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,email: null == email ? _self.email : email // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$ReportedBy {

 UserId get userId; String get role;
/// Create a copy of ReportedBy
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReportedByCopyWith<ReportedBy> get copyWith => _$ReportedByCopyWithImpl<ReportedBy>(this as ReportedBy, _$identity);

  /// Serializes this ReportedBy to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReportedBy&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.role, role) || other.role == role));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,userId,role);

@override
String toString() {
  return 'ReportedBy(userId: $userId, role: $role)';
}


}

/// @nodoc
abstract mixin class $ReportedByCopyWith<$Res>  {
  factory $ReportedByCopyWith(ReportedBy value, $Res Function(ReportedBy) _then) = _$ReportedByCopyWithImpl;
@useResult
$Res call({
 UserId userId, String role
});


$UserIdCopyWith<$Res> get userId;

}
/// @nodoc
class _$ReportedByCopyWithImpl<$Res>
    implements $ReportedByCopyWith<$Res> {
  _$ReportedByCopyWithImpl(this._self, this._then);

  final ReportedBy _self;
  final $Res Function(ReportedBy) _then;

/// Create a copy of ReportedBy
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? userId = null,Object? role = null,}) {
  return _then(_self.copyWith(
userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as UserId,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as String,
  ));
}
/// Create a copy of ReportedBy
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserIdCopyWith<$Res> get userId {
  
  return $UserIdCopyWith<$Res>(_self.userId, (value) {
    return _then(_self.copyWith(userId: value));
  });
}
}


/// Adds pattern-matching-related methods to [ReportedBy].
extension ReportedByPatterns on ReportedBy {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReportedBy value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReportedBy() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReportedBy value)  $default,){
final _that = this;
switch (_that) {
case _ReportedBy():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReportedBy value)?  $default,){
final _that = this;
switch (_that) {
case _ReportedBy() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( UserId userId,  String role)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReportedBy() when $default != null:
return $default(_that.userId,_that.role);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( UserId userId,  String role)  $default,) {final _that = this;
switch (_that) {
case _ReportedBy():
return $default(_that.userId,_that.role);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( UserId userId,  String role)?  $default,) {final _that = this;
switch (_that) {
case _ReportedBy() when $default != null:
return $default(_that.userId,_that.role);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReportedBy implements ReportedBy {
  const _ReportedBy({required this.userId, required this.role});
  factory _ReportedBy.fromJson(Map<String, dynamic> json) => _$ReportedByFromJson(json);

@override final  UserId userId;
@override final  String role;

/// Create a copy of ReportedBy
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReportedByCopyWith<_ReportedBy> get copyWith => __$ReportedByCopyWithImpl<_ReportedBy>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReportedByToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReportedBy&&(identical(other.userId, userId) || other.userId == userId)&&(identical(other.role, role) || other.role == role));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,userId,role);

@override
String toString() {
  return 'ReportedBy(userId: $userId, role: $role)';
}


}

/// @nodoc
abstract mixin class _$ReportedByCopyWith<$Res> implements $ReportedByCopyWith<$Res> {
  factory _$ReportedByCopyWith(_ReportedBy value, $Res Function(_ReportedBy) _then) = __$ReportedByCopyWithImpl;
@override @useResult
$Res call({
 UserId userId, String role
});


@override $UserIdCopyWith<$Res> get userId;

}
/// @nodoc
class __$ReportedByCopyWithImpl<$Res>
    implements _$ReportedByCopyWith<$Res> {
  __$ReportedByCopyWithImpl(this._self, this._then);

  final _ReportedBy _self;
  final $Res Function(_ReportedBy) _then;

/// Create a copy of ReportedBy
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? userId = null,Object? role = null,}) {
  return _then(_ReportedBy(
userId: null == userId ? _self.userId : userId // ignore: cast_nullable_to_non_nullable
as UserId,role: null == role ? _self.role : role // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

/// Create a copy of ReportedBy
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$UserIdCopyWith<$Res> get userId {
  
  return $UserIdCopyWith<$Res>(_self.userId, (value) {
    return _then(_self.copyWith(userId: value));
  });
}
}


/// @nodoc
mixin _$ReportAttachment {

@JsonKey(name: '_id') String get id; String get type; String get url;
/// Create a copy of ReportAttachment
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReportAttachmentCopyWith<ReportAttachment> get copyWith => _$ReportAttachmentCopyWithImpl<ReportAttachment>(this as ReportAttachment, _$identity);

  /// Serializes this ReportAttachment to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReportAttachment&&(identical(other.id, id) || other.id == id)&&(identical(other.type, type) || other.type == type)&&(identical(other.url, url) || other.url == url));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,type,url);

@override
String toString() {
  return 'ReportAttachment(id: $id, type: $type, url: $url)';
}


}

/// @nodoc
abstract mixin class $ReportAttachmentCopyWith<$Res>  {
  factory $ReportAttachmentCopyWith(ReportAttachment value, $Res Function(ReportAttachment) _then) = _$ReportAttachmentCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: '_id') String id, String type, String url
});




}
/// @nodoc
class _$ReportAttachmentCopyWithImpl<$Res>
    implements $ReportAttachmentCopyWith<$Res> {
  _$ReportAttachmentCopyWithImpl(this._self, this._then);

  final ReportAttachment _self;
  final $Res Function(ReportAttachment) _then;

/// Create a copy of ReportAttachment
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? type = null,Object? url = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [ReportAttachment].
extension ReportAttachmentPatterns on ReportAttachment {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReportAttachment value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReportAttachment() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReportAttachment value)  $default,){
final _that = this;
switch (_that) {
case _ReportAttachment():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReportAttachment value)?  $default,){
final _that = this;
switch (_that) {
case _ReportAttachment() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  String type,  String url)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReportAttachment() when $default != null:
return $default(_that.id,_that.type,_that.url);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  String type,  String url)  $default,) {final _that = this;
switch (_that) {
case _ReportAttachment():
return $default(_that.id,_that.type,_that.url);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: '_id')  String id,  String type,  String url)?  $default,) {final _that = this;
switch (_that) {
case _ReportAttachment() when $default != null:
return $default(_that.id,_that.type,_that.url);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReportAttachment implements ReportAttachment {
  const _ReportAttachment({@JsonKey(name: '_id') required this.id, required this.type, required this.url});
  factory _ReportAttachment.fromJson(Map<String, dynamic> json) => _$ReportAttachmentFromJson(json);

@override@JsonKey(name: '_id') final  String id;
@override final  String type;
@override final  String url;

/// Create a copy of ReportAttachment
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReportAttachmentCopyWith<_ReportAttachment> get copyWith => __$ReportAttachmentCopyWithImpl<_ReportAttachment>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReportAttachmentToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReportAttachment&&(identical(other.id, id) || other.id == id)&&(identical(other.type, type) || other.type == type)&&(identical(other.url, url) || other.url == url));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,type,url);

@override
String toString() {
  return 'ReportAttachment(id: $id, type: $type, url: $url)';
}


}

/// @nodoc
abstract mixin class _$ReportAttachmentCopyWith<$Res> implements $ReportAttachmentCopyWith<$Res> {
  factory _$ReportAttachmentCopyWith(_ReportAttachment value, $Res Function(_ReportAttachment) _then) = __$ReportAttachmentCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: '_id') String id, String type, String url
});




}
/// @nodoc
class __$ReportAttachmentCopyWithImpl<$Res>
    implements _$ReportAttachmentCopyWith<$Res> {
  __$ReportAttachmentCopyWithImpl(this._self, this._then);

  final _ReportAttachment _self;
  final $Res Function(_ReportAttachment) _then;

/// Create a copy of ReportAttachment
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? type = null,Object? url = null,}) {
  return _then(_ReportAttachment(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,type: null == type ? _self.type : type // ignore: cast_nullable_to_non_nullable
as String,url: null == url ? _self.url : url // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$ActionReport {

@JsonKey(name: '_id') String get id; ReportLocation get location; ReportedBy get reportedBy;// API sends "recordCategory" not "recordType"
@JsonKey(name: 'recordCategory') String get recordCategory; String get title; String get description; String get riskLevel; String get eventDate; String get eventTime; int get peopleAffected; String get injuryDetails; String get equipmentInvolved; List<ReportAttachment> get attachments; String get status; String get createdAt; String get updatedAt;
/// Create a copy of ActionReport
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ActionReportCopyWith<ActionReport> get copyWith => _$ActionReportCopyWithImpl<ActionReport>(this as ActionReport, _$identity);

  /// Serializes this ActionReport to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ActionReport&&(identical(other.id, id) || other.id == id)&&(identical(other.location, location) || other.location == location)&&(identical(other.reportedBy, reportedBy) || other.reportedBy == reportedBy)&&(identical(other.recordCategory, recordCategory) || other.recordCategory == recordCategory)&&(identical(other.title, title) || other.title == title)&&(identical(other.description, description) || other.description == description)&&(identical(other.riskLevel, riskLevel) || other.riskLevel == riskLevel)&&(identical(other.eventDate, eventDate) || other.eventDate == eventDate)&&(identical(other.eventTime, eventTime) || other.eventTime == eventTime)&&(identical(other.peopleAffected, peopleAffected) || other.peopleAffected == peopleAffected)&&(identical(other.injuryDetails, injuryDetails) || other.injuryDetails == injuryDetails)&&(identical(other.equipmentInvolved, equipmentInvolved) || other.equipmentInvolved == equipmentInvolved)&&const DeepCollectionEquality().equals(other.attachments, attachments)&&(identical(other.status, status) || other.status == status)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,location,reportedBy,recordCategory,title,description,riskLevel,eventDate,eventTime,peopleAffected,injuryDetails,equipmentInvolved,const DeepCollectionEquality().hash(attachments),status,createdAt,updatedAt);

@override
String toString() {
  return 'ActionReport(id: $id, location: $location, reportedBy: $reportedBy, recordCategory: $recordCategory, title: $title, description: $description, riskLevel: $riskLevel, eventDate: $eventDate, eventTime: $eventTime, peopleAffected: $peopleAffected, injuryDetails: $injuryDetails, equipmentInvolved: $equipmentInvolved, attachments: $attachments, status: $status, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class $ActionReportCopyWith<$Res>  {
  factory $ActionReportCopyWith(ActionReport value, $Res Function(ActionReport) _then) = _$ActionReportCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: '_id') String id, ReportLocation location, ReportedBy reportedBy,@JsonKey(name: 'recordCategory') String recordCategory, String title, String description, String riskLevel, String eventDate, String eventTime, int peopleAffected, String injuryDetails, String equipmentInvolved, List<ReportAttachment> attachments, String status, String createdAt, String updatedAt
});


$ReportLocationCopyWith<$Res> get location;$ReportedByCopyWith<$Res> get reportedBy;

}
/// @nodoc
class _$ActionReportCopyWithImpl<$Res>
    implements $ActionReportCopyWith<$Res> {
  _$ActionReportCopyWithImpl(this._self, this._then);

  final ActionReport _self;
  final $Res Function(ActionReport) _then;

/// Create a copy of ActionReport
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? location = null,Object? reportedBy = null,Object? recordCategory = null,Object? title = null,Object? description = null,Object? riskLevel = null,Object? eventDate = null,Object? eventTime = null,Object? peopleAffected = null,Object? injuryDetails = null,Object? equipmentInvolved = null,Object? attachments = null,Object? status = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,location: null == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as ReportLocation,reportedBy: null == reportedBy ? _self.reportedBy : reportedBy // ignore: cast_nullable_to_non_nullable
as ReportedBy,recordCategory: null == recordCategory ? _self.recordCategory : recordCategory // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,riskLevel: null == riskLevel ? _self.riskLevel : riskLevel // ignore: cast_nullable_to_non_nullable
as String,eventDate: null == eventDate ? _self.eventDate : eventDate // ignore: cast_nullable_to_non_nullable
as String,eventTime: null == eventTime ? _self.eventTime : eventTime // ignore: cast_nullable_to_non_nullable
as String,peopleAffected: null == peopleAffected ? _self.peopleAffected : peopleAffected // ignore: cast_nullable_to_non_nullable
as int,injuryDetails: null == injuryDetails ? _self.injuryDetails : injuryDetails // ignore: cast_nullable_to_non_nullable
as String,equipmentInvolved: null == equipmentInvolved ? _self.equipmentInvolved : equipmentInvolved // ignore: cast_nullable_to_non_nullable
as String,attachments: null == attachments ? _self.attachments : attachments // ignore: cast_nullable_to_non_nullable
as List<ReportAttachment>,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}
/// Create a copy of ActionReport
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ReportLocationCopyWith<$Res> get location {
  
  return $ReportLocationCopyWith<$Res>(_self.location, (value) {
    return _then(_self.copyWith(location: value));
  });
}/// Create a copy of ActionReport
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ReportedByCopyWith<$Res> get reportedBy {
  
  return $ReportedByCopyWith<$Res>(_self.reportedBy, (value) {
    return _then(_self.copyWith(reportedBy: value));
  });
}
}


/// Adds pattern-matching-related methods to [ActionReport].
extension ActionReportPatterns on ActionReport {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ActionReport value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ActionReport() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ActionReport value)  $default,){
final _that = this;
switch (_that) {
case _ActionReport():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ActionReport value)?  $default,){
final _that = this;
switch (_that) {
case _ActionReport() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  ReportLocation location,  ReportedBy reportedBy, @JsonKey(name: 'recordCategory')  String recordCategory,  String title,  String description,  String riskLevel,  String eventDate,  String eventTime,  int peopleAffected,  String injuryDetails,  String equipmentInvolved,  List<ReportAttachment> attachments,  String status,  String createdAt,  String updatedAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ActionReport() when $default != null:
return $default(_that.id,_that.location,_that.reportedBy,_that.recordCategory,_that.title,_that.description,_that.riskLevel,_that.eventDate,_that.eventTime,_that.peopleAffected,_that.injuryDetails,_that.equipmentInvolved,_that.attachments,_that.status,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: '_id')  String id,  ReportLocation location,  ReportedBy reportedBy, @JsonKey(name: 'recordCategory')  String recordCategory,  String title,  String description,  String riskLevel,  String eventDate,  String eventTime,  int peopleAffected,  String injuryDetails,  String equipmentInvolved,  List<ReportAttachment> attachments,  String status,  String createdAt,  String updatedAt)  $default,) {final _that = this;
switch (_that) {
case _ActionReport():
return $default(_that.id,_that.location,_that.reportedBy,_that.recordCategory,_that.title,_that.description,_that.riskLevel,_that.eventDate,_that.eventTime,_that.peopleAffected,_that.injuryDetails,_that.equipmentInvolved,_that.attachments,_that.status,_that.createdAt,_that.updatedAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: '_id')  String id,  ReportLocation location,  ReportedBy reportedBy, @JsonKey(name: 'recordCategory')  String recordCategory,  String title,  String description,  String riskLevel,  String eventDate,  String eventTime,  int peopleAffected,  String injuryDetails,  String equipmentInvolved,  List<ReportAttachment> attachments,  String status,  String createdAt,  String updatedAt)?  $default,) {final _that = this;
switch (_that) {
case _ActionReport() when $default != null:
return $default(_that.id,_that.location,_that.reportedBy,_that.recordCategory,_that.title,_that.description,_that.riskLevel,_that.eventDate,_that.eventTime,_that.peopleAffected,_that.injuryDetails,_that.equipmentInvolved,_that.attachments,_that.status,_that.createdAt,_that.updatedAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ActionReport implements ActionReport {
  const _ActionReport({@JsonKey(name: '_id') required this.id, required this.location, required this.reportedBy, @JsonKey(name: 'recordCategory') this.recordCategory = '', required this.title, required this.description, required this.riskLevel, required this.eventDate, required this.eventTime, this.peopleAffected = 0, this.injuryDetails = '', this.equipmentInvolved = '', final  List<ReportAttachment> attachments = const [], required this.status, required this.createdAt, required this.updatedAt}): _attachments = attachments;
  factory _ActionReport.fromJson(Map<String, dynamic> json) => _$ActionReportFromJson(json);

@override@JsonKey(name: '_id') final  String id;
@override final  ReportLocation location;
@override final  ReportedBy reportedBy;
// API sends "recordCategory" not "recordType"
@override@JsonKey(name: 'recordCategory') final  String recordCategory;
@override final  String title;
@override final  String description;
@override final  String riskLevel;
@override final  String eventDate;
@override final  String eventTime;
@override@JsonKey() final  int peopleAffected;
@override@JsonKey() final  String injuryDetails;
@override@JsonKey() final  String equipmentInvolved;
 final  List<ReportAttachment> _attachments;
@override@JsonKey() List<ReportAttachment> get attachments {
  if (_attachments is EqualUnmodifiableListView) return _attachments;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_attachments);
}

@override final  String status;
@override final  String createdAt;
@override final  String updatedAt;

/// Create a copy of ActionReport
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ActionReportCopyWith<_ActionReport> get copyWith => __$ActionReportCopyWithImpl<_ActionReport>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ActionReportToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ActionReport&&(identical(other.id, id) || other.id == id)&&(identical(other.location, location) || other.location == location)&&(identical(other.reportedBy, reportedBy) || other.reportedBy == reportedBy)&&(identical(other.recordCategory, recordCategory) || other.recordCategory == recordCategory)&&(identical(other.title, title) || other.title == title)&&(identical(other.description, description) || other.description == description)&&(identical(other.riskLevel, riskLevel) || other.riskLevel == riskLevel)&&(identical(other.eventDate, eventDate) || other.eventDate == eventDate)&&(identical(other.eventTime, eventTime) || other.eventTime == eventTime)&&(identical(other.peopleAffected, peopleAffected) || other.peopleAffected == peopleAffected)&&(identical(other.injuryDetails, injuryDetails) || other.injuryDetails == injuryDetails)&&(identical(other.equipmentInvolved, equipmentInvolved) || other.equipmentInvolved == equipmentInvolved)&&const DeepCollectionEquality().equals(other._attachments, _attachments)&&(identical(other.status, status) || other.status == status)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt)&&(identical(other.updatedAt, updatedAt) || other.updatedAt == updatedAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,location,reportedBy,recordCategory,title,description,riskLevel,eventDate,eventTime,peopleAffected,injuryDetails,equipmentInvolved,const DeepCollectionEquality().hash(_attachments),status,createdAt,updatedAt);

@override
String toString() {
  return 'ActionReport(id: $id, location: $location, reportedBy: $reportedBy, recordCategory: $recordCategory, title: $title, description: $description, riskLevel: $riskLevel, eventDate: $eventDate, eventTime: $eventTime, peopleAffected: $peopleAffected, injuryDetails: $injuryDetails, equipmentInvolved: $equipmentInvolved, attachments: $attachments, status: $status, createdAt: $createdAt, updatedAt: $updatedAt)';
}


}

/// @nodoc
abstract mixin class _$ActionReportCopyWith<$Res> implements $ActionReportCopyWith<$Res> {
  factory _$ActionReportCopyWith(_ActionReport value, $Res Function(_ActionReport) _then) = __$ActionReportCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: '_id') String id, ReportLocation location, ReportedBy reportedBy,@JsonKey(name: 'recordCategory') String recordCategory, String title, String description, String riskLevel, String eventDate, String eventTime, int peopleAffected, String injuryDetails, String equipmentInvolved, List<ReportAttachment> attachments, String status, String createdAt, String updatedAt
});


@override $ReportLocationCopyWith<$Res> get location;@override $ReportedByCopyWith<$Res> get reportedBy;

}
/// @nodoc
class __$ActionReportCopyWithImpl<$Res>
    implements _$ActionReportCopyWith<$Res> {
  __$ActionReportCopyWithImpl(this._self, this._then);

  final _ActionReport _self;
  final $Res Function(_ActionReport) _then;

/// Create a copy of ActionReport
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? location = null,Object? reportedBy = null,Object? recordCategory = null,Object? title = null,Object? description = null,Object? riskLevel = null,Object? eventDate = null,Object? eventTime = null,Object? peopleAffected = null,Object? injuryDetails = null,Object? equipmentInvolved = null,Object? attachments = null,Object? status = null,Object? createdAt = null,Object? updatedAt = null,}) {
  return _then(_ActionReport(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,location: null == location ? _self.location : location // ignore: cast_nullable_to_non_nullable
as ReportLocation,reportedBy: null == reportedBy ? _self.reportedBy : reportedBy // ignore: cast_nullable_to_non_nullable
as ReportedBy,recordCategory: null == recordCategory ? _self.recordCategory : recordCategory // ignore: cast_nullable_to_non_nullable
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,riskLevel: null == riskLevel ? _self.riskLevel : riskLevel // ignore: cast_nullable_to_non_nullable
as String,eventDate: null == eventDate ? _self.eventDate : eventDate // ignore: cast_nullable_to_non_nullable
as String,eventTime: null == eventTime ? _self.eventTime : eventTime // ignore: cast_nullable_to_non_nullable
as String,peopleAffected: null == peopleAffected ? _self.peopleAffected : peopleAffected // ignore: cast_nullable_to_non_nullable
as int,injuryDetails: null == injuryDetails ? _self.injuryDetails : injuryDetails // ignore: cast_nullable_to_non_nullable
as String,equipmentInvolved: null == equipmentInvolved ? _self.equipmentInvolved : equipmentInvolved // ignore: cast_nullable_to_non_nullable
as String,attachments: null == attachments ? _self._attachments : attachments // ignore: cast_nullable_to_non_nullable
as List<ReportAttachment>,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as String,updatedAt: null == updatedAt ? _self.updatedAt : updatedAt // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

/// Create a copy of ActionReport
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ReportLocationCopyWith<$Res> get location {
  
  return $ReportLocationCopyWith<$Res>(_self.location, (value) {
    return _then(_self.copyWith(location: value));
  });
}/// Create a copy of ActionReport
/// with the given fields replaced by the non-null parameter values.
@override
@pragma('vm:prefer-inline')
$ReportedByCopyWith<$Res> get reportedBy {
  
  return $ReportedByCopyWith<$Res>(_self.reportedBy, (value) {
    return _then(_self.copyWith(reportedBy: value));
  });
}
}


/// @nodoc
mixin _$ActionReportsResponse {

 bool get success; List<ActionReport> get data;
/// Create a copy of ActionReportsResponse
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ActionReportsResponseCopyWith<ActionReportsResponse> get copyWith => _$ActionReportsResponseCopyWithImpl<ActionReportsResponse>(this as ActionReportsResponse, _$identity);

  /// Serializes this ActionReportsResponse to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ActionReportsResponse&&(identical(other.success, success) || other.success == success)&&const DeepCollectionEquality().equals(other.data, data));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,success,const DeepCollectionEquality().hash(data));

@override
String toString() {
  return 'ActionReportsResponse(success: $success, data: $data)';
}


}

/// @nodoc
abstract mixin class $ActionReportsResponseCopyWith<$Res>  {
  factory $ActionReportsResponseCopyWith(ActionReportsResponse value, $Res Function(ActionReportsResponse) _then) = _$ActionReportsResponseCopyWithImpl;
@useResult
$Res call({
 bool success, List<ActionReport> data
});




}
/// @nodoc
class _$ActionReportsResponseCopyWithImpl<$Res>
    implements $ActionReportsResponseCopyWith<$Res> {
  _$ActionReportsResponseCopyWithImpl(this._self, this._then);

  final ActionReportsResponse _self;
  final $Res Function(ActionReportsResponse) _then;

/// Create a copy of ActionReportsResponse
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? success = null,Object? data = null,}) {
  return _then(_self.copyWith(
success: null == success ? _self.success : success // ignore: cast_nullable_to_non_nullable
as bool,data: null == data ? _self.data : data // ignore: cast_nullable_to_non_nullable
as List<ActionReport>,
  ));
}

}


/// Adds pattern-matching-related methods to [ActionReportsResponse].
extension ActionReportsResponsePatterns on ActionReportsResponse {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ActionReportsResponse value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ActionReportsResponse() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ActionReportsResponse value)  $default,){
final _that = this;
switch (_that) {
case _ActionReportsResponse():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ActionReportsResponse value)?  $default,){
final _that = this;
switch (_that) {
case _ActionReportsResponse() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( bool success,  List<ActionReport> data)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ActionReportsResponse() when $default != null:
return $default(_that.success,_that.data);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( bool success,  List<ActionReport> data)  $default,) {final _that = this;
switch (_that) {
case _ActionReportsResponse():
return $default(_that.success,_that.data);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( bool success,  List<ActionReport> data)?  $default,) {final _that = this;
switch (_that) {
case _ActionReportsResponse() when $default != null:
return $default(_that.success,_that.data);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ActionReportsResponse implements ActionReportsResponse {
  const _ActionReportsResponse({required this.success, required final  List<ActionReport> data}): _data = data;
  factory _ActionReportsResponse.fromJson(Map<String, dynamic> json) => _$ActionReportsResponseFromJson(json);

@override final  bool success;
 final  List<ActionReport> _data;
@override List<ActionReport> get data {
  if (_data is EqualUnmodifiableListView) return _data;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_data);
}


/// Create a copy of ActionReportsResponse
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ActionReportsResponseCopyWith<_ActionReportsResponse> get copyWith => __$ActionReportsResponseCopyWithImpl<_ActionReportsResponse>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ActionReportsResponseToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ActionReportsResponse&&(identical(other.success, success) || other.success == success)&&const DeepCollectionEquality().equals(other._data, _data));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,success,const DeepCollectionEquality().hash(_data));

@override
String toString() {
  return 'ActionReportsResponse(success: $success, data: $data)';
}


}

/// @nodoc
abstract mixin class _$ActionReportsResponseCopyWith<$Res> implements $ActionReportsResponseCopyWith<$Res> {
  factory _$ActionReportsResponseCopyWith(_ActionReportsResponse value, $Res Function(_ActionReportsResponse) _then) = __$ActionReportsResponseCopyWithImpl;
@override @useResult
$Res call({
 bool success, List<ActionReport> data
});




}
/// @nodoc
class __$ActionReportsResponseCopyWithImpl<$Res>
    implements _$ActionReportsResponseCopyWith<$Res> {
  __$ActionReportsResponseCopyWithImpl(this._self, this._then);

  final _ActionReportsResponse _self;
  final $Res Function(_ActionReportsResponse) _then;

/// Create a copy of ActionReportsResponse
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? success = null,Object? data = null,}) {
  return _then(_ActionReportsResponse(
success: null == success ? _self.success : success // ignore: cast_nullable_to_non_nullable
as bool,data: null == data ? _self._data : data // ignore: cast_nullable_to_non_nullable
as List<ActionReport>,
  ));
}


}

// dart format on
