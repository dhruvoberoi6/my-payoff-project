import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class Transaction {
  final String id;
  final double amount;
  final String type; // SEND, RECEIVE
  final String status; // PENDING, COMPLETED
  final DateTime timestamp;
  final String recipient;

  Transaction({
    required this.id,
    required this.amount,
    required this.type,
    required this.status,
    required this.timestamp,
    required this.recipient,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'amount': amount,
    'type': type,
    'status': status,
    'timestamp': timestamp.toIso8601String(),
    'recipient': recipient,
  };

  factory Transaction.fromJson(Map<String, dynamic> json) => Transaction(
    id: json['id'],
    amount: json['amount'],
    type: json['type'],
    status: json['status'],
    timestamp: DateTime.parse(json['timestamp']),
    recipient: json['recipient'],
  );
}

class WalletProvider with ChangeNotifier {
  double _balance = 10000.0;
  double _trustScore = 85.0;
  List<Transaction> _transactions = [];
  bool _isSyncing = false;

  double get balance => _balance;
  double get trustScore => _trustScore;
  List<Transaction> get transactions => _transactions;
  bool get isSyncing => _isSyncing;

  WalletProvider() {
    _loadData();
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    _balance = prefs.getDouble('balance') ?? 10000.0;
    _trustScore = prefs.getDouble('trustScore') ?? 85.0;
    
    final String? txnsJson = prefs.getString('transactions');
    if (txnsJson != null) {
      final List<dynamic> decoded = jsonDecode(txnsJson);
      _transactions = decoded.map((item) => Transaction.fromJson(item)).toList();
    }
    notifyListeners();
  }

  Future<void> _saveData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('balance', _balance);
    await prefs.setDouble('trustScore', _trustScore);
    await prefs.setString('transactions', jsonEncode(_transactions.map((e) => e.toJson()).toList()));
  }

  Future<void> addTransaction(Transaction txn) async {
    _transactions.insert(0, txn);
    if (txn.type == 'SEND') {
      _balance -= txn.amount;
    } else {
      _balance += txn.amount;
    }
    await _saveData();
    notifyListeners();
  }

  Future<void> performSync() async {
    _isSyncing = true;
    notifyListeners();
    
    // Simulate network delay
    await Future.delayed(Duration(seconds: 3));
    
    // Mark all pending as completed
    for (var i = 0; i < _transactions.length; i++) {
      if (_transactions[i].status == 'PENDING') {
        _transactions[i] = Transaction(
          id: _transactions[i].id,
          amount: _transactions[i].amount,
          type: _transactions[i].type,
          status: 'COMPLETED',
          timestamp: _transactions[i].timestamp,
          recipient: _transactions[i].recipient,
        );
      }
    }
    
    _isSyncing = false;
    await _saveData();
    notifyListeners();
  }
}
