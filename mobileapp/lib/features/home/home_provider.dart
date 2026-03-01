import 'package:aegix/features/auth/controllers/auth_controller.dart';
import 'package:aegix/features/auth/models/assets_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

import 'home_controller.dart';


// MARK: - Home State
enum HomeStatus {
  initial,
  loading, 
  loaded,
  error,
  refreshing,
}

class HomeState {
  final AssetsResponse? assets;
  final bool isLoadingAssets;
  final String? assetsError;
  final HomeStatus status; 
  final String? errorMessage;
  final double totalBalance;
  final List<Transaction> recentTransactions;
  final List<QuickAction> quickActions;
  final UserStats userStats;
  final bool hasNotifications;
  final int unreadNotificationsCount;
  
  HomeState({
    this.assets,
    this.isLoadingAssets = false,
     this.assetsError,
    this.status = HomeStatus.initial,
    this.errorMessage,
    this.totalBalance = 0.0,
    this.recentTransactions = const [],
    this.quickActions = const [],
    this.userStats = const UserStats(),
    this.hasNotifications = false,
    this.unreadNotificationsCount = 0,
  });
  
  HomeState copyWith({
    AssetsResponse? assets,
    bool? isLoadingAssets,
    String? assetsError,
    HomeStatus? status,
    String? errorMessage,
    double? totalBalance,
    List<Transaction>? recentTransactions,
    List<QuickAction>? quickActions,
    UserStats? userStats,
    bool? hasNotifications,
    int? unreadNotificationsCount,
  }) {
    return HomeState(
      assets: assets ?? this.assets,
      isLoadingAssets: isLoadingAssets ?? this.isLoadingAssets,
      assetsError: assetsError ?? this.assetsError,
      status: status ?? this.status,
      errorMessage: errorMessage ?? this.errorMessage,
      totalBalance: totalBalance ?? this.totalBalance,
      recentTransactions: recentTransactions ?? this.recentTransactions,
      quickActions: quickActions ?? this.quickActions,
      userStats: userStats ?? this.userStats,
      hasNotifications: hasNotifications ?? this.hasNotifications,
      unreadNotificationsCount: unreadNotificationsCount ?? this.unreadNotificationsCount,
    );
  }
}

// MARK: - Transaction Model
class Transaction {
  final String id;
  final String title;
  final String description;
  final double amount;
  final DateTime date;
  final TransactionType type;
  final TransactionStatus status;
  final String? category;
  final String? recipientName;
  final String? recipientAccount;
  
  Transaction({
    required this.id,
    required this.title,
    required this.description,
    required this.amount,
    required this.date,
    required this.type,
    required this.status,
    this.category,
    this.recipientName,
    this.recipientAccount,
  });
  
  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      amount: (json['amount'] ?? 0).toDouble(),
      date: DateTime.parse(json['date'] ?? DateTime.now().toIso8601String()),
      type: TransactionType.values.firstWhere(
        (e) => e.toString() == 'TransactionType.${json['type']}',
        orElse: () => TransactionType.debit,
      ),
      status: TransactionStatus.values.firstWhere(
        (e) => e.toString() == 'TransactionStatus.${json['status']}',
        orElse: () => TransactionStatus.completed,
      ),
      category: json['category'],
      recipientName: json['recipientName'],
      recipientAccount: json['recipientAccount'],
    );
  }
  
  String get formattedAmount {
    final isNegative = type == TransactionType.debit || 
                      type == TransactionType.payment ||
                      type == TransactionType.withdrawal;
    return '${isNegative ? '-' : '+'}\$${amount.toStringAsFixed(2)}';
  }
  
  Color get amountColor {
    switch (type) {
      case TransactionType.credit:
      case TransactionType.deposit:
        return Colors.green;
      case TransactionType.debit:
      case TransactionType.payment:
      case TransactionType.withdrawal:
        return Colors.red;
      case TransactionType.transfer:
        return Colors.orange;
    }
  }
  
  IconData get icon {
    switch (category) {
      case 'shopping':
        return Icons.shopping_bag;
      case 'food':
        return Icons.restaurant;
      case 'transport':
        return Icons.directions_car;
      case 'entertainment':
        return Icons.movie;
      case 'bills':
        return Icons.receipt;
      case 'transfer':
        return Icons.swap_horiz;
      default:
        return Icons.receipt_long;
    }
  }
}

enum TransactionType {
  credit,
  debit,
  transfer,
  payment,
  deposit,
  withdrawal
}

enum TransactionStatus {
  pending,
  completed,
  failed,
  cancelled
}

// MARK: - Quick Action Model
class QuickAction {
  final String id;
  final String title;
  final IconData icon;
  final Color color;
  final String route;
  final bool isEnabled;
  
  QuickAction({
    required this.id,
    required this.title,
    required this.icon,
    required this.color,
    required this.route,
    this.isEnabled = true,
  });
}

// MARK: - User Stats Model
class UserStats {
  final double monthlySpending;
  final double monthlyIncome;
  final int totalTransactions;
  final int activeCards;
  final double savingsGoal;
  final double savingsProgress;
  
  const UserStats({
    this.monthlySpending = 0.0,
    this.monthlyIncome = 0.0,
    this.totalTransactions = 0,
    this.activeCards = 0,
    this.savingsGoal = 0.0,
    this.savingsProgress = 0.0,
  });
  
  UserStats copyWith({
    double? monthlySpending,
    double? monthlyIncome,
    int? totalTransactions,
    int? activeCards,
    double? savingsGoal,
    double? savingsProgress,
  }) {
    return UserStats(
      monthlySpending: monthlySpending ?? this.monthlySpending,
      monthlyIncome: monthlyIncome ?? this.monthlyIncome,
      totalTransactions: totalTransactions ?? this.totalTransactions,
      activeCards: activeCards ?? this.activeCards,
      savingsGoal: savingsGoal ?? this.savingsGoal,
      savingsProgress: savingsProgress ?? this.savingsProgress,
    );
  }
}

// MARK: - Home Provider
final homeProvider = StateNotifierProvider<HomeController, HomeState>((ref) {
  final userId = ref.watch(currentUserProvider)?.id;
  if (userId == null) {
    throw Exception('User not authenticated');
  }
  return HomeController(ref, userId.toString());
});





// MARK: - Derived Providers
final homeTotalBalanceProvider = Provider<double>((ref) {
  return ref.watch(homeProvider).totalBalance;
});

final homeRecentTransactionsProvider = Provider<List<Transaction>>((ref) {
  return ref.watch(homeProvider).recentTransactions;
});

final homeQuickActionsProvider = Provider<List<QuickAction>>((ref) {
  return ref.watch(homeProvider).quickActions;
});

final homeUserStatsProvider = Provider<UserStats>((ref) {
  return ref.watch(homeProvider).userStats;
});

final homeStatusProvider = Provider<HomeStatus>((ref) {
  return ref.watch(homeProvider).status;
});

final homeHasNotificationsProvider = Provider<bool>((ref) {
  return ref.watch(homeProvider).hasNotifications;
});

final homeUnreadCountProvider = Provider<int>((ref) {
  return ref.watch(homeProvider).unreadNotificationsCount;
});

final homeErrorMessageProvider = Provider<String?>((ref) {
  return ref.watch(homeProvider).errorMessage;
});

// MARK: - Repository Provider (to be implemented)
final homeRepositoryProvider = Provider<HomeRepository>((ref) {
  return HomeRepository();
});

class HomeRepository {
  // Implement actual API calls here
  Future<Map<String, dynamic>> getDashboardData(String userId) async {
    // Replace with actual API call
    throw UnimplementedError();
  }
  
  Future<List<Transaction>> getRecentTransactions(String userId) async {
    // Replace with actual API call
    throw UnimplementedError();
  }
  
  Future<double> getTotalBalance(String userId) async {
    // Replace with actual API call
    throw UnimplementedError();
  }
}