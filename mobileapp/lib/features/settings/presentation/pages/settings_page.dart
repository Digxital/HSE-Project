import 'package:aegix/shared/providers/theme_provider.dart';
import 'package:aegix/shared/widgets/theme_switch_button.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDarkMode = ref.watch(isDarkModeProvider);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        children: [
          // Theme Section
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Appearance',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          // Theme Switch Tile
          const ThemeSwitchTile(),
          
          // Dark Mode Status
          ListTile(
            leading: Icon(isDarkMode ? Icons.nightlight_round : Icons.wb_sunny),
            title: Text(isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'),
            subtitle: Text('Based on your current settings'),
          ),
          
          const Divider(),
          
          // Other settings...
        ],
      ),
    );
  }
}