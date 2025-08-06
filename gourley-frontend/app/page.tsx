import { fetchSheetData, SheetRow } from "@/app/lib/gsheet";
import Image from "next/image";
import Link from "next/link";
import styles from "./home.module.css";

type Props = {
  cta1: SheetRow[];
  cta2: SheetRow[];
  services: SheetRow[];
};

// define type structure for google content
type Content = {
  text: string;
  imgSrc: string;
  imgAlt: string;
  link?: string;
  linkText?: string;
};

const cta1 = await fetchSheetData("Home", "A2:F10");
const cta2 = await fetchSheetData("Home", "J2:O10");
const services = await fetchSheetData("Home", "H1:H10");

export const revalidate = 0;

export default function Home() {

  console.log("IT DID THE THING", services);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section>
          <div className={styles.heroCTA}>
            {cta1.map((hero, i: number) => {
              return (
                <div key={i} className={styles.wrapper}>
                  <div>
                    <div>{hero.text}</div>
                    <Image
                      src={hero.imgSrc}
                      alt={hero.imgAlt}
                      width={100}
                      height={100}
                      priority
                    />
                    {hero.link ? (
                      <Link href={hero.link}> {hero.linkText}</Link>
                    ) : (
                      <Link href="/contact">Contact Us</Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.services}>
          <ul>
            {/* {services.map((service: string, i: number) => {
              return <li key={i}>{service}</li>;
            })} */}
          </ul>
          <div className={styles.serviceArea}>
              {/* info about where Steve works */}
          </div>
        </section>

        <section className={styles.about}>
          {cta2.map((about, i: number) => {
            return (
              <div key={i} className={styles.wrapper}>
                <div>{about.text}</div>
                <div>
                  <Image
                    src={about.imgSrc}
                    alt={about.imgAlt}
                    width={100}
                    height={100}
                  />
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
