import React, { createContext, useContext } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

// Specify that the context will hold a SharedValue<number> or null
const ScrollContext = createContext<SharedValue<number> | null>(null);

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const scrollY = useSharedValue(0);
  
  return (
    <ScrollContext.Provider value={scrollY}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === null) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};