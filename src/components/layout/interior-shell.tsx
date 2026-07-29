import Link from "next/link";
import type { ReactNode } from "react";
import { ZeroMark } from "@/components/brand/zero-mark";
import { ArrowIcon } from "@/components/icons/arrow-icon";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import styles from "./interior-shell.module.css";

type InteriorShellProps = {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
  action?: {
    href: string;
    label: string;
  };
};

export function InteriorShell({
  eyebrow,
  title,
  lead,
  children,
  action,
}: InteriorShellProps) {
  return (
    <>
      <SiteHeader />
      <main
        className={styles.main}
        data-header-theme="light"
        id="main-content"
      >
        <div aria-hidden="true" className={styles.axis} />
        <ZeroMark aria-hidden="true" className={styles.watermark} />

        <header className={styles.intro}>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
          <p>{lead}</p>
          {action ? (
            <Link className={styles.action} href={action.href}>
              <span>{action.label}</span>
              <ArrowIcon />
            </Link>
          ) : null}
        </header>

        <div className={styles.content}>{children}</div>
      </main>
      <SiteFooter variant="solid" />
    </>
  );
}
