import styles from "./manifesto-credits-section.module.css";

const principles = [
  "Без осуждения.",
  "Без ложных гарантий.",
  "Без скрытых условий.",
  "Без исчезновения после оплаты.",
] as const;

const roles = [
  ["Руководитель юридической практики", "Имя готовится"],
  ["Клиентский куратор", "Имя готовится"],
  ["Специалист по подготовке документов", "Имя готовится"],
  ["Редакция и документальное медиа", "Состав готовится"],
] as const;

export function ManifestoCreditsSection() {
  return (
    <section
      aria-labelledby="manifesto-title"
      className={styles.manifesto}
      data-header-theme="light"
      id="about"
    >
      <div aria-hidden="true" className={styles.paperNoise} />
      <div aria-hidden="true" className={styles.registrationAxis}>
        <span />
        <span />
        <span />
      </div>

      <div className={styles.frame}>
        <p className={styles.mode}>
          РЕЖИМ: <strong>ЗАПУСК</strong>
        </p>

        <h2 id="manifesto-title">
          <span className={styles.firstLine}>
            <span>Мы не</span> <span>продаём</span>
          </span>
          <span>чудо.</span>
        </h2>

        <p className={styles.manifestoStatement}>
          Мы строим сервис, в котором человеку объясняют реальность, а не
          усиливают страх ради продажи.
        </p>

        <div className={styles.principles}>
          <p>ПРИНЦИПЫ РАБОТЫ</p>
          <ul>
            {principles.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </div>

        <div className={styles.launch}>
          <p>РЕЖИМ ЗАПУСКА</p>
          <h3>Первые истории готовятся к публикации</h3>
          <p className={styles.auditNote}>
            До проверки данных мы не публикуем отзывы, цифры и дела.
            <span aria-hidden="true" />
          </p>
        </div>

        <p className={styles.responsibility}>
          За красивым брендом должна стоять реальная ответственность.
        </p>

        <div className={styles.credits}>
          <p>КОМАНДА</p>
          <ul>
            {roles.map(([role, status]) => (
              <li key={role}>
                <span>{role}</span>
                <span aria-hidden="true" className={styles.leader} />
                <span>{status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
