import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';

export function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' }
    );
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
