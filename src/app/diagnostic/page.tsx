import type { Metadata } from "next";
import { DiagnosticSection } from "@/components/diagnostic/diagnostic-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Диагностика ситуации",
  description:
    "Семь вопросов о долгах, доходе, имуществе и сделках. Предварительная оценка без юридических обещаний.",
};

export default function DiagnosticPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <DiagnosticSection initialAnswers={{}} initialStep={0} />
      </main>
      <SiteFooter variant="solid" />
    </>
  );
}
