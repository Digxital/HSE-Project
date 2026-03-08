import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/dashboard/home_controller.dart';
import 'package:aegix/features/dashboard/home_provider.dart';
import 'package:aegix/shared/widgets/custom_loader.dart';
import 'package:aegix/shared/widgets/error_widget.dart';
import 'package:aegix/shared/widgets/gradient_background.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

class DashboardPage extends HookConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Auth state
    
   
    // Handle different states
    return Scaffold(
      body: SafeArea(
        child: _buildBody(context),
      ),
    );
  }
  
  Widget _buildBody(
    BuildContext context,
  ) {
   
    
    // Handle loaded state
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      physics: const AlwaysScrollableScrollPhysics(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          
         
          const SizedBox(height: 24),
          
          const SizedBox(height: 16),
          
          const SizedBox(height: 16),
          
        ],
      ),
    );
  }
  
 
  
  
}