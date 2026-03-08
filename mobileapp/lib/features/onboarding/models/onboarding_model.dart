import 'package:equatable/equatable.dart';

class OnboardingContent extends Equatable {
  final String title;
  final String image;
  final String description;

  const OnboardingContent({
    required this.title,
    required this.image,
    required this.description,
  });

  @override
  List<Object?> get props => [title, image, description];
}