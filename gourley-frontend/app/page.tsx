import Image from "next/image";
import Link from "next/link";
import { getGoogleSheetsData } from "@/gsheet";
import styles from "./page.module.css";



// pass in content from google sheet (figure out useEffect hook to check for new save info)
const range = `Sheet1!A:E`;
const googleContent = await getGoogleSheetsData(id, range);
//   console.log(posts);


export default function Home() {
  // define type structure for content
  type Content = {
    text: string;
    imgSrc: string;
    imgAlt: string;
    link?: string;
    linkText?: string;
  };


  
  // hard coded content
  const heroContent: Content[] = [
    {
      text: "Hero Text content",
      imgSrc: "img link",
      imgAlt: "img alt",
    },
  ];

  const servicesContent: string[] = [
    "Removals",
    "Climbing",
    "Rigging",
    "Pruning",
  ];

  const aboutContent: Content[] = [
    {
      text: "About text content",
      imgSrc: "img link",
      imgAlt: "img alt",
    },
  ];
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section>
          <div className={styles.heroCTA}>
            {heroContent.map((hero: Content, i: number) => {
              return (
                <div key={i} className={styles.wrapper}>
                  <div>
                    <div>{hero.text}</div>
                    <Image 
                      src={hero.imgSrc} 
                      alt={hero.imgAlt}
                      width={100}
                      height={100}
                    />
                    {hero.link ? <Link href={hero.link}> {hero.linkText}</Link>:<Link href="/contact">Contact Us</Link>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className={styles.services}>
          <ol>
            {servicesContent.map((service: string, i: number) => {
              return <li key={i}>{service}</li>;
            })}
          </ol>
        </div>

        <section className={styles.about}>
          {aboutContent.map((about: Content, i: number) => {
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
