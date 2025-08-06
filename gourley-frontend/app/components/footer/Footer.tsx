import Image from "next/image";

export default function Footer() {
    return (
      <footer>
        <div>
          <p>
            Follow us!
            <a
              href={"https://www.instagram.com/gourley_tree_removal/"}
              target="_blank"
            >
              <Image
                src={"/insta.svg"}
                alt={"instagram icon"}
                width={25}
                height={25}
              />
            </a>
          </p>
          <p>
            <a
              href={
                "https://www.yelp.com/biz/gourley-tree-removal-kailua-kona?override_cta=Get+a+quote"
              }
              target="_blank"
            >
              <Image
                src={"/yelp.svg"}
                alt={"yelp icon"}
                width={25}
                height={25}
              />
            </a>
          </p>
          <p>
            <a
              href={"https://maps.app.goo.gl/xnWwKYDE9U2dWPkV8"}
              target="_blank"
            >
              <Image
                src={"/google-maps.svg"}
                alt={"google maps icon"}
                width={25}
                height={25}
              />
            </a>
          </p>
        </div>
      </footer>
    );
}
