"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./header.module.css";
import { useEffect, useRef } from "react";

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let prevScrollPos = window.scrollY;
    const threshold = 5; // pixels you must scroll before toggling
    const hideAfter = 80; // how far down before hiding can happen
    
    const handleScroll = () => {
      const currentScrollPos = Math.max(window.scrollY, 0);
      if (!headerRef.current) return;

      // Only hide if we've scrolled past the initial visible area
      if (currentScrollPos > hideAfter) {
        if (currentScrollPos - prevScrollPos > threshold) {
          // scrolling down past threshold
          headerRef.current.style.top = "-75px";
        } else if (prevScrollPos - currentScrollPos > threshold) {
          // scrolling up past threshold
          headerRef.current.style.top = "0px";
        }
      } else {
        // always show if we're near the top
        headerRef.current.style.top = "0px";
      }

      prevScrollPos = currentScrollPos;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.headerWrapper}>
        {/* logo */}
        <Link href="/" className={styles.logo}>
          <Image
            src={"/logo/logo.png"}
            alt={"gourley logo"}
            width={157}
            height={70}
          />
        </Link>

        {/* cta button */}
        <Link className={`button-primary arrow-button`} href="/contact-us">
          Contact Us
          <Image
            src={"/icons/arrow.svg"}
            alt={"arrow"}
            width={10}
            height={10}
          />
        </Link>
      </div>
    </header>
  );
}
