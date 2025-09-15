import { fetchSheetData, SheetRow } from "@/app/lib/gsheet";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";


export const revalidate = 0;

export default async function Home() {
  let heroContent: SheetRow[] = [];
  let aboutContent: SheetRow[] = [];
  let services: string[] = [];
  let location: string[] = [];

  try {
    const heroRows = await fetchSheetData("Home", "A2:F10");
    heroContent = heroRows;

    const aboutRows = await fetchSheetData("Home", "K2:N10");
    aboutContent = aboutRows;

    // filter services data
    const servicesRows = await fetchSheetData("Home", "H1:H10");
    services = servicesRows.map((row) => row["Services"]).filter((s): s is string => Boolean(s));

    const locationRows = await fetchSheetData("Home", "I1:I10");
    location = locationRows.map((row) => row["Service Location"]).filter((l): l is string => Boolean(l));
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Failed to fetch sheet data:", err.message);
    } else {
      console.error("Unknown error fetching sheet data", err);
    }
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          {heroContent.map((hero, i: number) => {
            return (
              <div key={i} className={styles.heroPanel}>
                <div className={styles.heroVisual}>
                  {hero.visual_path.includes("/videos") ? (
                    <video src={`${hero.visual_path}`}></video>
                  ) : (
                    <Image
                      src={`${hero.visual_path}`}
                      alt={`${hero.visual_alt}`}
                      width={1024}
                      height={2032}
                      priority
                    />
                  )}
                </div>
                <div className={styles.heroContent}>
                  <div className={styles.heroContent}>
                    {hero.heading ? <h1>{hero.heading}</h1> : null}
                    {hero.subheading ? <h3>{hero.subheading}</h3> : null}

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
                </div>
              </div>
            );
          })}
        </section>

        <section className={styles.serviceInfo}>
          <div className={styles.serviceArea}>
            <div>
              <h3>Where We Work</h3>
              {location.map((loc, i: number) => {
                return <p key={i}>{loc}</p>;
              })}
            </div>
            <Image
              src={"/map/servicemap.png"}
              alt={"map of hawaii"}
              width={500}
              height={500}
              priority
            />
          </div>
          <div className={styles.servicesList}>
            <h3>What We Offer</h3>
            <ul>
              {services.map((service, i: number) => {
                return (
                  <li key={i}>
                    <Image
                      src={"/icons/filledlog.png"}
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
                  {about.subheading ? <h3>{about.subheading}</h3> : null}
                  <div>{about.text}</div>
                </div>
                <div>
                  {about.visual_path.includes("/videos") ? (
                    <div className={styles.visualWrapper}>
                      <video autoPlay muted playsInline loop>
                        <source src={`${about.visual_path}`} type="video/mp4" />
                        Your browser does not support video playback.
                      </video>
                    </div>
                  ) : (
                    <div className={styles.visualWrapper}>
                      <Image
                        src={`${about.visual_path}`}
                        alt={`${about.visual_alt}`}
                        width={500}
                        height={500}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
