"use client";

import { useEffect, useState } from "react";
import { DiagnosticLeadForm } from "@/components/diagnostic/diagnostic-lead-form";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import { diagnosticQuestions as questions } from "@/content/diagnostic";
import styles from "./diagnostic-section.module.css";

const initialAnswers: Record<string, string> = {};

type DiagnosticSectionProps = {
  initialStep?: number;
  initialAnswers?: Record<string, string>;
};

export function DiagnosticSection({
  initialStep = 0,
  initialAnswers: suppliedInitialAnswers = initialAnswers,
}: DiagnosticSectionProps = {}) {
  const [step, setStep] = useState(initialStep);
  const [answers, setAnswers] =
    useState<Record<string, string>>(suppliedInitialAnswers);
  const [isComplete, setIsComplete] = useState(false);
  const [isCompletingMissingAnswers, setIsCompletingMissingAnswers] =
    useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setIsHydrated(true);
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const activeQuestion = questions[step];
  const selectedAnswer = answers[activeQuestion.id];
  const stepLabel = String(step + 1).padStart(2, "0");
  const visualStepLabel = isComplete
    ? String(questions.length).padStart(2, "0")
    : stepLabel;

  const selectAnswer = (answer: string) => {
    setAnswers((current) => ({
      ...current,
      [activeQuestion.id]: answer,
    }));
  };

  const scrollDiagnosticToStart = () => {
    window.requestAnimationFrame(() => {
      document.getElementById("diagnostic")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  };

  const showResult = () => {
    setIsComplete(true);
    scrollDiagnosticToStart();
  };

  const goBack = () => {
    if (isComplete) {
      setIsComplete(false);
      setIsCompletingMissingAnswers(true);
      scrollDiagnosticToStart();
      return;
    }
    setStep((current) => Math.max(0, current - 1));
    scrollDiagnosticToStart();
  };

  const goForward = () => {
    if (!selectedAnswer) {
      return;
    }

    const firstUnansweredIndex = questions.findIndex(
      (question) => !answers[question.id],
    );

    if (isCompletingMissingAnswers && firstUnansweredIndex === -1) {
      showResult();
      setIsCompletingMissingAnswers(false);
      return;
    }

    if (step === questions.length - 1) {
      if (firstUnansweredIndex === -1) {
        showResult();
        return;
      }

      setIsCompletingMissingAnswers(true);
      setStep(firstUnansweredIndex);
      scrollDiagnosticToStart();
      return;
    }
    setStep((current) => Math.min(questions.length - 1, current + 1));
    scrollDiagnosticToStart();
  };

  return (
    <section
      aria-labelledby="diagnostic-title"
      className={`${styles.diagnostic} ${isComplete ? styles.complete : ""}`}
      data-header-theme="light"
      id="diagnostic"
    >
      <div className={styles.paperNoise} />
      <div
        aria-hidden="true"
        className={styles.stepNumber}
        data-testid="diagnostic-number"
      >
        {visualStepLabel}
      </div>

      <div className={styles.frame}>
        <div className={styles.identity}>
          <span className={styles.stepMeta} data-testid="diagnostic-meta">
            ДИАГНОСТИКА / {visualStepLabel} ИЗ{" "}
            {String(questions.length).padStart(2, "0")}
          </span>
        </div>

        <ol aria-label="Шаги диагностики" className={styles.stepDots}>
          {questions.map((question, index) => (
            <li
              aria-current={
                index === (isComplete ? questions.length - 1 : step)
                  ? "step"
                  : undefined
              }
              className={
                index === (isComplete ? questions.length - 1 : step)
                  ? styles.activeStep
                  : undefined
              }
              key={question.id}
            >
              <span className="sr-only">
                Шаг {index + 1}: {question.question}
              </span>
            </li>
          ))}
        </ol>

        {!isComplete ? (
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              goForward();
            }}
          >
            <fieldset aria-labelledby="diagnostic-title">
              <legend className="sr-only">{activeQuestion.question}</legend>
              <h2
                className={styles.question}
                data-testid="diagnostic-question"
                id="diagnostic-title"
              >
                {activeQuestion.question}
              </h2>

              <div className={styles.options} data-testid="diagnostic-options">
                {activeQuestion.options.map((option, optionIndex) => {
                  const optionId = `${activeQuestion.id}-${optionIndex}`;
                  return (
                    <div className={styles.option} key={option}>
                      <input
                        checked={selectedAnswer === option}
                        id={optionId}
                        name={activeQuestion.id}
                        onChange={() => selectAnswer(option)}
                        type="radio"
                        value={option}
                      />
                      <label htmlFor={optionId}>
                        <span aria-hidden="true" className={styles.optionDot} />
                        <span>{option}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            <p className={styles.privacy}>
              Ответы не сохраняются и не отправляются без вашего согласия.
            </p>

            <div className={styles.actions} data-testid="diagnostic-actions">
              <button
                disabled={!isHydrated || step === 0}
                onClick={goBack}
                type="button"
              >
                <ArrowIcon className={styles.backArrow} />
                <span>Назад</span>
              </button>
              <button
                disabled={!isHydrated || !selectedAnswer}
                type="submit"
              >
                <span>{step === questions.length - 1 ? "Завершить" : "Продолжить"}</span>
                <ArrowIcon />
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.result}>
            <h2 id="diagnostic-title">
              В вашей ситуации есть вопросы, которые стоит проверить со
              &nbsp;специалистом.
            </h2>
            <p>
              На предварительном этапе важно изучить состав долгов, имущество,
              доходы и совершённые сделки. Оставьте контакты — специалист
              свяжется с вами и объяснит возможные сценарии без обязательства
              заключать договор.
            </p>
            <DiagnosticLeadForm answers={answers} />
            <button className={styles.resultBack} onClick={goBack} type="button">
              Вернуться к последнему вопросу
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
