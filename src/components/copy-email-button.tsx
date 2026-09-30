"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "copied" | "error";

export function CopyEmailButton({
  email,
  className,
}: {
  email: string | null;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status !== "copied") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2000);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy() {
    if (!email) return;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "copied"
      ? "Email address copied."
      : status === "error"
        ? "Couldn’t copy automatically. Select the address above and copy it manually."
        : "";

  return (
    <div className={className}>
      <Button
        type="button"
        size="lg"
        className="h-12 w-full rounded-full px-4 text-base"
        disabled={!email}
        onClick={copy}
      >
        {status === "copied" ? <Check /> : <Copy />}
        {status === "copied" ? "Copied" : "Copy email"}
      </Button>
      <p
        aria-live="polite"
        className={message ? "mt-2 text-sm text-[var(--muted)]" : "m-0 h-0 overflow-hidden"}
      >
        {message}
      </p>
    </div>
  );
}
