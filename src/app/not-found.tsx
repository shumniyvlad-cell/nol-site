import Link from "next/link";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import { SiteHeader } from "@/components/layout/site-header";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        className={styles.notFound}
        data-header-theme="dark"
        id="main-content"
      >
        <span aria-hidden="true">0</span>
        <div>
          <p>АРХИВ / 404</p>
          <h1>Такой страницы нет.</h1>
          <p>Маршрут закончился, но можно вернуться к началу.</p>
          <Link href="/">
            <span>На главную</span>
            <ArrowIcon />
          </Link>
        </div>
      </main>
    </>
  );
}
