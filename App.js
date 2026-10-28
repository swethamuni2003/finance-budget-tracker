import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { FinanceProvider } from './src/context/FinanceContext';
import { DrawerProvider } from './src/navigation/DrawerContext';
import { AppStackNavigator } from './src/navigation/AppStackNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <FinanceProvider>
          <DrawerProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
              <AppStackNavigator />
            </NavigationContainer>
          </DrawerProvider>
        </FinanceProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
