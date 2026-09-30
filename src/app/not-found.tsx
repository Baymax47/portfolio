import type { Metadata } from "next";
import Link from "next/link";
import { SiteFrame } from "@/components/site-frame";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page is not part of Aryan Jagtap’s portfolio.",
};

export default function NotFound() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-[640px] py-16 text-center">
        <h1 className="text-[32px] font-medium">This page is not here</h1>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
          The link does not match a page on this portfolio.
        </p>
        <Link className="action-button mt-8 inline-flex w-auto" href="/">
          Back to portfolio
        </Link>
      </div>
    </SiteFrame>
  );
}
