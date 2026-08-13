"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [activeSkill, setActiveSkill] = useState(null);
  const [highlightedProjectId, setHighlightedProjectId] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const highlightTimeout = useRef(null);

  const toggleSkill = useCallback((label) => {
    setActiveSkill((current) => (current === label ? null : label));
  }, []);

  const clearSkill = useCallback(() => setActiveSkill(null), []);

  const highlightProject = useCallback((id) => {
    setHighlightedProjectId(id);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    highlightTimeout.current = setTimeout(() => setHighlightedProjectId(null), 1800);
  }, []);

  const togglePalette = useCallback(() => setPaletteOpen((o) => !o), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const openPalette = useCallback(() => setPaletteOpen(true), []);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  return (
    <FilterContext.Provider
      value={{
        activeSkill,
        toggleSkill,
        clearSkill,
        highlightedProjectId,
        highlightProject,
        paletteOpen,
        togglePalette,
        closePalette,
        openPalette,
        contactOpen,
        openContact,
        closeContact,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within a FilterProvider");
  return ctx;
}
