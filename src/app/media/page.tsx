import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/interior-shell";

export const metadata: Metadata = {
  title: "Медиа",
  description:
    "Редакционные материалы НОЛЬ о долгах, процедуре и выборе юридического сопровождения.",
};

const materials = [
  [
    "hidden-debt",
    "Почему человек скрывает долги даже от близких",
    "Материал о тревоге, стыде и разговоре с семьёй без давления и универсальных рецептов.",
  ],
  [
    "after-procedure",
    "Что происходит после завершения процедуры",
    "Нейтральный разбор следующего этапа. Юридические последствия будут проверяться перед публикацией.",
  ],
  [
    "seven-questions",
    "Семь вопросов, которые нужно задать до подписания договора",
    "Редакционный чек-лист о составе услуги, ограничениях, цене, сроках и ответственности сторон.",
  ],
] as const;

export default function MediaPage() {
  return (
    <InteriorShell
      action={{ href: "/#media", label: "Открыть «Последний платёж»" }}
      eyebrow="Редакция / 001"
      lead="Мы говорим о долгах так, как о них обычно не говорят: спокойно, проверяемо и без продажи страха."
      title="Документы, разговоры, контекст."
    >
      {materials.map(([id, title, description], index) => (
        <article id={id} key={id}>
          <h2>
            {String(index + 1).padStart(2, "0")}
            <br />
            {title}
          </h2>
          <p>{description}</p>
        </article>
      ))}
    </InteriorShell>
  );
}
