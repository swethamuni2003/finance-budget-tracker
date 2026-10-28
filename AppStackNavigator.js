import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootDrawerNavigator } from './RootDrawerNavigator';
import { CategoryDetailsScreen } from '../screens/CategoryDetailsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { AddTransactionModal } from '../screens/AddTransactionModal';
import { AlertsHistoryModal } from '../screens/AlertsHistoryModal';
import { AuthScreen } from '../screens/AuthScreen';

const Stack = createNativeStackNavigator();

export const AppStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Root Drawer with Tabs inside */}
      <Stack.Screen name="MainDrawer" component={RootDrawerNavigator} />

      {/* Drill-down Screens (Stack Navigation) */}
      <Stack.Screen
        name="CategoryDetails"
        component={CategoryDetailsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionModal}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="AlertsHistory"
        component={AlertsHistoryModal}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
};

