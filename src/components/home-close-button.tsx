import { X } from "lucide-react";
import Link from "next/link";

export function HomeCloseButton() {
  return (
    <Link href="/" className="home-close" aria-label="Back to homepage">
      <X size={20} aria-hidden="true" />
    </Link>
  );
}
