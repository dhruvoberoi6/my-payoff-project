import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { decryptData, verifySignature } from 'offlinepay-core';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', color: 'white' }}>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const payload = JSON.parse(data);
      // Core Logic: Decrypt and Verify
      const decrypted = decryptData(payload.encrypted, '123456');
      const isValid = verifySignature(decrypted, payload.signature);

      if (isValid) {
        Alert.alert('Payment Received', `Successfully verified offline token for ₹${decrypted.amount}`);
      } else {
        Alert.alert('Security Alert', 'Signature verification failed. Potential tampering detected.');
      }
    } catch (e) {
      Alert.alert('Error', 'Invalid QR Code structure');
    }
    
    setTimeout(() => setScanned(false), 3000);
  };

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
            <View style={styles.scanTarget} />
            <Text style={styles.instructions}>ALIGN QR PROTOCOL WITHIN FRAME</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#0a0f1e',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,15,30,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTarget: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#00f5ff',
    borderRadius: 24,
    backgroundColor: 'transparent',
  },
  instructions: {
    color: '#00f5ff',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 24,
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#00f5ff',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  text: {
    color: '#0a0f1e',
    fontWeight: '900',
  }
});
