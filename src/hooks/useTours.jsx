// src/hooks/useTours.js
import { useEffect, useState } from 'react';
import { fetchTours } from '../services/firebase/firestore';
import { MOCK_TOURS } from '../data/mockTours';

export function useTours() {
  const [tours, setTours] = useState(MOCK_TOURS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchTours()
      .then((remote) => {
        if (isMounted && remote && remote.length) setTours(remote);
      })
      .catch(() => {
        // تجاهل الخطأ والبقاء على البيانات المحلية
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { tours, loading };
}
