// src/context/FavoritesContext.js
//
// يوحّد حالة "المفضلة" بين شاشات الرئيسية والمتجر والمفضلة (في النسخة
// القديمة كانت كل شاشة تحتفظ بقائمة مفضلة منفصلة). عند تسجيل الدخول
// وربط Firestore تتزامن القائمة تلقائياً real-time، وإلا تبقى محلية
// لجلسة الاستخدام الحالية فقط.

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeToFavorites,
  addFavorite as addFavoriteRemote,
  removeFavorite as removeFavoriteRemote,
} from '../services/firebase/firestore';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [localFavorites, setLocalFavorites] = useState([]); // وضع الضيف / بدون Firebase
  const [remoteFavorites, setRemoteFavorites] = useState(null);

  useEffect(() => {
    if (!user) {
      setRemoteFavorites(null);
      return;
    }
    const unsubscribe = subscribeToFavorites(user.uid, setRemoteFavorites);
    return unsubscribe;
  }, [user]);

  const favorites = remoteFavorites ?? localFavorites;

  const isFavorite = useCallback(
    (id) => favorites.some((item) => item.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (item) => {
      const currentlyFav = favorites.some((f) => f.id === item.id);

      if (user) {
        if (currentlyFav) {
          await removeFavoriteRemote(user.uid, item.id);
        } else {
          await addFavoriteRemote(user.uid, item);
        }
        return;
      }

      setLocalFavorites((prev) =>
        currentlyFav ? prev.filter((f) => f.id !== item.id) : [...prev, item]
      );
    },
    [favorites, user]
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite }),
    [favorites, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}
