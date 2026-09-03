// src/components/ui/FormField.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../theme';

export default function FormField({
  label,
  icon,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  error,
  keyboardType,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.row, error && styles.rowError]}>
        {icon ? <Feather name={icon} size={20} color={colors.textOnDarkMuted} style={styles.icon} /> : null}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textOnDarkFaint}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          keyboardType={keyboardType}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: spacing.lg },
  label: {
    ...typography.overline,
    color: colors.textOnDarkMuted,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: colors.glassBorder,
    paddingBottom: spacing.sm + 2,
  },
  rowError: { borderBottomColor: colors.danger },
  icon: { marginRight: spacing.md },
  input: {
    flex: 1,
    fontSize: 17,
    color: colors.textOnDark,
    fontWeight: '500',
  },
  errorText: {
    color: '#FFB4AC',
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
