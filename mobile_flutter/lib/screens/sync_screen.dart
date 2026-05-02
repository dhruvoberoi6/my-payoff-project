import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../core/wallet_provider.dart';
import 'package:flutter_animate/flutter_animate.dart';

class SyncScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final wallet = Provider.of<WalletProvider>(context);

    return Scaffold(
      backgroundColor: Color(0xFF0A0F1E),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text("SYNC ENGINE", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 2)),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            _buildStatusCard(wallet),
            SizedBox(height: 32),
            Expanded(child: _buildTransactionList(wallet)),
            SizedBox(height: 24),
            _buildSyncButton(wallet),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard(WalletProvider wallet) {
    return Container(
      padding: EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.03),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          Icon(
            wallet.isSyncing ? LucideIcons.refreshCcw : LucideIcons.cloudLightning,
            color: wallet.isSyncing ? Color(0xFF00F5FF) : Colors.amber,
            size: 48,
          ).animate(onPlay: (c) => wallet.isSyncing ? c.repeat() : c.stop()).rotate(duration: 1.seconds),
          SizedBox(height: 16),
          Text(
            wallet.isSyncing ? "SYNCHRONIZING..." : "OPTIMISTIC STATE",
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16),
          ),
          SizedBox(height: 8),
          Text(
            "Local ledger has ${wallet.transactions.where((t) => t.status == 'PENDING').length} pending settlements",
            style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionList(WalletProvider wallet) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "RECENT ACTIVITY",
          style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5),
        ),
        SizedBox(height: 16),
        Expanded(
          child: ListView.builder(
            itemCount: wallet.transactions.length,
            itemBuilder: (context, index) {
              final txn = wallet.transactions[index];
              return Container(
                margin: EdgeInsets.only(bottom: 12),
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.02),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Icon(
                      txn.type == 'SEND' ? LucideIcons.arrowUpRight : LucideIcons.arrowDownLeft,
                      color: txn.type == 'SEND' ? Colors.redAccent : Colors.greenAccent,
                      size: 20,
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            txn.recipient,
                            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          Text(
                            txn.id,
                            style: TextStyle(color: Colors.grey, fontSize: 8, fontFamily: 'monospace'),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          "${txn.type == 'SEND' ? '-' : '+'}₹${txn.amount}",
                          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900),
                        ),
                        Text(
                          txn.status,
                          style: TextStyle(
                            color: txn.status == 'COMPLETED' ? Colors.greenAccent : Colors.amber,
                            fontSize: 8,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildSyncButton(WalletProvider wallet) {
    return ElevatedButton(
      onPressed: wallet.isSyncing ? null : () => wallet.performSync(),
      style: ElevatedButton.styleFrom(
        backgroundColor: Color(0xFF00F5FF).withOpacity(0.1),
        foregroundColor: Color(0xFF00F5FF),
        minimumSize: Size(double.infinity, 64),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: Color(0xFF00F5FF).withOpacity(0.3)),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          if (wallet.isSyncing)
            Padding(
              padding: const EdgeInsets.right(12.0),
              child: SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Color(0xFF00F5FF)))),
            ),
          Text(
            wallet.isSyncing ? "UPLINK ACTIVE" : "TRIGGER MANUAL SYNC",
            style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.2),
          ),
        ],
      ),
    );
  }
}
