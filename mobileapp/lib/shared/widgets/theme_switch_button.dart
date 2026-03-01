import 'package:aegix/shared/providers/theme_provider.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class ThemeSwitchButton extends ConsumerWidget {
  final double size;
  final Color? activeColor;
  final Color? inactiveColor;

  const ThemeSwitchButton({
    super.key,
    this.size = 24,
    this.activeColor,
    this.inactiveColor,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDarkMode = ref.watch(isDarkModeProvider);
    
    return IconButton(
      icon: AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        transitionBuilder: (Widget child, Animation<double> animation) {
          return RotationTransition(
            turns: animation,
            child: FadeTransition(
              opacity: animation,
              child: child,
            ),
          );
        },
        child: Icon(
          isDarkMode ? Icons.nightlight_round : Icons.wb_sunny,
          key: ValueKey(isDarkMode),
          size: size,
          color: isDarkMode 
              ? (activeColor ?? Colors.amber) 
              : (inactiveColor ?? Colors.orange),
        ),
      ),
      onPressed: () => ref.read(themeModeProvider.notifier).toggleTheme(),
    );
  }
}

// Alternative: Switch with text
class ThemeSwitchTile extends ConsumerWidget {
  const ThemeSwitchTile({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final isDarkMode = ref.watch(isDarkModeProvider);
    
    String themeText = 'System';
    IconData themeIcon = Icons.settings_brightness;
    
    if (themeMode == ThemeMode.light) {
      themeText = 'Light';
      themeIcon = Icons.wb_sunny;
    } else if (themeMode == ThemeMode.dark) {
      themeText = 'Dark';
      themeIcon = Icons.nightlight_round;
    }
    
    return ListTile(
      leading: Icon(themeIcon),
      title: const Text('Theme'),
      subtitle: Text('Current: $themeText'),
      trailing: DropdownButton<ThemeMode>(
        value: themeMode,
        onChanged: (ThemeMode? mode) {
          if (mode != null) {
            ref.read(themeModeProvider.notifier).setThemeMode(mode);
          }
        },
        items: const [
          DropdownMenuItem(
            value: ThemeMode.light,
            child: Text('Light'),
          ),
          DropdownMenuItem(
            value: ThemeMode.dark,
            child: Text('Dark'),
          ),
          DropdownMenuItem(
            value: ThemeMode.system,
            child: Text('System'),
          ),
        ],
      ),
    );
  }
}