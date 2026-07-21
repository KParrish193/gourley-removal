"use client";

import { useEffect, useRef } from "react";
import styles from "./parallax.module.css";

type ParallaxProps = {
  children: React.ReactNode;
  speed?: number;
  maxOffset?: number;
  className?: string;
};

export default function ParallaxWrapper({
  children,
  speed = 0.12,
  maxOffset = 40,
  className = "",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    // Respect users who prefer reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      return;
    }

    let ticking = false;

    const updatePosition = () => {
      const offset = Math.min(window.scrollY * speed, maxOffset);

      element.style.transform = `translate3d(0, ${offset}px, 0)`;

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updatePosition);
        ticking = true;
      }
    };

    // Set the initial position
    updatePosition();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [speed, maxOffset]);

  return (
    <div
      ref={ref}
      className={`${styles.parallax} ${className}`}
    >
      {children}
    </div>
  );
}