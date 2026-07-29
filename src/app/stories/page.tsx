import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/interior-shell";

export const metadata: Metadata = {
  title: "Истории",
  description:
    "Документальные истории НОЛЬ. Launch mode: материалы готовятся к публикации и проходят проверку.",
};

export default function StoriesPage() {
  return (
    <InteriorShell
      action={{ href: "/media", label: "Перейти в редакцию" }}
      eyebrow="Архив / Launch mode"
      lead="Первые истории готовятся к публикации. До проверки данных мы не публикуем отзывы, цифры, судебные дела или изображения людей."
      title="Истории без постановочных побед."
    >
      <section>
        <h2>Что появится здесь</h2>
        <p>
          Проверенные видеоистории, материалы с подтверждённым согласием героя
          и ссылки на обезличенные источники там, где это возможно.
        </p>
      </section>
      <section>
        <h2>Что не появится</h2>
        <p>
          Вымышленные отзывы, неподтверждённые результаты, чужие фотографии и
          обещания одинакового исхода для разных ситуаций.
        </p>
      </section>
    </InteriorShell>
  );
}
