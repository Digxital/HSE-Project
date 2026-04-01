import 'package:hooks_riverpod/hooks_riverpod.dart';

/// Profile data model (simple for now)
class ProfileState {
  final String name;
  final String email;
  final int reports;
  final int actionsAssigned;
  final int actionsCompleted;

  ProfileState({
    required this.name,
    required this.email,
    required this.reports,
    required this.actionsAssigned,
    required this.actionsCompleted,
  });

  ProfileState copyWith({
    String? name,
    String? email,
    int? reports,
    int? actionsAssigned,
    int? actionsCompleted,
  }) {
    return ProfileState(
      name: name ?? this.name,
      email: email ?? this.email,
      reports: reports ?? this.reports,
      actionsAssigned: actionsAssigned ?? this.actionsAssigned,
      actionsCompleted: actionsCompleted ?? this.actionsCompleted,
    );
  }
}

/// Profile provider
final profileProvider = StateNotifierProvider<ProfileNotifier, ProfileState>((
  ref,
) {
  return ProfileNotifier();
});

class ProfileNotifier extends StateNotifier<ProfileState> {
  ProfileNotifier()
    : super(
        ProfileState(
          name: "John Matthews",
          email: "john@inveraenergy.com",
          reports: 8,
          actionsAssigned: 3,
          actionsCompleted: 2,
        ),
      );

  void updateProfile(String name, String email) {
    state = state.copyWith(name: name, email: email);
  }
}

/// Notification toggle provider
final notificationProvider = StateProvider<bool>((ref) => false);
