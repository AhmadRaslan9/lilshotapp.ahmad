// src/screens/ShopScreen.js
import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, ImageBackground, TouchableOpacity, TextInput, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import GlassCard from '../components/ui/GlassCard';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../data/mockProducts';
import { colors, radius, spacing, typography } from '../theme';

const backgroundImg = require('../../assets/CoffeeShop.png');

export default function ShopScreen() {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(
    () =>
      products.filter((item) => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
      }),
    [products, activeCategory, search]
  );

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImg} style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Explore Store</Text>
            <TouchableOpacity>
              <GlassCard tone="light" radius={radius.lg} style={styles.iconBlur}>
                <Feather name="shopping-bag" size={20} color={colors.textOnDark} />
              </GlassCard>
            </TouchableOpacity>
          </View>

          <View style={styles.searchWrapper}>
            <GlassCard tone="dark" intensity={55} radius={radius.lg} style={styles.searchGlass}>
              <Feather name="search" size={18} color={colors.textOnDarkMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor={colors.textOnDarkFaint}
                value={search}
                onChangeText={setSearch}
              />
            </GlassCard>
          </View>

          <View style={styles.categoriesContainer}>
            <FlatList
              horizontal
              data={CATEGORIES}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const isActive = activeCategory === item;
                return (
                  <TouchableOpacity onPress={() => setActiveCategory(item)}>
                    <GlassCard
                      tone={isActive ? 'light' : 'dark'}
                      intensity={isActive ? 80 : 40}
                      radius={radius.md}
                      style={[styles.categoryTab, isActive && styles.categoryTabActive]}
                    >
                      <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{item}</Text>
                    </GlassCard>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => <ProductCard item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    marginTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: spacing.lg,
  },
  headerTitle: { ...typography.h2, color: colors.textOnDark },
  iconBlur: { padding: spacing.md },
  searchWrapper: { paddingHorizontal: spacing.xxl, marginBottom: spacing.lg },
  searchGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? spacing.md : spacing.sm,
    gap: spacing.md,
  },
  searchInput: { flex: 1, color: colors.textOnDark, fontSize: 15 },
  categoriesContainer: { paddingLeft: spacing.xxl, marginBottom: spacing.lg },
  categoryTab: {
    paddingHorizontal: spacing.xl - 2,
    paddingVertical: spacing.md - 2,
    marginRight: spacing.md,
  },
  categoryTabActive: { borderColor: colors.glassBorderStrong },
  categoryText: { color: colors.textOnDarkMuted, fontWeight: '600', fontSize: 14 },
  categoryTextActive: { color: colors.textOnDark, fontWeight: '800' },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
});
