import styles from "./problem-section.module.css";

const observations = [
  "Неизвестный номер становится угрозой.",
  "Один платёж закрывается другим.",
  "Планы сокращаются до следующей даты списания.",
] as const;

export function ProblemSection() {
  return (
    <section
      aria-labelledby="problem-title"
      className={styles.problem}
      id="problem"
    >
      <div aria-hidden="true" className={styles.scene} />
      <div aria-hidden="true" className={styles.vignette} />

      <div className={styles.frame}>
        <div className={styles.projection}>
          <h2 className={styles.title} id="problem-title">
            Долг редко
            <br />
            остаётся просто
            <br />
            цифрой.
          </h2>
          <p className={styles.body}>
            Он меняет отношение к телефону, покупкам, работе, семье и
            собственному будущему. Большинство компаний начинают разговор с
            продажи договора. Мы начинаем с того, что спокойно разбираемся в
            реальной ситуации человека.
          </p>
        </div>

        <div className={styles.observationRail}>
          <span className={styles.timecode}>00:00:00</span>
          {observations.map((observation) => (
            <p key={observation}>{observation}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
