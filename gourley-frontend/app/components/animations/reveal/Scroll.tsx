"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./scroll.module.css";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Scroll({
  children,
  className = "",
}: RevealProps) {
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
        threshold: 0.15,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${styles.reveal} ${visible ? styles.visible : ""}`}
    >
      {children}
    </div>
  );
}