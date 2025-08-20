import Image from "next/image";
import styles from "./footer.module.css";

export default function Footer() {
    return (
      <footer className={styles.footer}>
        <div>
          <div className={styles.phone}>
            <a href={"tel:808-765-4547"} target="_blank">
              <Image
                src={"/icons/phone.svg"}
                alt={"phone icon"}
                width={30}
                height={30}
              />
              (808) 765-4547
            </a>
          </div>
          <div className={styles.socials}>
            <a
              href={"https://www.instagram.com/gourley_tree_removal/"}
              target="_blank"
            >
              <Image
                className={styles.icon}
                src={"/icons/insta.svg"}
                alt={"instagram icon"}
                width={28}
                height={28}
              />
            </a>
            <a
              href={
                "https://www.yelp.com/biz/gourley-tree-removal-kailua-kona?override_cta=Get+a+quote"
              }
              target="_blank"
            >
              <Image
                className={styles.icon}
                src={"/icons/yelp.svg"}
                alt={"yelp icon"}
                width={25}
                height={25}
              />
            </a>
            <a
              href={"https://maps.app.goo.gl/xnWwKYDE9U2dWPkV8"}
              target="_blank"
            >
              <Image
                className={styles.icon}
                src={"/icons/google-maps.svg"}
                alt={"google maps icon"}
                width={25}
                height={25}
              />
            </a>
          </div>
        </div>
      </footer>
    );
}
