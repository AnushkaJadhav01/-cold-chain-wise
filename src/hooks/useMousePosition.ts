import { useEffect, useRef } from 'react';

export interface MousePosition {
  x: number;
  y: number;
}

/**
 * Returns a stable ref to the current mouse position.
 * Using a ref (not state) so canvas animation loops can read
 * `pos.current` without triggering re-renders every frame.
 */
export function useMousePosition(): React.RefObject<MousePosition> {
  const position = useRef<MousePosition>({ x: -9999, y: -9999 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return position;
}
