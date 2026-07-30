"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ZeroMark } from "@/components/brand/zero-mark";
import { siteConfig } from "@/config/site";
import styles from "./site-header.module.css";

type HeaderTheme = "dark" | "light" | "split";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<HeaderTheme>("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const viewport = window.visualViewport;

    const updateVisualViewport = () => {
      const height = viewport?.height ?? window.innerHeight;
      root.style.setProperty("--visual-viewport-height", `${height}px`);
    };

    updateVisualViewport();
    viewport?.addEventListener("resize", updateVisualViewport);
    viewport?.addEventListener("scroll", updateVisualViewport);
    window.addEventListener("pageshow", updateVisualViewport);

    return () => {
      viewport?.removeEventListener("resize", updateVisualViewport);
      viewport?.removeEventListener("scroll", updateVisualViewport);
      window.removeEventListener("pageshow", updateVisualViewport);
      root.style.removeProperty("--visual-viewport-height");
    };
  }, []);

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

      const headerBottom =
        document.querySelector<HTMLElement>("header")?.getBoundingClientRect()
          .bottom ?? 36;
      const headerProbe = headerBottom + 24;
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

    const root = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const menuButton = menuButtonRef.current;
    const previousRootOverflow = root.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyOverflow = body.style.overflow;

    root.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      menuContentRef.current
        ?.querySelector<HTMLElement>("a[href], button:not([disabled])")
        ?.focus({ preventScroll: true });
    });

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        menuContentRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      root.style.overflow = previousRootOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.overflow = previousBodyOverflow;
      window.scrollTo({ top: scrollY, behavior: "auto" });
      window.removeEventListener("keydown", closeOnEscape);
      menuButton?.focus({ preventScroll: true });
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
          data-testid="mobile-menu-toggle"
          disabled={!isHydrated}
          onClick={() => setIsMenuOpen((current) => !current)}
          ref={menuButtonRef}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {isMenuOpen ? (
        <div
          aria-label="Навигация по сайту"
          aria-modal="true"
          className={styles.mobileMenu}
          data-testid="mobile-menu-dialog"
          id="mobile-navigation"
          role="dialog"
        >
          <button
            aria-label="Закрыть меню"
            className={styles.menuBackdrop}
            data-testid="mobile-menu-backdrop"
            onClick={closeMenu}
            tabIndex={-1}
            type="button"
          />
          <div className={styles.mobileMenuContent} ref={menuContentRef}>
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
        </div>
      ) : null}
    </header>
  );
}
