"use client";

import { useState } from "react";
import {
  legalContentReviewRequired,
  legalDisclaimer,
  legalQuestions,
} from "@/content/legal";
import styles from "./legal-clarity-section.module.css";

const initialQuestionIndex = 3;

export function LegalClaritySection() {
  const [activeIndex, setActiveIndex] = useState(initialQuestionIndex);
  const activeQuestion = legalQuestions[activeIndex];

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
          <ol aria-label="Юридические вопросы">
            {legalQuestions.map((item, index) => (
              <li
                className={index === activeIndex ? styles.activeItem : ""}
                key={item.id}
              >
                <button
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
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
          <div className={styles.answer}>
            <p className={styles.answerLabel}>КОРОТКИЙ ОТВЕТ</p>
            <p className={styles.answerText}>{activeQuestion.answer}</p>
          </div>
          <p className={styles.disclaimer}>{legalDisclaimer}</p>
        </aside>
      </div>
    </section>
  );
}
