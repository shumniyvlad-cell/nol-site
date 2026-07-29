import Link from "next/link";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import { ZeroPortalStage } from "@/components/zero-portal/zero-portal-stage";
import styles from "./hero-section.module.css";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className={styles.hero}
      id="hero"
    >
      <ZeroPortalStage />
      <div aria-hidden="true" className={styles.horizon} />

      <div className={styles.content}>
        <h1 className={styles.title} id="hero-title">
          <span aria-hidden="true" className={styles.desktopTitleText}>
            Вы больше
            <br />
            не обязаны жить
            <br />
            в режиме выживания.
          </span>
          <span aria-hidden="true" className={styles.mobileTitleText}>
            Вы больше
            <br />
            не обязаны
            <br />
            жить в режиме
            <br />
            выживания.
          </span>
          <span className="sr-only">
            Вы больше не обязаны жить в режиме выживания.
          </span>
        </h1>

        <div className={styles.details}>
          <p className={styles.summary}>
            «НОЛЬ» помогает спокойно разобраться в долговой ситуации, оценить
            риски и пройти законную процедуру банкротства, если она
            действительно вам подходит.
          </p>

          <div className={styles.actions}>
            <Link className={styles.action} href="#diagnostic">
              <span>Посмотреть возможный выход</span>
              <ArrowIcon className={styles.arrow} />
            </Link>
            <Link className={styles.actionSecondary} href="#process">
              <span>Как работает процедура</span>
              <ArrowIcon className={styles.arrow} />
            </Link>
          </div>

          <p className={styles.note}>
            Конфиденциально. Без давления. Сначала — анализ ситуации.
          </p>
        </div>

        <div className={styles.nextCue}>
          <span aria-hidden="true" className={styles.sectionIndex}>
            01 /
          </span>
          <p className={styles.nextCueTitle}>
            Банкротство — это не поражение.
          </p>
          <p className={styles.nextCueBody}>
            Это законный способ восстановить контроль
            <br />
            над своей жизнью и двигаться дальше.
          </p>
        </div>
      </div>
    </section>
  );
}
