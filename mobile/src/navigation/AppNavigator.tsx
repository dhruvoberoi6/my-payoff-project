import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { LayoutDashboard, Send, Scan, RefreshCw } from 'lucide-react-native';

import DashboardScreen from '../screens/DashboardScreen';
import SendScreen from '../screens/SendScreen';
import ScanScreen from '../screens/ScanScreen';
import SyncScreen from '../screens/SyncScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0a0f1e', borderTopWidth: 0 },
        tabBarActiveTintColor: '#00f5ff',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Send" 
        component={SendScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Send color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Scan" 
        component={ScanScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Scan color={color} size={size} /> }}
      />
      <Tab.Screen 
        name="Sync" 
        component={SyncScreen} 
        options={{ tabBarIcon: ({ color, size }) => <RefreshCw color={color} size={size} /> }}
      />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
