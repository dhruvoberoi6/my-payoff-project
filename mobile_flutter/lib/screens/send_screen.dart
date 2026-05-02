import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:glass_kit/glass_kit.dart';
import 'package:flutter_animate/flutter_animate.dart';

class SendScreen extends StatefulWidget {
  @override
  _SendScreenState createState() => _SendScreenState();
}

class _SendScreenState extends State<SendScreen> {
  int step = 1; // 1: Input, 2: PIN, 3: Success
  String amount = "";
  String pin = "";

  void _onNumberClick(String num) {
    setState(() {
      if (step == 1) {
        amount += num;
      } else if (step == 2 && pin.length < 6) {
        pin += num;
        if (pin.length == 6) {
          step = 3; // Mocking success
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF0A0F1E),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(LucideIcons.chevronLeft, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "SEND PAYMENT",
          style: TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.w900,
            letterSpacing: 2.0,
          ),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          children: [
            if (step == 1) _buildInputStep(),
            if (step == 2) _buildPinStep(),
            if (step == 3) _buildSuccessStep(),
          ],
        ),
      ),
    );
  }

  Widget _buildInputStep() {
    return Column(
      children: [
        SizedBox(height: 40),
        Text(
          "AMOUNT",
          style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w900),
        ),
        SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text("₹", style: TextStyle(color: Color(0xFF00F5FF), fontSize: 32, fontWeight: FontWeight.w900)),
            SizedBox(width: 12),
            Text(
              amount.isEmpty ? "0" : amount,
              style: TextStyle(color: Colors.white, fontSize: 64, fontWeight: FontWeight.w900),
            ),
          ],
        ),
        SizedBox(height: 40),
        _buildNumpad(),
        Spacer(),
        ElevatedButton(
          onPressed: amount.isEmpty ? null : () => setState(() => step = 2),
          style: ElevatedButton.styleFrom(
            backgroundColor: Color(0xFF00F5FF),
            foregroundColor: Color(0xFF0A0F1E),
            minimumSize: Size(double.infinity, 64),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          ),
          child: Text("CONTINUE", style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 1.5)),
        ),
      ],
    );
  }

  Widget _buildPinStep() {
    return Column(
      children: [
        SizedBox(height: 40),
        Text(
          "VAULT AUTHORIZATION",
          style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900),
        ),
        SizedBox(height: 8),
        Text(
          "ENTER 6-DIGIT PIN",
          style: TextStyle(color: Colors.grey, fontSize: 10, fontWeight: FontWeight.w900),
        ),
        SizedBox(height: 40),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(6, (index) {
            bool isFilled = pin.length > index;
            return Container(
              width: 16,
              height: 16,
              margin: EdgeInsets.symmetric(horizontal: 8),
              decoration: BoxDecoration(
                color: isFilled ? Color(0xFF00F5FF) : Colors.white.withOpacity(0.1),
                shape: BoxShape.circle,
                boxShadow: isFilled ? [BoxShadow(color: Color(0xFF00F5FF).withOpacity(0.5), blurRadius: 10)] : [],
              ),
            );
          }),
        ),
        SizedBox(height: 60),
        _buildNumpad(),
      ],
    ).animate().fadeIn();
  }

  Widget _buildSuccessStep() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.checkCircle2, color: Color(0xFF00F5FF), size: 100),
          SizedBox(height: 24),
          Text(
            "PAYMENT AUTHORIZED",
            style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900),
          ),
          SizedBox(height: 8),
          Text(
            "OFFLINE TOKEN GENERATED",
            style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w900),
          ),
          SizedBox(height: 40),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white.withOpacity(0.05),
              minimumSize: Size(double.infinity, 64),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Text("BACK TO DASHBOARD", style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    ).animate().scale();
  }

  Widget _buildNumpad() {
    return GridView.builder(
      shrinkWrap: true,
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        childAspectRatio: 1.5,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: 12,
      itemBuilder: (context, index) {
        String label = "";
        if (index < 9) label = (index + 1).toString();
        if (index == 9) return Container();
        if (index == 10) label = "0";
        if (index == 11) return IconButton(
          icon: Icon(LucideIcons.delete, color: Colors.grey),
          onPressed: () {
            setState(() {
              if (step == 1 && amount.isNotEmpty) amount = amount.substring(0, amount.length - 1);
              if (step == 2 && pin.isNotEmpty) pin = pin.substring(0, pin.length - 1);
            });
          },
        );

        return GlassContainer.clearGlass(
          borderRadius: BorderRadius.circular(16),
          child: InkWell(
            onTap: () => _onNumberClick(label),
            child: Center(
              child: Text(
                label,
                style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900),
              ),
            ),
          ),
        );
      },
    );
  }
}
