import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'core/wallet_provider.dart';
import 'screens/dashboard_screen.dart';
import 'screens/send_screen.dart';
import 'screens/scan_screen.dart';
import 'screens/sync_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    statusBarColor: Colors.transparent,
    statusBarIconBrightness: Brightness.light,
  ));
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WalletProvider()),
      ],
      child: OfflinePayApp(),
    ),
  );
}

class OfflinePayApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'OfflinePay',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: Color(0xFF00F5FF),
        scaffoldBackgroundColor: Color(0xFF0A0F1E),
        fontFamily: 'Roboto',
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => DashboardScreen(),
        '/send': (context) => SendScreen(),
        '/scan': (context) => ScanScreen(),
        '/sync': (context) => SyncScreen(),
      },
    );
  }
}
