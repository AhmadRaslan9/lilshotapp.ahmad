// src/components/TourCard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Badge from './ui/Badge';
import { useFavorites } from '../context/FavoritesContext';
import { colors, radius, spacing, typography } from '../theme';

const TourCard = React.memo(function TourCard({ item }) {
  const [imageFailed, setImageFailed] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const favored = isFavorite(item.id);

  return (
    <View style={styles.container}>
      {!imageFailed ? (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Ionicons name="image-outline" size={32} color={colors.textSecondary} />
        </View>
      )}

      <Badge label={item.tag} style={styles.tag} />

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite({ id: item.id, type: 'tour', title: item.title, price: item.price, image: item.image })}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={favored ? 'heart' : 'heart-outline'}
          size={20}
          color={favored ? colors.danger : colors.textPrimary}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.price}>from {item.price}</Text>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
      </View>
    </View>
  );
});

export default TourCard;

const styles = StyleSheet.create({
  container: {
    height: 380,
    borderRadius: radius.xxxl,
    overflow: 'hidden',
    marginBottom: spacing.xl,
    backgroundColor: colors.surfaceMuted,
    position: 'relative',
  },
  image: { width: '100%', height: '100%', position: 'absolute' },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  tag: { position: 'absolute', top: spacing.lg, left: spacing.lg },
  favoriteButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.overlay,
  },
  title: { ...typography.h3, color: colors.textOnDark, marginBottom: spacing.xs },
  subtitle: { fontSize: 13, color: colors.textOnDarkMuted },
  priceBlock: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '700', color: colors.textOnDark },
  duration: { fontSize: 12, color: colors.textOnDarkMuted },
});
