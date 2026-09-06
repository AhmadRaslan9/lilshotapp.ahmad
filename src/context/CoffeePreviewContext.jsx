import React, { createContext, useContext, useState } from 'react';
const Context = createContext(null);
// UI-only sample interactions, scoped to the signed-in user's mounted session.
export function CoffeePreviewProvider({ children }) {
  const [saved, setSaved] = useState([]);
  const [liked, setLiked] = useState([]);
  const [requested, setRequested] = useState([]);
  const toggle = (setter, id) => setter(items => items.includes(id) ? items.filter(x => x !== id) : [...items, id]);
  return <Context.Provider value={{ saved, liked, requested,
    toggleSaved: id => toggle(setSaved, id), toggleLiked: id => toggle(setLiked, id),
    toggleRequest: id => toggle(setRequested, id) }}>{children}</Context.Provider>;
}
export const useCoffeePreview = () => useContext(Context);
