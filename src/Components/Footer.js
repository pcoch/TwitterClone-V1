import React from "react";
import styles from "../Styles/Footer.module.css";

const links = [
  "About",
  "Contact",
  "Privacy Policy",
  "Terms of Use",
  "Cookie Policy",
  "Accessibility",
  "Ads Info",
  "Blog",
  "Status",
  "Careers",
  "Brand Resources",
  "Advertising",
  "Marketing",
  "Twitter For Business",
  "Developers",
  "Directory",
  "Settings",
];

export default function Footer() {
  const footerLinks = links.map((link) => <li key={link}>{link}</li>);

  return (
    <nav className={styles.container}>
      <ul className={styles.links}>{footerLinks}</ul>
      <p className={styles.copyright}>© 2020 Twitter</p>
    </nav>
  );
}
