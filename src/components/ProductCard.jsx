// src/components/ProductCard.js
import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import GlassCard from './ui/GlassCard';
import { useFavorites } from '../context/FavoritesContext';
import { colors, radius, spacing, typography } from '../theme';

export default function ProductCard({ item, onAdd }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favored = isFavorite(item.id);

  return (
    <View style={styles.container}>
      <GlassCard tone="dark" radius={radius.xl} style={styles.card}>
        <ImageBackground source={item.image} style={styles.image} imageStyle={styles.imageInner}>
          <TouchableOpacity
            style={styles.favButton}
            onPress={() => toggleFavorite({ id: item.id, type: 'product', title: item.title, price: item.price, image: item.image })}
          >
            <GlassCard tone="light" radius={radius.md} style={styles.iconBlur}>
              <Feather name="heart" size={16} color={favored ? colors.danger : colors.textOnDark} />
            </GlassCard>
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.footer}>
            <Text style={styles.price}>{item.price}</Text>
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
              <GlassCard tone="light" radius={radius.md} style={styles.iconBlur}>
                <Feather name="plus" size={18} color={colors.textOnDark} />
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, margin: spacing.sm },
  card: { padding: spacing.md },
  image: { height: 120, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-end', padding: spacing.sm },
  imageInner: { borderRadius: radius.lg },
  favButton: { borderRadius: radius.md, overflow: 'hidden' },
  iconBlur: { padding: spacing.sm },
  content: { marginTop: spacing.md },
  category: { fontSize: 10, color: colors.textOnDarkMuted, textTransform: 'uppercase', letterSpacing: 0.8 },
  title: { ...typography.title, color: colors.textOnDark, marginVertical: spacing.xs },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs },
  price: { fontSize: 16, fontWeight: '800', color: colors.textOnDark },
  addButton: { borderRadius: radius.md, overflow: 'hidden' },
});
