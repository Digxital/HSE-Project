import 'package:aegix/features/auth/models/assets_model.dart';
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';

// 👇 Add these missing imports
import 'home_provider.dart'; // This should contain HomeState, HomeStatus, Transaction, etc.

import 'repositories/assets_repository.dart';

class HomeController extends StateNotifier<HomeState> {
  final Ref ref;
  final String userId;
  late final AssetsRepository _assetsRepository;
  
  HomeController(this.ref, this.userId) : super(HomeState()) {
    _assetsRepository = ref.read(assetsRepositoryProvider);
    _initializeHome();
  }
  
  Future<void> _initializeHome() async {
    await Future.wait([
      loadHomeData(),
      loadAssets(), 
    ]);
    _setupNotificationListener();
  }

  // Assets Methods
  Future<void> loadAssets() async {
    print('🔄 loadAssets() called');
    state = state.copyWith(isLoadingAssets: true, assetsError: null);
    
    try {
      final assets = await _assetsRepository.getAssets();
      print('✅ Assets received from repository: $assets');
      print('✅ walletBalance: ${assets.walletBalance}');
      
      state = state.copyWith(
        assets: assets,
        isLoadingAssets: false,
        assetsError: null,
      );
      
      print('✅ State updated. New assets: ${state.assets}');
      
    } catch (e) {
      print('❌ Error loading assets: $e');
      state = state.copyWith(
        isLoadingAssets: false,
        assetsError: e.toString(),
      );
    }
  }
  Future<void> refreshAssets() async {
    await loadAssets();
  }
  
  // Home Data Methods
  Future<void> loadHomeData({bool showLoading = true}) async {
    if (showLoading) {
      state = state.copyWith(status: HomeStatus.loading, assetsError: null);
    }
    
    try {
      // Simulate API calls - replace with actual repository calls
      await Future.delayed(const Duration(milliseconds: 800));
      
      // Mock data - replace with actual data from repository
      final mockBalance = 12456.78;
      final mockTransactions = _getMockTransactions();
      final mockQuickActions = _getMockQuickActions();
      final mockUserStats = _getMockUserStats();
      
      state = state.copyWith(
        status: HomeStatus.loaded,
        totalBalance: mockBalance,
        recentTransactions: mockTransactions,
        quickActions: mockQuickActions,
        userStats: mockUserStats,
        hasNotifications: true,
        unreadNotificationsCount: 3,
        errorMessage: null, assetsError: null,
      );
      
    } catch (e) {
      state = state.copyWith(
        status: HomeStatus.error,
        errorMessage: e.toString(), assetsError: null,
      );
    }
  }
  
  Future<void> refreshData() async {
    state = state.copyWith(status: HomeStatus.refreshing, assetsError: null);
    await loadHomeData(showLoading: false);
    await loadAssets(); // 👈 Also refresh assets
  }
  
  void _setupNotificationListener() {
    // Listen for real-time notifications (WebSocket, Firebase, etc.)
    // Update hasNotifications and unreadNotificationsCount
  }
  
  // MARK: - Actions
  Future<void> transferMoney({
    required String recipientId,
    required double amount,
    String? description,
  }) async {
    try {
      state = state.copyWith(status: HomeStatus.loading, assetsError: null);
      
      // Call transfer API
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Refresh data after transfer
      await loadHomeData(showLoading: false);
      await loadAssets(); // 👈 Also refresh assets
      
    } catch (e) {
      state = state.copyWith(
        status: HomeStatus.error,
        errorMessage: 'Transfer failed: ${e.toString()}', assetsError: null,
      );
    }
  }
  
  Future<void> markNotificationAsRead(String notificationId) async {
    final newCount = state.unreadNotificationsCount - 1;
    state = state.copyWith(
      unreadNotificationsCount: newCount,
      hasNotifications: newCount > 0, assetsError: null,
    );
  }
  
  Future<void> markAllNotificationsAsRead() async {
    state = state.copyWith(
      unreadNotificationsCount: 0,
      hasNotifications: false, assetsError: null,
    );
  }
  
  // MARK: - Mock Data Methods
  List<Transaction> _getMockTransactions() {
    return [
      Transaction(
        id: '1',
        title: 'Grocery Store',
        description: 'Weekly groceries',
        amount: 156.32,
        date: DateTime.now().subtract(const Duration(hours: 2)),
        type: TransactionType.debit,
        status: TransactionStatus.completed,
        category: 'shopping',
      ),
      // ... other transactions
    ];
  }
  
  List<QuickAction> _getMockQuickActions() {
    return [
      QuickAction(
        id: 'send',
        title: 'Send Money',
        icon: Icons.send,
        color: Colors.blue,
        route: '/send',
      ),
      // ... other actions
    ];
  }
  
  UserStats _getMockUserStats() {
    return UserStats(
      monthlySpending: 2456.78,
      monthlyIncome: 4500.00,
      totalTransactions: 42,
      activeCards: 2,
      savingsGoal: 10000.00,
      savingsProgress: 3500.00,
    );
  }
}
// ✅ Derived Providers - Fixed
final assetsProvider = Provider<AssetsResponse?>((ref) {
  return ref.watch(homeProvider).assets;
});

final isLoadingAssetsProvider = Provider<bool>((ref) {
  return ref.watch(homeProvider).isLoadingAssets;
});

final assetsErrorProvider = Provider<String?>((ref) {
  return ref.watch(homeProvider).assetsError;
});

final totalAmountProvider = Provider<String>((ref) {
  final assets = ref.watch(assetsProvider);
  if (assets == null) return '₦0.00';
  return '₦${assets.totalAmountNum.toStringAsFixed(2)}';
});

final totalPropertyAmountProvider = Provider<String>((ref) {
  final assets = ref.watch(assetsProvider);
  if (assets == null) return '₦0.00';
  return '₦${assets.totalPropertyAmountNum.toStringAsFixed(2)}';
});

final totalAssetsCountProvider = Provider<int>((ref) {
  final assets = ref.watch(assetsProvider);
  if (assets == null) return 0;
  return assets.totalAssetsNum.toInt();
});

// Optional: Raw string version
final totalAssetsRawProvider = Provider<String?>((ref) {
  return ref.watch(assetsProvider)?.totalAssets;
});