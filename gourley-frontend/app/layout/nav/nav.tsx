import Link from "next/link";

export default function Nav() {
    return (
        <header>
            <nav>
                <Link href="/">Home</Link>
                <Link href="/contact">Contact Us</Link>
            </nav>
        </header>
    );
}
