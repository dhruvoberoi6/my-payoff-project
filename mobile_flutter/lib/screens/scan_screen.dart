import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:provider/provider.dart';
import '../core/wallet_provider.dart';
import '../core/crypto_engine.dart';
import 'dart:convert';

class ScanScreen extends StatefulWidget {
  @override
  _ScanScreenState createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  bool isScanning = true;
  String? result;

  void _onDetect(BarcodeCapture capture) async {
    if (!isScanning) return;
    
    final List<Barcode> barcodes = capture.barcodes;
    if (barcodes.isNotEmpty) {
      setState(() {
        isScanning = false;
        result = barcodes.first.rawValue;
      });

      _processToken(barcodes.first.rawValue!);
    }
  }

  void _processToken(String token) {
    try {
      // In a real app, you'd show a PIN prompt here to decrypt
      // For demo, we'll assume the PIN is known or the token is raw JSON for now
      // Let's assume the sender sent a JSON string for simplicity in the demo
      final data = jsonDecode(token);
      
      final txn = Transaction(
        id: data['txnId'],
        amount: data['amount'].toDouble(),
        type: 'RECEIVE',
        status: 'PENDING',
        timestamp: DateTime.now(),
        recipient: 'You',
      );

      Provider.of<WalletProvider>(context, listen: false).addTransaction(txn);
      
      _showSuccessDialog(data['amount'].toDouble());
    } catch (e) {
      _showErrorDialog("Invalid or Corrupt Token");
    }
  }

  void _showSuccessDialog(double amount) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        backgroundColor: Color(0xFF1A1F2E),
        title: Icon(LucideIcons.checkCircle2, color: Color(0xFF00F5FF), size: 48),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text("TOKEN VERIFIED", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text("₹$amount successfully authorized", style: TextStyle(color: Colors.grey, fontSize: 12)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: Text("DONE", style: TextStyle(color: Color(0xFF00F5FF))),
          ),
        ],
      ),
    );
  }

  void _showErrorDialog(String msg) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Color(0xFF1A1F2E),
        title: Icon(LucideIcons.alertCircle, color: Colors.red, size: 48),
        content: Text(msg, style: TextStyle(color: Colors.white)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text("RETRY"),
          ),
        ],
      ),
    ).then((_) => setState(() => isScanning = true));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0A0F1E),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: Text("SCAN TOKEN", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 2)),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          MobileScanner(
            onDetect: _onDetect,
          ),
          _buildOverlay(),
        ],
      ),
    );
  }

  Widget _buildOverlay() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 250,
            height: 250,
            decoration: BoxDecoration(
              border: Border.all(color: Color(0xFF00F5FF).withOpacity(0.5), width: 2),
              borderRadius: BorderRadius.circular(24),
            ),
            child: Stack(
              children: [
                _buildCorner(0, 0),
                _buildCorner(0, 1),
                _buildCorner(1, 0),
                _buildCorner(1, 1),
              ],
            ),
          ),
          SizedBox(height: 40),
          Text(
            "ALIGN QR CODE WITHIN FRAME",
            style: TextStyle(color: Colors.white.withOpacity(0.5), fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5),
          ),
        ],
      ),
    );
  }

  Widget _buildCorner(double top, double left) {
    return Positioned(
      top: top == 0 ? -2 : null,
      bottom: top == 1 ? -2 : null,
      left: left == 0 ? -2 : null,
      right: left == 1 ? -2 : null,
      child: Container(
        width: 30,
        height: 30,
        decoration: BoxDecoration(
          color: Colors.transparent,
          border: Border(
            top: top == 0 ? BorderSide(color: Color(0xFF00F5FF), width: 4) : BorderSide.none,
            bottom: top == 1 ? BorderSide(color: Color(0xFF00F5FF), width: 4) : BorderSide.none,
            left: left == 0 ? BorderSide(color: Color(0xFF00F5FF), width: 4) : BorderSide.none,
            right: left == 1 ? BorderSide(color: Color(0xFF00F5FF), width: 4) : BorderSide.none,
          ),
        ),
      ),
    );
  }
}
