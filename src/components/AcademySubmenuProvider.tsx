"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface AcademySubmenuContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const AcademySubmenuContext = createContext<AcademySubmenuContextType | undefined>(undefined);

export function useAcademySubmenu() {
  const context = useContext(AcademySubmenuContext);
  if (context === undefined) {
    throw new Error('useAcademySubmenu must be used within an AcademySubmenuProvider');
  }
  return context;
}

interface AcademySubmenuProviderProps {
  children: ReactNode;
}

export function AcademySubmenuProvider({ children }: AcademySubmenuProviderProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <AcademySubmenuContext.Provider value={{ isOpen, toggle, open, close }}>
      <div className={isOpen ? 'academy-submenu-open' : 'academy-submenu-closed'}>
        {children}
      </div>
    </AcademySubmenuContext.Provider>
  );
}
