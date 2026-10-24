import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const AMPLITUDE = 24;

export default function BoardParallax() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const boards = [...document.querySelectorAll('.board-shell')];
    const triggers = boards.map((board) => {
      const trigger =
        board.closest('.piece-card') ||
        board.closest('.guide-diagram') ||
        board.closest('.learn') ||
        board;

      return ScrollTrigger.create({
        trigger,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const offset = (self.progress - 0.5) * AMPLITUDE;
          board.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
        },
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      boards.forEach((board) => {
        board.style.transform = '';
      });
    };
  }, []);

  return null;
}
