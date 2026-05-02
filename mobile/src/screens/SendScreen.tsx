import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SMS from 'expo-sms';
import { generatePaymentToken, encryptData, createSignature } from 'offlinepay-core';
import { Shield, Send, ArrowRight } from 'lucide-react-native';

const SendScreen = () => {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSend = async () => {
    // 1. Native Biometric Auth
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert('Error', 'Biometric hardware not found');
      return;
    }

    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authorize Offline Payment',
      fallbackLabel: 'Use PIN',
    });

    if (!auth.success) return;

    setIsProcessing(true);

    // 2. Generate Token using Core Logic
    const token = generatePaymentToken('user_native_1', receiver, parseFloat(amount), 'native_device_id');
    const signature = createSignature(token);
    const encrypted = encryptData(token, '123456'); // Mock PIN for demo
    
    const payload = JSON.stringify({ encrypted, signature });

    // 3. Native SMS Fallback
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      await SMS.sendSMSAsync(
        [],
        `OfflinePay Token: ${payload.substring(0, 100)}...`
      );
    } else {
      Alert.alert('Success', 'Offline token generated! Scan QR now.');
    }

    setIsProcessing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SECURE SEND</Text>
      
      <View style={styles.inputCard}>
        <Text style={styles.label}>RECIPIENT UPI</Text>
        <TextInput 
          style={styles.input}
          placeholder="upi@identifier"
          placeholderTextColor="#64748b"
          value={receiver}
          onChangeText={setReceiver}
        />
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>AMOUNT (₹)</Text>
        <TextInput 
          style={styles.amountInput}
          placeholder="0"
          placeholderTextColor="rgba(255,255,255,0.1)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <TouchableOpacity 
        style={styles.sendButton}
        onPress={handleSend}
        disabled={isProcessing}
      >
        <Text style={styles.sendButtonText}>{isProcessing ? 'LOCKING VAULT...' : 'AUTHORIZE PROTOCOL'}</Text>
        <ArrowRight color="#0a0f1e" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    marginBottom: 32,
    letterSpacing: -1,
  },
  inputCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  label: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  amountInput: {
    color: 'white',
    fontSize: 48,
    fontWeight: '900',
  },
  sendButton: {
    backgroundColor: '#00f5ff',
    height: 64,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  sendButtonText: {
    color: '#0a0f1e',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginRight: 8,
  }
});

export default SendScreen;
