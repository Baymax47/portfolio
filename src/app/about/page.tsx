import type { Metadata } from "next";
import { AboutContent } from "@/components/about-content";
import { HomeCloseButton } from "@/components/home-close-button";
import { SiteFrame } from "@/components/site-frame";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Aryan Jagtap, a UX designer and web developer based in Bangalore, currently a Senior Associate UX Designer at Digit Insurance.",
};

export default function AboutPage() {
  return (
    <SiteFrame>
      <HomeCloseButton />
      <div className="internal-top">
        <div className="internal-theme">
          <ThemeToggle variant="icon" />
        </div>
        <AboutContent />
      </div>
    </SiteFrame>
  );
}
