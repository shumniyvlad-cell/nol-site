"use client";

import { useState, type CSSProperties } from "react";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import styles from "./process-section.module.css";

const stages = [
  {
    title: "Диагностика",
    body: "Разбираем документы, состав долга и обстоятельства. Объясняем, какие варианты вообще допустимы.",
  },
  {
    title: "Подготовка",
    body: "Формируем список документов, проверяем риски и фиксируем понятный план дальнейших действий.",
  },
  {
    title: "Процедура",
    body: "Берём на себя документы, суд и коммуникацию. Вы видите статус, следующий шаг и реальные сроки.",
  },
  {
    title: "Решение суда",
    body: "Сопровождаем ключевые этапы и объясняем каждое решение без юридического тумана.",
  },
  {
    title: "После нуля",
    body: "Помогаем понять ограничения, восстановить финансовый ритм и начать движение без старого сценария.",
  },
] as const;

const stagePositions = [11.5, 31.8, 51.5, 78.3, 93.5] as const;

export function ProcessSection() {
  const [activeStage, setActiveStage] = useState(2);
  const stage = stages[activeStage];
  const stageNumber = String(activeStage + 1).padStart(2, "0");
  const routeStart =
    activeStage === 0 ? stagePositions[0] : stagePositions[activeStage - 1];

  const routeStyle = {
    "--route-start": `${routeStart}%`,
  } as CSSProperties;

  const showPrevious = () => {
    setActiveStage((current) => Math.max(0, current - 1));
  };

  const showNext = () => {
    setActiveStage((current) => Math.min(stages.length - 1, current + 1));
  };

  return (
    <section
      aria-labelledby="process-title"
      className={styles.process}
      id="process"
    >
      <div aria-hidden="true" className={styles.scene} />
      <div aria-hidden="true" className={styles.vignette} />

      <div className={styles.frame}>
        <div className={styles.intro}>
          <p>КАК ПРОХОДИТ ПУТЬ</p>
          <h2 id="process-title">
            Путь —
            <br />
            не теория,
            <br />а порядок.
          </h2>
        </div>

        <div aria-live="polite" className={styles.activeStage}>
          <span aria-hidden="true" className={styles.activeNumber}>
            {stageNumber}
          </span>
          <div className={styles.activeCopy}>
            <h3>{stage.title}</h3>
            <p>{stage.body}</p>
          </div>
        </div>

        <ol aria-label="Этапы сопровождения" className={styles.stageMap}>
          {stages.map((item, index) => (
            <li
              className={`${styles.stageItem} ${styles[`stage${index + 1}`]} ${
                index === activeStage ? styles.currentStage : ""
              }`}
              key={item.title}
            >
              <button
                aria-current={index === activeStage ? "step" : undefined}
                onClick={() => setActiveStage(index)}
                type="button"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
              </button>
            </li>
          ))}
        </ol>

        <div aria-hidden="true" className={styles.route} style={routeStyle}>
          <span />
        </div>

        <div className={styles.controls}>
          <button
            disabled={activeStage === 0}
            onClick={showPrevious}
            type="button"
          >
            <ArrowIcon className={styles.backArrow} />
            <span>Предыдущий этап</span>
          </button>
          <button
            disabled={activeStage === stages.length - 1}
            onClick={showNext}
            type="button"
          >
            <span>Следующий этап</span>
            <ArrowIcon />
          </button>
        </div>

        <p className={styles.termNote}>
          Средний срок зависит
          <br />
          от состава долга и суда.
        </p>
      </div>
    </section>
  );
}
