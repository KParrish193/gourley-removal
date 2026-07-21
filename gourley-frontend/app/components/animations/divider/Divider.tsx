"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./divider.module.css";

type AnimatedDividerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AnimatedDivider({
  children,
  className = "",
}: AnimatedDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.dividerWrapper} ${
        visible ? styles.visible : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}