import Link from "next/link";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import styles from "./price-section.module.css";

const serviceItems = [
  "Диагностика и стратегия",
  "Подготовка документов",
  "Судебное сопровождение",
  "Статус и коммуникация",
] as const;

export function PriceSection() {
  return (
    <section
      aria-labelledby="price-title"
      className={styles.price}
      data-header-theme="light"
      id="price"
    >
      <div aria-hidden="true" className={styles.paperNoise} />

      <div className={styles.frame}>
        <div className={styles.heading}>
          <p>СТОИМОСТЬ СОПРОВОЖДЕНИЯ</p>
          <h2 id="price-title">
            <span>Полное сопровождение —</span>
            <strong>
              <span className={styles.pricePrefix}>от</span>{" "}
              <span className={styles.priceAmount}>300&nbsp;000&nbsp;₽</span>
            </strong>
          </h2>
        </div>

        <div className={styles.colophon}>
          <div className={styles.service}>
            <p>СОСТАВ УСЛУГИ</p>
            <ul>
              {serviceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className={styles.explanation}>
            <p>КАК ФИКСИРУЕТСЯ ЦЕНА</p>
            <p>
              Итоговая стоимость зависит от состава долга, имущества, сделок,
              количества кредиторов и сложности дела. Точная цена и состав
              сопровождения фиксируются после анализа ситуации.
            </p>
          </div>

          <div className={styles.edition}>
            <p>ИЗДАНИЕ</p>
            <span>№ 0001–2026</span>
            <p>ЯЗЫК</p>
            <span>Русский</span>
            <p>ТИРАЖ</p>
            <span>Индивидуальный</span>
          </div>

          <Link className={styles.action} href="#diagnostic">
            <span>Обсудить мою ситуацию</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
