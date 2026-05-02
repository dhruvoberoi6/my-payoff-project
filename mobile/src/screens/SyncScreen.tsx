import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RefreshCw, Wifi, WifiOff, CheckCircle2 } from 'lucide-react-native';

const SyncScreen = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'SYNCING' | 'COMPLETED'>('IDLE');

  const runSync = async () => {
    setIsSyncing(true);
    setStatus('SYNCING');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsSyncing(false);
    setStatus('COMPLETED');
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusIconContainer}>
        {status === 'SYNCING' ? (
          <ActivityIndicator size="large" color="#00f5ff" />
        ) : status === 'COMPLETED' ? (
          <CheckCircle2 size={64} color="#22c55e" />
        ) : (
          <RefreshCw size={64} color="#64748b" />
        )}
      </View>

      <Text style={styles.title}>
        {status === 'SYNCING' ? 'SYNCHRONIZING VAULT' : 
         status === 'COMPLETED' ? 'SYNC SUCCESSFUL' : 'READY TO SYNC'}
      </Text>
      
      <Text style={styles.subtitle}>
        {status === 'SYNCING' ? 'UPDATING LOCAL LEDGER WITH NETWORK' : 
         status === 'COMPLETED' ? 'ALL PENDING TRANSACTIONS SETTLED' : '3 PENDING TRANSACTIONS FOUND'}
      </Text>

      <TouchableOpacity 
        style={[styles.syncButton, status === 'SYNCING' && styles.disabledButton]}
        onPress={runSync}
        disabled={status === 'SYNCING'}
      >
        <Text style={styles.syncButtonText}>
            {status === 'COMPLETED' ? 'SYNC AGAIN' : 'FORCE SYNC NOW'}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Wifi color="#22c55e" size={16} />
        <Text style={styles.infoText}>UPLINK STATUS: CONNECTED</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1e',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: 1,
  },
  syncButton: {
    backgroundColor: '#00f5ff',
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 32,
    marginBottom: 32,
  },
  syncButtonText: {
    color: '#0a0f1e',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  disabledButton: {
    opacity: 0.5,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,197,94,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoText: {
    color: '#22c55e',
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 8,
  }
});

export default SyncScreen;
