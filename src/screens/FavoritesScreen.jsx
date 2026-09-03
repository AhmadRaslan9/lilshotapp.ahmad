// src/screens/FavoritesScreen.js
import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/ui/EmptyState';
import { useFavorites } from '../context/FavoritesContext';
import { colors, radius, spacing, typography } from '../theme';

function toImageSource(image) {
  return typeof image === 'string' ? { uri: image } : image;
}

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={toImageSource(item.image)} style={styles.cardImage} contentFit="cover" />

      <View style={styles.cardDetails}>
        <Text style={styles.category}>{item.type}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => toggleFavorite(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="heart" size={22} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.itemCount}>{favorites.length} Saved</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="heart"
          title="No Favorites Yet"
          subtitle="Items you save will appear here for easy access."
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'android' ? spacing.md : 0,
    paddingBottom: spacing.lg,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: colors.textPrimary },
  itemCount: { ...typography.caption, color: colors.textSecondary },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: 120 },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md + 2,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: { width: 75, height: 75, borderRadius: 14, backgroundColor: colors.surfaceMuted },
  cardDetails: { flex: 1, marginLeft: spacing.md + 2 },
  category: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginVertical: 3 },
  price: { fontSize: 15, fontWeight: '800', color: colors.textPrimary },
  removeButton: { padding: spacing.sm },
});
