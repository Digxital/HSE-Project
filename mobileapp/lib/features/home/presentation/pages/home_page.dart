import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/models/user_model.dart';
import 'package:aegix/features/home/home_controller.dart';
import 'package:aegix/features/home/home_provider.dart';
import 'package:aegix/shared/widgets/custom_loader.dart';
import 'package:aegix/shared/widgets/error_widget.dart';
import 'package:aegix/shared/widgets/gradient_background.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

import '../../widgets/balance_card.dart';
import '../../widgets/header_section.dart';
import '../../widgets/quick_actions.dart';

class HomePage extends HookConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Auth state
    final user = ref.watch(currentUserProvider);
    
    // Home state from provider
    final homeState = ref.watch(homeProvider); 
    final homeController = ref.read(homeProvider.notifier);
    
    // Handle different states
    return Scaffold(
      body: SafeArea(
        child: _buildBody(context, ref, homeState, homeController, user),
      ),
    );
  }
  
  Widget _buildBody(
    BuildContext context,
    WidgetRef ref,
    HomeState homeState,
    HomeController homeController,
    UserModel? user,
  ) {
    // Handle loading state
    if (homeState.status == HomeStatus.loading) {
      return const CustomLoader();
    }

    // Handle error state
    if (homeState.status == HomeStatus.error) {
      return CustomErrorWidget(
        message: homeState.errorMessage ?? 'Something went wrong',
        onRetry: () => homeController.loadHomeData(),
      );
    }
    
    // Handle loaded state
    return RefreshIndicator(
      onRefresh: () => homeController.refreshData(),
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Section
            if (user != null)
              HeaderSection(homeState:homeState, user:user),
               
            
            SizedBox(height: 10.h),
            // Balance Card (using provider data)
            BalanceCard(homeState:homeState),
            
            const SizedBox(height: 24),
            
            // Quick Actions (using provider data)
            QuickActions(actions:homeState.quickActions),
            
            const SizedBox(height: 24),
            
            // Recent Transactions (using provider data)
            _buildRecentTransactions(context, homeState.recentTransactions),
            
            const SizedBox(height: 16),
            
            // User Stats
            _buildUserStats(context, homeState.userStats),
            
            const SizedBox(height: 16),
            
            // Show refreshing indicator if needed
            if (homeState.status == HomeStatus.refreshing)
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Center(
                  child: SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
  
 
  
  
  
  
  
  
  Widget _buildRecentTransactions(
    BuildContext context, 
    List<Transaction> transactions,
  ) {
    if (transactions.isEmpty) {
      return const Center(
        child: Text(
          'No recent transactions',
          style: TextStyle(color: Colors.white70),
        ),
      );
    }
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Recent Transactions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            TextButton(
              onPressed: () {
                // Navigate to all transactions
              },
              child: const Text(
                'See All',
                style: TextStyle(color: Colors.white70),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: transactions.length > 5 ? 5 : transactions.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final transaction = transactions[index];
            return _buildTransactionItem(transaction);
          },
        ),
      ],
    );
  }
  
  Widget _buildTransactionItem(Transaction transaction) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              transaction.icon, 
              size: 20, 
              color: transaction.amountColor,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _formatDate(transaction.date),
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                transaction.formattedAmount,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: transaction.amountColor,
                ),
              ),
              if (transaction.status != TransactionStatus.completed)
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor(transaction.status).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    transaction.status.name.toUpperCase(),
                    style: TextStyle(
                      fontSize: 10,
                      color: _getStatusColor(transaction.status),
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildUserStats(BuildContext context, UserStats stats) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Monthly Overview',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildStatItem(
                  label: 'Spending',
                  value: '\$${stats.monthlySpending.toStringAsFixed(2)}',
                  color: Colors.red,
                ),
              ),
              Expanded(
                child: _buildStatItem(
                  label: 'Income',
                  value: '\$${stats.monthlyIncome.toStringAsFixed(2)}',
                  color: Colors.green,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          if (stats.savingsGoal > 0)
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Savings Goal',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.7),
                        fontSize: 12,
                      ),
                    ),
                    Text(
                      '\$${stats.savingsProgress.toStringAsFixed(0)} / \$${stats.savingsGoal.toStringAsFixed(0)}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: stats.savingsProgress / stats.savingsGoal,
                    backgroundColor: Colors.white.withOpacity(0.1),
                    valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                    minHeight: 6,
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
  
  Widget _buildStatItem({
    required String label,
    required String value,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.white.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
  
  // Helper methods
  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays == 0) {
      return 'Today, ${_formatTime(date)}';
    } else if (difference.inDays == 1) {
      return 'Yesterday, ${_formatTime(date)}';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
  
  String _formatTime(DateTime date) {
    final hour = date.hour.toString().padLeft(2, '0');
    final minute = date.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }
  
  Color _getStatusColor(TransactionStatus status) {
    switch (status) {
      case TransactionStatus.pending:
        return Colors.orange;
      case TransactionStatus.completed:
        return Colors.green;
      case TransactionStatus.failed:
        return Colors.red;
      case TransactionStatus.cancelled:
        return Colors.grey;
    }
  }
}