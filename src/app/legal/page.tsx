import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/interior-shell";
import { legalDisclaimer, legalQuestions } from "@/content/legal";

export const metadata: Metadata = {
  title: "Правовая информация",
  description:
    "Нейтральные ответы на вопросы о процедуре и постоянная оговорка об индивидуальной оценке.",
};

export default function LegalPage() {
  return (
    <InteriorShell
      action={{ href: "/diagnostic", label: "Описать мою ситуацию" }}
      eyebrow="Правовая информация / Редактируемый слой"
      lead={`${legalDisclaimer} Перед публикацией юридически изменяемые ответы должны проходить проверку специалистом.`}
      title="Точный ответ живёт в обстоятельствах."
    >
      {legalQuestions.map((item, index) => (
        <section id={item.id === "cost" ? "price" : item.id} key={item.id}>
          <h2>
            {String(index + 1).padStart(2, "0")}
            <br />
            {item.question}
          </h2>
          <p>{item.answer}</p>
        </section>
      ))}
      <section>
        <h2>Стоимость</h2>
        <div>
          <p>Полное сопровождение — от 300 000 ₽.</p>
          <p>
            Итоговая стоимость зависит от обстоятельств и фиксируется после
            анализа ситуации и состава работ.
          </p>
        </div>
      </section>
    </InteriorShell>
  );
}
