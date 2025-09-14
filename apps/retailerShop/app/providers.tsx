'use client';

import { createContext } from 'react';

// Create a context with a default value
export const StyledJsxContext = createContext({});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledJsxContext.Provider value={{}}>
      {children}
    </StyledJsxContext.Provider>
  );
}
