import Link from "next/link";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import { siteConfig } from "@/config/site";
import styles from "./final-threshold-section.module.css";

function TelegramIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m3 11 17-7-5.4 16-3.3-5.8L3 11Zm8.3 3.2L20 4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function FinalThresholdSection() {
  const telegramHref =
    siteConfig.company.telegram ?? "/contacts?channel=telegram";

  return (
    <section
      aria-labelledby="final-title"
      className={styles.final}
      data-header-theme="dark"
      id="final"
    >
      <div aria-hidden="true" className={styles.scene} />
      <div aria-hidden="true" className={styles.vignette} />
      <span aria-hidden="true" className={styles.redThreshold} />

      <div className={styles.frame}>
        <div className={styles.copy}>
          <h2 id="final-title">Вам не нужно решать всё сегодня.</h2>
          <p>
            Достаточно сделать первый понятный шаг: спокойно разобрать ситуацию
            и узнать, какие варианты действительно существуют.
          </p>

          <div className={styles.actions}>
            <Link href="#diagnostic">
              <span>Начать с диагностики</span>
              <span aria-hidden="true" className={styles.actionRule} />
              <ArrowIcon />
            </Link>
            <Link href={telegramHref}>
              <span>Задать вопрос в Telegram</span>
              <span aria-hidden="true" className={styles.actionRule} />
              <TelegramIcon />
            </Link>
          </div>

          <p className={styles.note}>
            Предварительная консультация не обязывает заключать договор.
          </p>
        </div>
      </div>
    </section>
  );
}
