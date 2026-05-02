import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { calculateTrustScore } from 'offlinepay-core';
import { Wallet, Shield, Award, ChevronRight } from 'lucide-react-native';

const DashboardScreen = () => {
  const [balance, setBalance] = useState(10000);
  const [trustData, setTrustData] = useState<any>(null);

  useEffect(() => {
    // Example: calculate trust score using core logic
    const result = calculateTrustScore([], 0);
    setTrustData(result);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>U</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Authorized User</Text>
              <View style={styles.statusBadge}>
                <Shield size={10} color="#00f5ff" />
                <Text style={styles.statusText}>SECURED OFFLINE</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>SECURE VAULT BALANCE</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.balance}>{balance.toLocaleString()}</Text>
          </View>
          <View style={styles.encryptionBadge}>
            <Shield size={12} color="#64748b" />
            <Text style={styles.encryptionText}>PROTOCOL: AES-256-GCM</Text>
          </View>
        </View>

        {trustData && (
          <TouchableOpacity style={styles.trustCard}>
            <View style={styles.trustHeader}>
              <Award color="#00f5ff" size={24} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.trustLabel}>TRUST SCORE</Text>
                <Text style={styles.trustValue}>{Math.round(trustData.score)}</Text>
              </View>
            </View>
            <ChevronRight color="#64748b" size={20} />
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>NATIVE PROTOCOLS</Text>
        <View style={styles.protocolGrid}>
            <TouchableOpacity style={styles.protocolItem}>
                <Text style={styles.protocolText}>BLE SYNC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.protocolItem}>
                <Text style={styles.protocolText}>NFC PAY</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00f5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#0a0f1e',
    fontWeight: '900',
    fontSize: 20,
  },
  greeting: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '900',
    marginLeft: 4,
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.1)',
    marginBottom: 24,
  },
  balanceLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 12,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    color: '#00f5ff',
    fontSize: 24,
    fontWeight: '900',
    marginRight: 8,
    opacity: 0.5,
  },
  balance: {
    color: 'white',
    fontSize: 48,
    fontWeight: '900',
  },
  encryptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  encryptionText: {
    color: '#64748b',
    fontSize: 8,
    fontWeight: '900',
    marginLeft: 6,
  },
  trustCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
  },
  trustValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  protocolGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  protocolItem: {
    flex: 1,
    backgroundColor: 'rgba(0,245,255,0.05)',
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,245,255,0.1)',
  },
  protocolText: {
    color: '#00f5ff',
    fontSize: 12,
    fontWeight: '900',
  }
});

export default DashboardScreen;
