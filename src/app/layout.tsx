import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const heroIntroStateScript = `
  (() => {
    const key = "nol:hero-intro:v2";
    try {
      const hasPlayed = window.localStorage.getItem(key) === "played";
      document.documentElement.dataset.heroIntro = hasPlayed ? "seen" : "first";
      if (!hasPlayed) {
        window.localStorage.setItem(key, "played");
      }
    } catch {
      document.documentElement.dataset.heroIntro = "first";
    }
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "НОЛЬ — юридическое сопровождение банкротства и новая финансовая жизнь",
    template: "%s — НОЛЬ",
  },
  description:
    "Спокойно разбираем долговую ситуацию, оцениваем риски и сопровождаем законную процедуру банкротства физических лиц. Без давления и ложных гарантий.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "НОЛЬ",
    title: "НОЛЬ — новая финансовая жизнь",
    description:
      "Юридическое сопровождение банкротства без давления и ложных гарантий.",
    images: [
      {
        url: "/media/og-home.webp",
        width: 1200,
        height: 630,
        alt: "Световой портал НОЛЬ над тёмной отражающей поверхностью",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "НОЛЬ — новая финансовая жизнь",
    description:
      "Спокойно разбираем долговую ситуацию и объясняем возможные законные сценарии.",
    images: ["/media/og-home.webp"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  interactiveWidget: "resizes-content",
  themeColor: "#050505",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${plexMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: heroIntroStateScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Перейти к содержанию
        </a>
        {children}
      </body>
    </html>
  );
}
