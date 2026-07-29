"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import { trackEvent } from "@/lib/analytics/client";
import {
  diagnosticLeadSchema,
  type DiagnosticLeadInput,
} from "@/lib/leads/schema";
import styles from "./diagnostic-lead-form.module.css";

type DiagnosticLeadFormProps = {
  answers: Record<string, string>;
};

function formatRussianPhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("8")) {
    digits = `7${digits.slice(1)}`;
  }
  if (!digits.startsWith("7")) {
    digits = `7${digits}`;
  }

  digits = digits.slice(0, 11);
  const local = digits.slice(1);
  let formatted = "+7";

  if (local.length > 0) {
    formatted += ` (${local.slice(0, 3)}`;
  }
  if (local.length >= 3) {
    formatted += ")";
  }
  if (local.length > 3) {
    formatted += ` ${local.slice(3, 6)}`;
  }
  if (local.length > 6) {
    formatted += `-${local.slice(6, 8)}`;
  }
  if (local.length > 8) {
    formatted += `-${local.slice(8, 10)}`;
  }

  return formatted;
}

function readUtm() {
  const params = new URLSearchParams(window.location.search);
  const entries = {
    source: params.get("utm_source") || undefined,
    medium: params.get("utm_medium") || undefined,
    campaign: params.get("utm_campaign") || undefined,
    content: params.get("utm_content") || undefined,
    term: params.get("utm_term") || undefined,
  };

  return Object.values(entries).some(Boolean) ? entries : undefined;
}

export function DiagnosticLeadForm({ answers }: DiagnosticLeadFormProps) {
  const [submissionState, setSubmissionState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [serverMessage, setServerMessage] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DiagnosticLeadInput>({
    resolver: zodResolver(diagnosticLeadSchema),
    defaultValues: {
      type: "diagnostic",
      name: "",
      phone: "+7",
      preferredContact: "call",
      comment: "",
      consent: false,
      company: "",
      answers,
      utm: undefined,
    },
  });

  const submitLead = handleSubmit(async (values) => {
    if (submissionState === "submitting" || submissionState === "success") {
      return;
    }

    setSubmissionState("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          answers,
          utm: readUtm(),
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Не удалось отправить заявку.");
      }

      setSubmissionState("success");
      trackEvent("diagnostic_lead_success", {
        preferredContact: values.preferredContact,
      });
      reset();
    } catch (error) {
      setSubmissionState("error");
      setServerMessage(
        error instanceof Error
          ? error.message
          : "Не удалось отправить заявку. Попробуйте ещё раз.",
      );
    }
  });

  if (submissionState === "success") {
    return (
      <div className={styles.success} role="status">
        <strong>Контакты приняты.</strong>
        <p>
          Специалист сможет изучить ответы и спокойно обсудить возможные
          сценарии. Отправлять форму повторно не нужно.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submitLead}>
      <input
        aria-hidden="true"
        autoComplete="off"
        className={styles.honeypot}
        tabIndex={-1}
        {...register("company")}
      />
      <input type="hidden" {...register("type")} />

      <div className={styles.primaryFields}>
        <label>
          <span>Имя</span>
          <input autoComplete="name" {...register("name")} />
          {errors.name ? <small>{errors.name.message}</small> : null}
        </label>

        <label>
          <span>Телефон</span>
          <input
            autoComplete="tel"
            inputMode="tel"
            {...register("phone", {
              onChange: (event) => {
                event.target.value = formatRussianPhone(event.target.value);
              },
            })}
          />
          {errors.phone ? <small>{errors.phone.message}</small> : null}
        </label>
      </div>

      <fieldset className={styles.contactMethod}>
        <legend>Предпочтительный способ связи</legend>
        <div>
          {[
            ["call", "Звонок"],
            ["telegram", "Telegram"],
            ["whatsapp", "WhatsApp"],
          ].map(([value, label]) => (
            <label key={value}>
              <input
                type="radio"
                value={value}
                {...register("preferredContact")}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className={styles.comment}>
        <span>Комментарий — необязательно</span>
        <textarea rows={2} {...register("comment")} />
        {errors.comment ? <small>{errors.comment.message}</small> : null}
      </label>

      <label className={styles.consent}>
        <input type="checkbox" {...register("consent")} />
        <span>
          Согласен с{" "}
          <Link href="/personal-data-consent">
            обработкой персональных данных
          </Link>{" "}
          и ознакомлен с{" "}
          <Link href="/privacy">политикой конфиденциальности</Link>.
        </span>
      </label>
      {errors.consent ? (
        <small className={styles.consentError}>{errors.consent.message}</small>
      ) : null}

      <button
        className={styles.submit}
        disabled={submissionState === "submitting"}
        type="submit"
      >
        <span>
          {submissionState === "submitting"
            ? "Отправляем…"
            : "Получить разбор ситуации"}
        </span>
        <ArrowIcon />
      </button>

      {submissionState === "error" ? (
        <p className={styles.serverError} role="alert">
          {serverMessage}
        </p>
      ) : null}
    </form>
  );
}
