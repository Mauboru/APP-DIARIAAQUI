import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ title, onBack, showBackButton = true }) {
  const { theme, isDarkTheme, toggleTheme } = useTheme(); 

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      {showBackButton && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <View style={styles.rightActions}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          <Icon
            name={isDarkTheme ? 'sunny' : 'moon'}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.userIcon}>
          <Icon name="person-circle" size={30} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginRight: 10,
    padding: 5,
  },
  userIcon: {
    padding: 5,
  },
});