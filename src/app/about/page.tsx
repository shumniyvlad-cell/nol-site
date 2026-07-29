import type { Metadata } from "next";
import { ManifestoCreditsSection } from "@/components/manifesto/manifesto-credits-section";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "О бренде",
  description:
    "Философия НОЛЬ, принципы работы, launch mode и роли команды без вымышленных профилей.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <ManifestoCreditsSection />
      </main>
      <SiteFooter variant="solid" />
    </>
  );
}
