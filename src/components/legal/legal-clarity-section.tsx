"use client";

import { useEffect, useRef, useState } from "react";
import {
  legalContentReviewRequired,
  legalDisclaimer,
  legalQuestions,
} from "@/content/legal";
import styles from "./legal-clarity-section.module.css";

const initialQuestionIndex = 3;

export function LegalClaritySection() {
  const [activeIndex, setActiveIndex] = useState(initialQuestionIndex);
  const indexListRef = useRef<HTMLOListElement>(null);
  const questionButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeQuestion = legalQuestions[activeIndex];

  useEffect(() => {
    if (window.innerWidth >= 900) {
      return;
    }

    const list = indexListRef.current;
    const activeButton = questionButtonRefs.current[activeIndex];
    if (!list || !activeButton) {
      return;
    }

    const targetLeft =
      activeButton.offsetLeft - list.offsetLeft - list.clientWidth * 0.12;
    list.scrollTo({
      left: Math.max(targetLeft, 0),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [activeIndex]);

  return (
    <section
      aria-labelledby="legal-title"
      className={styles.legal}
      data-header-theme="split"
      id="legal"
    >
      <div aria-hidden="true" className={styles.paperNoise} />

      <div className={styles.frame}>
        <aside className={styles.questionIndex}>
          <p className={styles.indexLabel}>ВОПРОСЫ</p>
          <ol aria-label="Юридические вопросы" ref={indexListRef}>
            {legalQuestions.map((item, index) => (
              <li
                className={index === activeIndex ? styles.activeItem : ""}
                key={item.id}
              >
                <button
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                  ref={(node) => {
                    questionButtonRefs.current[index] = node;
                  }}
                  type="button"
                >
                  <span className={styles.signal} />
                  <span className={styles.questionNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.shortQuestion}>
                    {item.shortQuestion}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className={styles.questionField}>
          <p>ЮРИДИЧЕСКАЯ ЯСНОСТЬ</p>
          <h2 id="legal-title">{activeQuestion.question}</h2>
        </div>

        <aside
          aria-live="polite"
          className={styles.answerMargin}
          data-header-theme-mobile="dark"
          data-legal-review-required={legalContentReviewRequired}
        >
          <div className={styles.answer} key={activeQuestion.id}>
            <p className={styles.answerLabel}>КОРОТКИЙ ОТВЕТ</p>
            <p className={styles.answerText}>{activeQuestion.answer}</p>
          </div>
          <p className={styles.disclaimer}>{legalDisclaimer}</p>
        </aside>
      </div>
    </section>
  );
}
