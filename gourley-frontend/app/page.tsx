import { fetchSheetData, SheetRow } from "@/app/lib/gsheet";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const heroContent = await fetchSheetData("Home", "A2:F10");
const aboutContent = await fetchSheetData("Home", "A2:F10");
const cta2 = await fetchSheetData("Home", "J2:O10");

// filter services data
const servicesRows = await fetchSheetData("Home", "H1:H10");
const services = servicesRows.map((row) => row["Services"]).filter(Boolean);

export const revalidate = 0;

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section>
          <div className={styles.heroCTA}></div>
        </section>

        <section className={styles.services}>
          <div>
            <h3>Services</h3>
            <ul>
              {services.map((service, i: number) => {
                return <li key={i}>{service}</li>;
              })}
            </ul>
          </div>
          <div className={styles.serviceArea}>
            {/* info about service area */}
            <Image
              src={"/servicemap.png"}
              alt={"map of hawaii"}
              width={500}
              height={500}
              priority
            />
          </div>
        </section>

        <section className={styles.about}>
          <h3>About</h3>
          {aboutContent.map((about, i: number) => {
            return (
              <div key={i} className={styles.wrapper}>
                <div>
                  <div>{about.text}</div>
                  {/* <Image
                      src={hero.imgSrc}
                      alt={hero.imgAlt}
                      width={100}
                      height={100}
                      priority
                    /> */}
                </div>
              </div>
            );
          })}
          {cta2.map((about, i: number) => {
            return (
              <div key={i} className={styles.wrapper}>
                <div>{about.text}</div>
                <div>
                  {/* <Image
                    src={about.imgSrc}
                    alt={about.imgAlt}
                    width={100}
                    height={100}
                  /> */}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
