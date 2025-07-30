import Link from "next/link";

export default function Nav() {
    return (
            <nav>
                {/* logo */}
                <Link href="/">Home</Link>

                {/* cta button */}
                <Link href="/contact">Contact Us</Link>
            </nav>
    );
}
