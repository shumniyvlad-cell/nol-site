import { BrandTurnSection } from "@/components/brand-turn/brand-turn-section";
import { DiagnosticSection } from "@/components/diagnostic/diagnostic-section";
import { FinalThresholdSection } from "@/components/final/final-threshold-section";
import { HeroSection } from "@/components/hero/hero-section";
import { LegalClaritySection } from "@/components/legal/legal-clarity-section";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ManifestoCreditsSection } from "@/components/manifesto/manifesto-credits-section";
import { MediaSection } from "@/components/media/media-section";
import { PriceSection } from "@/components/price/price-section";
import { ProblemSection } from "@/components/problem/problem-section";
import { ProcessSection } from "@/components/process/process-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <BrandTurnSection />
        <DiagnosticSection />
        <ProcessSection />
        <LegalClaritySection />
        <PriceSection />
        <MediaSection />
        <ManifestoCreditsSection />
        <FinalThresholdSection />
      </main>
      <SiteFooter />
    </>
  );
}
