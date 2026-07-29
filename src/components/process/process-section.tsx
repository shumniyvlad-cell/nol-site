"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const stage = stages[activeStage];
  const stageNumber = String(activeStage + 1).padStart(2, "0");
  const routeStart =
    activeStage === 0 ? stagePositions[0] : stagePositions[activeStage - 1];

  const routeStyle = {
    "--route-start": `${routeStart}%`,
  } as CSSProperties;

  useEffect(() => {
    let animationFrame = 0;

    const updateStageFromScroll = () => {
      animationFrame = 0;
      const section = sectionRef.current;
      if (!section) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);
      const nextStage = Math.round(progress * (stages.length - 1));
      setActiveStage((current) =>
        current === nextStage ? current : nextStage,
      );
    };

    const requestUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateStageFromScroll);
      }
    };

    updateStageFromScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const scrollToStage = (nextStage: number) => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const clampedStage = Math.min(
      Math.max(nextStage, 0),
      stages.length - 1,
    );
    const travel = Math.max(section.offsetHeight - window.innerHeight, 0);
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const targetTop =
      sectionTop + (travel * clampedStage) / (stages.length - 1);

    setActiveStage(clampedStage);
    window.scrollTo({
      top: targetTop,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  const showPrevious = () => scrollToStage(activeStage - 1);
  const showNext = () => scrollToStage(activeStage + 1);

  return (
    <section
      aria-labelledby="process-title"
      className={styles.process}
      data-active-stage={stageNumber}
      id="process"
      ref={sectionRef}
    >
      <div className={styles.stickyFrame}>
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
            <div className={styles.activeCopy} key={stageNumber}>
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
                  onClick={() => scrollToStage(index)}
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
      </div>
    </section>
  );
}
