import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:glass_kit/glass_kit.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:provider/provider.dart';
import '../core/wallet_provider.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final wallet = Provider.of<WalletProvider>(context);
    return Scaffold(
      backgroundColor: Color(0xFF0A0F1E),
      body: Container(
        decoration: BoxDecoration(
          gradient: RadialGradient(
            center: Alignment.topLeft,
            radius: 1.5,
            colors: [
              Color(0xFF00F5FF).withOpacity(0.05),
              Colors.transparent,
            ],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(),
                SizedBox(height: 40),
                _buildBalanceCard(wallet.balance),
                SizedBox(height: 40),
                _buildTrustScore(wallet.trustScore),
                SizedBox(height: 40),
                _buildQuickActions(context),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF00F5FF), Color(0xFF0066FF)],
                ),
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  "S",
                  style: TextStyle(
                    color: Color(0xFF0A0F1E),
                    fontWeight: FontWeight.w900,
                    fontSize: 20,
                  ),
                ),
              ),
            ),
            SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Saurabh",
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.white.withOpacity(0.1)),
                  ),
                  child: Row(
                    children: [
                      Icon(LucideIcons.lock, size: 8, color: Colors.grey),
                      SizedBox(width: 4),
                      Text(
                        "SECURED WITH PIN",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 7,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.2,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
        Icon(LucideIcons.logOut, color: Colors.grey, size: 20),
      ],
    );
  }

  Widget _buildBalanceCard(double balance) {
    return GlassContainer.clearGlass(
      height: 200,
      width: double.infinity,
      borderRadius: BorderRadius.circular(24),
      borderWidth: 1,
      borderColor: Colors.white.withOpacity(0.1),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            "SECURE VAULT BALANCE",
            style: TextStyle(
              color: Colors.grey,
              fontSize: 10,
              fontWeight: FontWeight.w900,
              letterSpacing: 2.0,
            ),
          ),
          SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "₹",
                style: TextStyle(
                  color: Color(0xFF00F5FF),
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                ),
              ),
              SizedBox(width: 8),
              Text(
                balance.toStringAsFixed(0),
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 56,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
          SizedBox(height: 24),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(LucideIcons.shield, size: 14, color: Color(0xFF00F5FF)),
                SizedBox(width: 8),
                Text(
                  "PROTOCOL ENCRYPTION: AES-256",
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 8,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 600.ms).scale(begin: Offset(0.9, 0.9));
  }

  Widget _buildTrustScore(double score) {
    return Column(
      children: [
        Center(
          child: Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 100,
                height: 100,
                child: CircularProgressIndicator(
                  value: score / 100,
                  strokeWidth: 8,
                  backgroundColor: Colors.white.withOpacity(0.05),
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF00F5FF)),
                ),
              ),
              Text(
                score.toInt().toString(),
                style: TextStyle(
                  color: Color(0xFF00F5FF),
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
        ),
        SizedBox(height: 12),
        Text(
          "TRUST SCORE",
          style: TextStyle(
            color: Colors.grey,
            fontSize: 10,
            fontWeight: FontWeight.w900,
            letterSpacing: 2.0,
          ),
        ),
      ],
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    final actions = [
      {'icon': LucideIcons.send, 'label': 'SEND', 'color': Color(0xFF00F5FF), 'route': '/send'},
      {'icon': LucideIcons.qrCode, 'label': 'SCAN', 'color': Colors.amber, 'route': '/scan'},
      {'icon': LucideIcons.refreshCcw, 'label': 'SYNC', 'color': Colors.green, 'route': '/sync'},
      {'icon': LucideIcons.history, 'label': 'LOGS', 'color': Colors.blue, 'route': '/sync'},
    ];

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: actions.map((action) {
        return GestureDetector(
          onTap: () => Navigator.pushNamed(context, action['route'] as String),
          child: Column(
            children: [
              GlassContainer.clearGlass(
                width: 64,
                height: 64,
                borderRadius: BorderRadius.circular(16),
                child: Icon(
                  action['icon'] as IconData,
                  color: action['color'] as Color,
                  size: 24,
                ),
              ),
              SizedBox(height: 8),
              Text(
                action['label'] as String,
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 8,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}
