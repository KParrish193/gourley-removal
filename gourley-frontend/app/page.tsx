import { fetchSheetData } from "@/app/lib/gsheet";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

const heroContent = await fetchSheetData("Home", "A2:F10");
const aboutContent = await fetchSheetData("Home", "K2:N10");
const cta2 = await fetchSheetData("Home", "J2:O10");

// filter services data
const servicesRows = await fetchSheetData("Home", "H1:H10");
const services = servicesRows.map((row) => row["Services"]).filter(Boolean);

const locationDetails = await fetchSheetData("Home", "I1:I10");
const location = locationDetails.map((row) => row["Service Location"]).filter(Boolean);

export const revalidate = 0;

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          {heroContent.map((hero, i: number) => {
            return (
              <div key={i} className={styles.wrapper}>
                {hero.heading ? <h1>{hero.heading}</h1> : null}
                {hero.subheading ? <h3>{hero.subheading}</h3> : null}
                {/* <Image
                  src={`${hero.image_url}`}
                  alt={`${hero.image_alt}`}
                  width={1080}
                  height={720}
                  priority
                /> */}
                {hero.link ? (
                  <a className="button-primary" href={hero.link}>
                    {hero.link_text}
                  </a>
                ) : (
                  <Link className="button-primary" href={"/contact-us"}>
                    Contact Us
                  </Link>
                )}
              </div>
            );
          })}
        </section>

        <section className={styles.services}>
          <div className={styles.fiftyFifty}>
            <div>
              <h3>What We Do</h3>
              <ul>
                {services.map((service, i: number) => {
                  return (
                    <li key={i}>
                      <Image
                        src={"/filledlog.png"}
                        alt={"log icon"}
                        width={25}
                        height={25}
                      />
                      {service}
                    </li>
                  );
                })}
              </ul>
              <Link className="button-primary" href={"/contact-us"}>
                Get an Estimate
              </Link>
            </div>

            <div className={styles.serviceArea}>
              <h3>Where We Work</h3>
              {location.map((loc, i: number) => {
                return <p key={i}>{loc}</p>;
              })}
              <Image
                src={"/servicemap.png"}
                alt={"map of hawaii"}
                width={500}
                height={500}
                priority
              />
            </div>
          </div>
        </section>

        <section className={styles.about}>
          <div className={styles.fiftyFifty}>
            <h3>About Us</h3>
            <h4>Meet Steve Gourley</h4>
          </div>
          {aboutContent.map((about, i: number) => {
            return (
              <div key={i} className={styles.fiftyFifty}>
                <div>
                  {about.subheading ? <h3></h3> : null}
                  <div>{about.text}</div>
                </div>
                <div>
                  <Image
                    src={`${about.image_url}`}
                    alt={`${about.image_alt}`}
                    width={500}
                    height={500}
                    priority
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
