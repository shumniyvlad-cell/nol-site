import styles from "./brand-turn-section.module.css";

const zeroStates = ["Координата", "Частицы", "Материал", "Свет"] as const;

export function BrandTurnSection() {
  return (
    <section
      aria-labelledby="brand-turn-title"
      className={styles.brandTurn}
      id="brand-turn"
    >
      <div aria-hidden="true" className={styles.scene} />

      <div className={styles.frame}>
        <div className={styles.leftCopy}>
          <h2 className={styles.leftTitle} id="brand-turn-title">
            Рынок продаёт
            <br />
            банкротство.
            <br />
            Мы возвращаем
            <br />
            ощущение будущего.
          </h2>
          <p>
            Банкротство — не продукт мечты.
            <br />
            Это один из законных инструментов
            <br />
            выхода из ситуации, в которой старый
            <br />
            финансовый сценарий больше
            <br />
            не работает.
          </p>
        </div>

        <div className={styles.rightCopy}>
          <h3>
            Ноль —
            <br />
            это не конец.
            <br />
            <span className={styles.statementBreak}>
              Это точка,
              <br />
              с которой можно
              <br />
              начать заново.
            </span>
          </h3>
          <p>
            Мы строим не очередную юридическую вывеску, а понятный сервис и
            медиа о новой финансовой жизни.
          </p>
        </div>

        <div aria-label="Знак НОЛЬ проходит четыре материальных состояния" className={styles.trace}>
          <span aria-hidden="true" className={styles.traceLine} />
          {zeroStates.map((label, index) => (
            <div
              className={`${styles.state} ${styles[`state${index + 1}`]}`}
              key={label}
            >
              <span aria-hidden="true" className={styles.stateVisual} />
              <span className="sr-only">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
