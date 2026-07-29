import type { Metadata } from "next";
import { InteriorShell } from "@/components/layout/interior-shell";
import { hasRequiredCompanyDetails, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Контакты и реквизиты",
  description: "Проверяемые контакты и реквизиты бренда НОЛЬ.",
};

export default function ContactsPage() {
  const company = siteConfig.company;
  const isConfigured = hasRequiredCompanyDetails();

  return (
    <InteriorShell
      action={{ href: "/diagnostic", label: "Пройти диагностику" }}
      eyebrow="Контакты / Проверяемые данные"
      lead={
        isConfigured
          ? "Здесь опубликованы централизованные контактные данные и реквизиты."
          : "Обязательные реквизиты и прямые каналы пока не заполнены. Поэтому блок не маскируется вымышленными данными."
      }
      title="Связь начинается с проверяемого адреса."
    >
      <section id="details">
        <h2>{isConfigured ? "Реквизиты" : "Данные готовятся"}</h2>
        {isConfigured ? (
          <dl>
            <dt>Юридическое наименование</dt>
            <dd>{company.legalName}</dd>
            <dt>ИНН</dt>
            <dd>{company.inn}</dd>
            {company.ogrn ? (
              <>
                <dt>ОГРН</dt>
                <dd>{company.ogrn}</dd>
              </>
            ) : null}
            {company.address ? (
              <>
                <dt>Адрес</dt>
                <dd>{company.address}</dd>
              </>
            ) : null}
          </dl>
        ) : (
          <p>
            Production-приём заявок отключён до заполнения юридического
            наименования, ИНН и электронной почты оператора.
          </p>
        )}
      </section>

      <section>
        <h2>Каналы</h2>
        {company.email || company.phone || company.telegram ? (
          <dl>
            {company.email ? (
              <>
                <dt>Электронная почта</dt>
                <dd>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </dd>
              </>
            ) : null}
            {company.phone ? (
              <>
                <dt>Телефон</dt>
                <dd>
                  <a href={`tel:${company.phone}`}>{company.phone}</a>
                </dd>
              </>
            ) : null}
            {company.telegram ? (
              <>
                <dt>Telegram</dt>
                <dd>
                  <a href={company.telegram}>Открыть канал связи</a>
                </dd>
              </>
            ) : null}
          </dl>
        ) : (
          <p>
            Телефон, электронная почта и Telegram пока не указаны. Мы не
            подставляем случайные контакты.
          </p>
        )}
      </section>
    </InteriorShell>
  );
}
