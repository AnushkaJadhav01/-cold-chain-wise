import { useState, useEffect, useRef } from 'react';

const SCRAMBLE_CHARS = '0123456789';

/**
 * Animates a number from 0 to `target` with a char-scramble effect:
 * first 55% of the animation shows random digits, then the number
 * counts up to the real value (ease-out cubic).
 */
export function useCountUp(
  target: number,
  decimals = 0,
  duration = 2200,
  trigger = true,
): string {
  const [display, setDisplay] = useState<string>('—');
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    let startTime: number | null = null;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      const targetStr = target.toFixed(decimals);

      if (progress < 0.55) {
        // Scramble: each digit becomes a random char
        const settled = Math.floor((progress / 0.55) * targetStr.length);
        const scrambled = targetStr
          .split('')
          .map((char, i) => {
            if (!/\d/.test(char)) return char; // keep punctuation
            if (i < settled) return char;       // settled digits show real value
            return SCRAMBLE_CHARS[Math.floor(Math.random() * 10)];
          })
          .join('');
        setDisplay(scrambled);
      } else {
        setDisplay((eased * target).toFixed(decimals));
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, decimals, duration, trigger]);

  return display;
}
