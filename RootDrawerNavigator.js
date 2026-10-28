import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { BottomTabNavigator } from './BottomTabNavigator';
import { CustomDrawerContent } from './CustomDrawerContent';
import { useDrawer } from './DrawerContext';

export const RootDrawerNavigator = () => {
  const { isOpen, closeDrawer, slideAnim, fadeAnim, drawerWidth } = useDrawer();

  return (
    <View style={styles.container}>
      {/* Bottom Tabs Screen Container */}
      <BottomTabNavigator />

      {/* Dimmed Backdrop Overlay when Drawer is Open */}
      {isOpen && (
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeDrawer}
            accessibilityLabel="Close navigation drawer"
          />
        </Animated.View>
      )}

      {/* Sliding Navigation Drawer Panel */}
      <Animated.View
        style={[
          styles.drawerPanel,
          {
            width: drawerWidth,
            transform: [{ translateX: slideAnim }],
          },
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <CustomDrawerContent />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    zIndex: 998,
  },
  drawerPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 999,
    shadowColor: '#0F172A',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
});
