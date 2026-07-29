export const siteConfig = {
  name: "НОЛЬ",
  descriptor: "Новая жизнь без долгов",
  navigation: [
    { label: "Как это работает", href: "#process" },
    { label: "Истории", href: "/stories" },
    { label: "Медиа", href: "#media" },
    { label: "Вопросы", href: "#legal" },
    { label: "О нас", href: "#about" },
  ],
  primaryAction: {
    label: "Оценить ситуацию",
    href: "#diagnostic",
  },
  company: {
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "НОЛЬ",
    legalName: process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME ?? null,
    inn: process.env.NEXT_PUBLIC_COMPANY_INN ?? null,
    ogrn: process.env.NEXT_PUBLIC_COMPANY_OGRN ?? null,
    address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS ?? null,
    phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? null,
    email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? null,
    telegram: process.env.NEXT_PUBLIC_TELEGRAM_URL ?? null,
    workingHours: process.env.NEXT_PUBLIC_WORKING_HOURS ?? null,
  },
} as const;

export type SiteNavigationItem = (typeof siteConfig.navigation)[number];

export function hasRequiredCompanyDetails() {
  return Boolean(
    siteConfig.company.legalName &&
      siteConfig.company.inn &&
      siteConfig.company.email,
  );
}
