import Link from "next/link";
import { ZeroMark } from "@/components/brand/zero-mark";
import styles from "./site-footer.module.css";

const legalLinks = [
  ["Политика конфиденциальности", "/privacy"],
  ["Согласие", "/personal-data-consent"],
  ["Условия", "/terms"],
  ["Реквизиты", "/contacts#details"],
  ["Стоимость", "/legal#price"],
  ["Правовая информация", "/legal"],
] as const;

type SiteFooterProps = {
  variant?: "overlay" | "solid";
};

export function SiteFooter({ variant = "overlay" }: SiteFooterProps) {
  return (
    <footer
      className={`${styles.footer} ${
        variant === "solid" ? styles.solid : ""
      }`}
    >
      <div className={styles.inner}>
        <Link aria-label="НОЛЬ — на главную" className={styles.brand} href="/">
          <span>НОЛЬ</span>
          <ZeroMark />
        </Link>

        <nav aria-label="Юридическая навигация">
          {legalLinks.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
