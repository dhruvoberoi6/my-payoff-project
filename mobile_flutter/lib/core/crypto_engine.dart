import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:encrypt/encrypt.dart' as encrypt;

class CryptoEngine {
  static const String systemSecret = "OFFLINEPAY_SECRET_2026_PROD";

  static String generateSignature(Map<String, dynamic> payload) {
    final body = jsonEncode(payload);
    final key = utf8.encode(systemSecret);
    final bytes = utf8.encode(body);

    final hmacSha256 = Hmac(sha256, key);
    final digest = hmacSha256.convert(bytes);

    return digest.toString();
  }

  static String encryptPayload(String payload, String pin) {
    // Derive key from PIN (in prod use PBKDF2)
    final keyString = sha256.convert(utf8.encode(pin)).toString().substring(0, 32);
    final key = encrypt.Key.fromUtf8(keyString);
    final iv = encrypt.IV.fromLength(16);

    final encrypter = encrypt.Encrypter(encrypt.AES(key));
    final encrypted = encrypter.encrypt(payload, iv: iv);

    return "${iv.base64}:${encrypted.base64}";
  }

  static String decryptPayload(String encryptedData, String pin) {
    final parts = encryptedData.split(':');
    final iv = encrypt.IV.fromBase64(parts[0]);
    final encryptedContent = parts[1];

    final keyString = sha256.convert(utf8.encode(pin)).toString().substring(0, 32);
    final key = encrypt.Key.fromUtf8(keyString);

    final encrypter = encrypt.Encrypter(encrypt.AES(key));
    final decrypted = encrypter.decrypt64(encryptedContent, iv: iv);

    return decrypted;
  }
}
