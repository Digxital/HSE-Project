import 'package:flutter/material.dart';

class GradientBackground extends StatelessWidget {
  final Widget child;
  final List<Color>? colors;
  final Alignment begin;
  final Alignment end;
  final bool useScaffold;
  
  const GradientBackground({
    super.key,
    required this.child,
    this.colors,
    this.begin = Alignment.topCenter,
    this.end = Alignment.bottomCenter,
    this.useScaffold = false,
  });

  @override
  Widget build(BuildContext context) {
    final gradientColors = colors ?? [
      const Color(0xFF1E3A8A), // Deep blue
      const Color(0xFF3B82F6), // Medium blue
      const Color(0xFF60A5FA), // Light blue
    ];

    final gradient = Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: begin,
          end: end,
          colors: gradientColors,
        ),
      ),
      child: child,
    );

    return useScaffold 
        ? Scaffold(body: gradient)
        : gradient;
  }
}

// Predefined gradients for different purposes
class Gradients {
  static const primaryGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFF1E3A8A), // Deep blue
      Color(0xFF3B82F6), // Medium blue
      Color(0xFF60A5FA), // Light blue
    ],
  );

  static const successGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF059669), // Green
      Color(0xFF10B981), // Light green
      Color(0xFF34D399), // Mint
    ],
  );

  static const warningGradient = LinearGradient(
    begin: Alignment.topRight,
    end: Alignment.bottomLeft,
    colors: [
      Color(0xFFD97706), // Amber
      Color(0xFFF59E0B), // Orange
      Color(0xFFFBBF24), // Light orange
    ],
  );

  static const errorGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFFB91C1C), // Dark red
      Color(0xFFDC2626), // Red
      Color(0xFFEF4444), // Light red
    ],
  );

  static const purpleGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [
      Color(0xFF6B21A8), // Dark purple
      Color(0xFF8B5CF6), // Purple
      Color(0xFFA78BFA), // Light purple
    ],
  );

  static const darkGradient = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [
      Color(0xFF111827), // Near black
      Color(0xFF1F2937), // Dark gray
      Color(0xFF374151), // Gray
    ],
  );
}

// Gradient container for specific sections
class GradientContainer extends StatelessWidget {
  final Widget child;
  final List<Color>? colors;
  final EdgeInsetsGeometry padding;
  final double borderRadius;
  final Alignment begin;
  final Alignment end;
  
  const GradientContainer({
    super.key,
    required this.child,
    this.colors,
    this.padding = EdgeInsets.zero,
    this.borderRadius = 0,
    this.begin = Alignment.topLeft,
    this.end = Alignment.bottomRight,
  });

  @override
  Widget build(BuildContext context) {
    final gradientColors = colors ?? [
      const Color(0xFF1E3A8A),
      const Color(0xFF3B82F6),
    ];

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: begin,
          end: end,
          colors: gradientColors,
        ),
        borderRadius: BorderRadius.circular(borderRadius),
      ),
      child: child,
    );
  }
}

// Gradient button
class GradientButton extends StatelessWidget {
  final VoidCallback onPressed;
  final Widget child;
  final List<Color>? colors;
  final double borderRadius;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry padding;
  
  const GradientButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.colors,
    this.borderRadius = 8,
    this.width,
    this.height,
    this.padding = const EdgeInsets.symmetric(
      horizontal: 16,
      vertical: 12,
    ),
  });

  @override
  Widget build(BuildContext context) {
    final gradientColors = colors ?? [
      const Color(0xFF1E3A8A),
      const Color(0xFF3B82F6),
    ];

    return InkWell(
      onTap: onPressed,
      borderRadius: BorderRadius.circular(borderRadius),
      child: Container(
        width: width,
        height: height,
        padding: padding,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: gradientColors,
          ),
          borderRadius: BorderRadius.circular(borderRadius),
        ),
        child: child,
      ),
    );
  }
}

// Gradient card
class GradientCard extends StatelessWidget {
  final Widget child;
  final List<Color>? colors;
  final double borderRadius;
  final EdgeInsetsGeometry padding;
  final double elevation;
  
  const GradientCard({
    super.key,
    required this.child,
    this.colors,
    this.borderRadius = 12,
    this.padding = const EdgeInsets.all(16),
    this.elevation = 4,
  });

  @override
  Widget build(BuildContext context) {
    final gradientColors = colors ?? [
      Colors.white.withOpacity(0.1),
      Colors.white.withOpacity(0.05),
    ];

    return Container(
      padding: padding,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: gradientColors,
        ),
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: elevation * 2,
            offset: Offset(0, elevation),
          ),
        ],
      ),
      child: child,
    );
  }
}