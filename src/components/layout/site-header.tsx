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
    let animationFrame = 0;
    const desktopThemedSections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-header-theme]"),
    );
    const compactThemedSections = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-header-theme], [data-header-theme-mobile]",
      ),
    );

    const updateHeader = () => {
      animationFrame = 0;
      const nextIsScrolled = window.scrollY > 48;
      setIsScrolled((current) =>
        current === nextIsScrolled ? current : nextIsScrolled,
      );

      const headerProbe = 36;
      const isCompactViewport = window.innerWidth < 900;
      const themedSections = isCompactViewport
        ? compactThemedSections
        : desktopThemedSections;
      let activeSection: HTMLElement | undefined;

      for (const section of themedSections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= headerProbe && rect.bottom > headerProbe) {
          activeSection = section;
        }
      }

      const nextTheme =
        (isCompactViewport
          ? activeSection?.dataset.headerThemeMobile
          : undefined) ?? activeSection?.dataset.headerTheme;
      const resolvedTheme =
        nextTheme === "light" || nextTheme === "split" ? nextTheme : "dark";
      setTheme((current) =>
        current === resolvedTheme ? current : resolvedTheme,
      );
    };

    const requestHeaderUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateHeader);
      }
    };

    updateHeader();
    const hydrationFrame = window.requestAnimationFrame(() => {
      setIsHydrated(true);
      updateHeader();
    });
    const hashScrollTimer = window.setTimeout(requestHeaderUpdate, 160);
    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
    window.addEventListener("resize", requestHeaderUpdate);
    window.addEventListener("hashchange", requestHeaderUpdate);
    return () => {
      if (animationFrame !== 0) {
        window.cancelAnimationFrame(animationFrame);
      }
      window.cancelAnimationFrame(hydrationFrame);
      window.clearTimeout(hashScrollTimer);
      window.removeEventListener("scroll", requestHeaderUpdate);
      window.removeEventListener("resize", requestHeaderUpdate);
      window.removeEventListener("hashchange", requestHeaderUpdate);
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
