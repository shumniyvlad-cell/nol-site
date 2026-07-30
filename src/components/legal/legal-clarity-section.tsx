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
  const mobileQuestionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shouldScrollMobileRef = useRef(false);
  const activeQuestion = legalQuestions[activeIndex];

  useEffect(() => {
    if (window.innerWidth >= 900 || !shouldScrollMobileRef.current) {
      return;
    }

    shouldScrollMobileRef.current = false;
    const animationFrame = window.requestAnimationFrame(() => {
      mobileQuestionRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [activeIndex]);

  const selectQuestion = (index: number) => {
    shouldScrollMobileRef.current = window.innerWidth < 900;
    setActiveIndex(index);
  };

  return (
    <section
      aria-labelledby="legal-title"
      className={styles.legal}
      data-header-theme="split"
      id="legal"
    >
      <div aria-hidden="true" className={styles.paperNoise} />
      <h2 className="sr-only" id="legal-title">
        Юридическая ясность
      </h2>

      <div className={styles.frame}>
        <aside
          className={styles.questionIndex}
          data-testid="legal-desktop-questions"
        >
          <p className={styles.indexLabel}>ВОПРОСЫ</p>
          <ol aria-label="Юридические вопросы">
            {legalQuestions.map((item, index) => (
              <li
                className={index === activeIndex ? styles.activeItem : ""}
                key={item.id}
              >
                <button
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => selectQuestion(index)}
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
          <h3 data-testid="legal-active-question">
            {activeQuestion.question}
          </h3>
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

      <div
        className={styles.mobileAccordion}
        data-testid="legal-mobile-questions"
      >
        <p className={styles.mobileLabel}>ЮРИДИЧЕСКАЯ ЯСНОСТЬ / ВОПРОСЫ</p>
        <ol aria-label="Юридические вопросы">
          {legalQuestions.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <li
                className={isActive ? styles.mobileActiveItem : ""}
                key={item.id}
              >
                <h3>
                  <button
                    aria-controls={`legal-answer-${item.id}`}
                    aria-expanded={isActive}
                    onClick={() => selectQuestion(index)}
                    ref={(node) => {
                      mobileQuestionRefs.current[index] = node;
                    }}
                    type="button"
                  >
                    <span aria-hidden="true" className={styles.mobileSignal} />
                    <span className={styles.mobileQuestionNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.question}</span>
                  </button>
                </h3>

                <div
                  aria-hidden={!isActive}
                  className={`${styles.mobileResponse} ${
                    isActive ? styles.mobileResponseOpen : ""
                  }`}
                  data-header-theme-mobile={isActive ? "dark" : undefined}
                  data-testid="legal-mobile-response"
                  id={`legal-answer-${item.id}`}
                >
                  <div className={styles.mobileResponseClip}>
                    <div
                      className={styles.mobileResponseBody}
                      data-legal-review-required={legalContentReviewRequired}
                    >
                      <p className={styles.answerLabel}>КОРОТКИЙ ОТВЕТ</p>
                      <p className={styles.answerText}>{item.answer}</p>
                      <p className={styles.disclaimer}>{legalDisclaimer}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
