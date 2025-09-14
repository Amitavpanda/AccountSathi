'use client';

import React, { useContext, useRef, useState } from 'react';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';
import { StyledJsxContext } from './providers';

export default function StyledJsxRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  return (
    <StyleRegistry registry={jsxStyleRegistry}>
      {children}
    </StyleRegistry>
  );
}
