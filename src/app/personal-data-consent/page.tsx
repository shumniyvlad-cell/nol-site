import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/interior-shell";
import { hasRequiredCompanyDetails, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Условия согласия для диагностической заявки и подписки на премьеру.",
};

export default function PersonalDataConsentPage() {
  const isConfigured = hasRequiredCompanyDetails();

  return (
    <InteriorShell
      eyebrow="Документ / Согласие"
      lead={
        isConfigured
          ? `Предполагаемый оператор: ${siteConfig.company.legalName}. Финальная формулировка должна быть проверена до запуска.`
          : "Форма согласия технически существует, но production-приём данных отключён до заполнения сведений оператора."
      }
      title="Согласие должно быть осознанным."
    >
      <section>
        <h2>Действие пользователя</h2>
        <p>
          Согласие не отмечено заранее. Пользователь ставит отметку отдельно
          перед отправкой диагностической заявки или подписки на премьеру.
        </p>
      </section>
      <section>
        <h2>Состав данных</h2>
        <p>
          Для диагностики: имя, телефон, способ связи, комментарий, ответы и
          UTM-метки. Для премьеры: электронная почта. Состав зависит от выбранной
          формы.
        </p>
      </section>
      <section>
        <h2>Цель</h2>
        <p>
          Связаться по запросу, разобрать предоставленную ситуацию или сообщить
          о готовности документального проекта. Данные не используются для
          обещания юридического результата.
        </p>
      </section>
      <section>
        <h2>Отзыв</h2>
        <p>
          Адрес и порядок отзыва должны быть опубликованы вместе с реквизитами
          реального оператора. Пока адрес не предоставлен, production-сбор
          заблокирован.
        </p>
      </section>
    </InteriorShell>
  );
}
