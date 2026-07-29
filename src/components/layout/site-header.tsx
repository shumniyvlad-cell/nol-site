"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ZeroMark } from "@/components/brand/zero-mark";
import { siteConfig } from "@/config/site";
import styles from "./site-header.module.css";

type HeaderTheme = "dark" | "light" | "split";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<HeaderTheme>("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const updateHeader = () => {
      setIsScrolled(window.scrollY > 48);

      const headerProbe = 36;
      const isCompactViewport = window.innerWidth < 900;
      const themedSections = Array.from(
        document.querySelectorAll<HTMLElement>(
          isCompactViewport
            ? "[data-header-theme], [data-header-theme-mobile]"
            : "[data-header-theme]",
        ),
      );
      const activeSection = themedSections
        .filter((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= headerProbe && rect.bottom > headerProbe;
        })
        .at(-1);

      const nextTheme =
        (isCompactViewport
          ? activeSection?.dataset.headerThemeMobile
          : undefined) ?? activeSection?.dataset.headerTheme;
      setTheme(
        nextTheme === "light" || nextTheme === "split" ? nextTheme : "dark",
      );
    };
    updateHeader();
    const animationFrame = window.requestAnimationFrame(() => {
      setIsHydrated(true);
      updateHeader();
    });
    const hashScrollTimer = window.setTimeout(updateHeader, 160);
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    window.addEventListener("hashchange", updateHeader);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(hashScrollTimer);
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
      window.removeEventListener("hashchange", updateHeader);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`${styles.header} ${isScrolled ? styles.scrolled : ""} ${
        isMenuOpen ? styles.menuActive : ""
      } ${theme === "light" ? styles.light : ""} ${
        theme === "split" ? styles.split : ""
      }`}
    >
      <div className={styles.inner}>
        <Link
          aria-label="НОЛЬ — на главную"
          className={styles.brand}
          href="/"
          onClick={closeMenu}
        >
          <span className={styles.wordmark}>НОЛЬ</span>
          <ZeroMark className={styles.mark} />
        </Link>

        <nav aria-label="Основная навигация" className={styles.navigation}>
          {siteConfig.navigation.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className={styles.cta} href={siteConfig.primaryAction.href}>
          <span>{siteConfig.primaryAction.label}</span>
          <span aria-hidden="true" className={styles.ctaSignal} />
        </Link>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          className={styles.menuButton}
          disabled={!isHydrated}
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {isMenuOpen ? (
        <div className={styles.mobileMenu} id="mobile-navigation">
          <nav aria-label="Мобильная навигация">
            {siteConfig.navigation.map((item, index) => (
              <Link href={item.href} key={item.href} onClick={closeMenu}>
                <span className={styles.mobileIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <Link
            className={styles.mobileCta}
            href={siteConfig.primaryAction.href}
            onClick={closeMenu}
          >
            {siteConfig.primaryAction.label}
          </Link>
        </div>
      ) : null}
    </header>
  );
}
