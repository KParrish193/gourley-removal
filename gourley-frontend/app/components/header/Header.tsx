import Link from "next/link";
import styles from "./header.module.css";

export default function Header() {
    return (
      <header>
        <div>
          {/* logo */}
          <Link href="/">Home</Link>
        </div>

        {/* cta button */}
        <Link className={styles.button} href="/contact-us">
          Contact Us
        </Link>
      </header>
    );
}
