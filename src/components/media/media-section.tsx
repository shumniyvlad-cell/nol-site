"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import { LastPaymentBackground } from "@/components/media/last-payment-background";
import { trackEvent } from "@/lib/analytics/client";
import {
  premiereLeadSchema,
  type PremiereLeadInput,
} from "@/lib/leads/schema";
import styles from "./media-section.module.css";

const materials = [
  {
    id: "hidden-debt",
    title: "Почему человек скрывает долги даже от близких",
  },
  {
    id: "after-procedure",
    title: "Что происходит после завершения процедуры",
  },
  {
    id: "seven-questions",
    title: "Семь вопросов до подписания договора",
  },
] as const;

export function MediaSection() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
    trackEvent("media_teaser_open");
  };
  const closeDialog = () => dialogRef.current?.close();

  return (
    <section
      aria-labelledby="media-title"
      className={styles.media}
      data-header-theme="dark"
      id="media"
    >
      <div className={styles.poster}>
        <LastPaymentBackground />
        <div aria-hidden="true" className={styles.projectorWash} />

        <p className={styles.format}>БРЕНД-МЕДИА / ДОКУМЕНТАЛЬНЫЙ СЕРИАЛ</p>

        <h2 className="sr-only" data-testid="last-payment-heading" id="media-title">
          Последний платёж
        </h2>

        <div className={styles.statement}>
          <h3>Мы говорим о долгах так, как о них обычно не говорят.</h3>
          <p>
            Документальные истории людей, которые перестали жить от одного
            тревожного звонка до другого.
          </p>
        </div>

        <div className={styles.actions} data-testid="last-payment-actions">
          <button onClick={openDialog} type="button">
            <span aria-hidden="true" className={styles.actionFrame}>
              <span className={styles.playRing}>
                <span />
              </span>
            </span>
            <span>Смотреть трейлер</span>
          </button>
          <button onClick={openDialog} type="button">
            <span aria-hidden="true" className={styles.actionFrame}>
              <span className={styles.plus}>+</span>
            </span>
            <span>Получить премьеру</span>
          </button>
        </div>
      </div>

      <aside aria-label="Редакционные материалы" className={styles.contactStrip}>
        {materials.map((material, index) => (
          <Link href={`/media#${material.id}`} key={material.id}>
            <span className={styles.episodeNumber}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{material.title}</span>
            <ArrowIcon />
          </Link>
        ))}
      </aside>

      <MediaTeaserDialog dialogRef={dialogRef} onClose={closeDialog} />
    </section>
  );
}

type MediaTeaserDialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  onClose: () => void;
};

function MediaTeaserDialog({
  dialogRef,
  onClose,
}: MediaTeaserDialogProps) {
  const [submissionState, setSubmissionState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [serverMessage, setServerMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PremiereLeadInput>({
    resolver: zodResolver(premiereLeadSchema),
    defaultValues: {
      type: "premiere",
      email: "",
      consent: false,
      company: "",
    },
  });

  const submitPremiere = handleSubmit(async (values) => {
    if (process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true") {
      setSubmissionState("error");
      setServerMessage(
        "На временной демонстрационной версии подписка отключена.",
      );
      return;
    }

    setSubmissionState("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(
          response.status === 409
            ? "Этот адрес уже принят. Повторно отправлять его не нужно."
            : payload.message || "Не удалось отправить форму.",
        );
      }

      setSubmissionState("success");
      trackEvent("premiere_subscription_success");
      reset();
    } catch (error) {
      setSubmissionState("error");
      setServerMessage(
        error instanceof Error
          ? error.message
          : "Не удалось отправить форму. Попробуйте ещё раз.",
      );
    }
  });

  return (
    <dialog
      aria-labelledby="media-dialog-title"
      className={styles.dialog}
      onCancel={onClose}
      onClick={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
      ref={dialogRef}
    >
      <div className={styles.dialogPanel}>
        <button
          aria-label="Закрыть тизер"
          className={styles.close}
          onClick={onClose}
          type="button"
        >
          <span />
          <span />
        </button>

        <div aria-hidden="true" className={styles.dialogStill}>
          <span className={styles.dialogPlay}>
            <span />
          </span>
        </div>

        <div className={styles.dialogCopy}>
          <p>Тизер / Премьера готовится</p>
          <h3 id="media-dialog-title">Последний платёж</h3>
          <p>
            Документальный проект о долгах, стыде и возвращении контроля.
            Реальный трейлер появится после завершения производства.
          </p>

          {submissionState === "success" ? (
            <p className={styles.success} role="status">
              Адрес принят. Сообщим, когда премьера будет готова.
            </p>
          ) : (
            <form onSubmit={submitPremiere}>
              <input
                aria-hidden="true"
                autoComplete="off"
                className={styles.honeypot}
                tabIndex={-1}
                {...register("company")}
              />
              <input type="hidden" {...register("type")} />

              <label className={styles.emailField}>
                <span>Электронная почта</span>
                <input
                  autoComplete="email"
                  placeholder="name@example.ru"
                  type="email"
                  {...register("email")}
                />
              </label>
              {errors.email ? (
                <p className={styles.formError}>{errors.email.message}</p>
              ) : null}

              <label className={styles.consent}>
                <input type="checkbox" {...register("consent")} />
                <span>
                  Согласен с{" "}
                  <Link href="/personal-data-consent">
                    обработкой персональных данных
                  </Link>
                </span>
              </label>
              {errors.consent ? (
                <p className={styles.formError}>{errors.consent.message}</p>
              ) : null}

              <button
                className={styles.submit}
                disabled={submissionState === "submitting"}
                type="submit"
              >
                <span>
                  {submissionState === "submitting"
                    ? "Отправляем…"
                    : "Сообщить о премьере"}
                </span>
                <ArrowIcon />
              </button>

              {submissionState === "error" ? (
                <p className={styles.formError} role="alert">
                  {serverMessage}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}
