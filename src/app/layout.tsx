import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeBoot } from "@/components/theme-boot";
import "./globals.css";
import "./phase1.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

const directionContract =
  "THESIS: Aryan's portfolio leads with a compact bento of work, refusing a giant headline and a conventional navigation bar. " +
  "OWN-WORLD: Cool off-white and near-black surfaces, 32px card corners, DM Sans at intimate sizes, photographic tiles, and a narrow utility rail. " +
  "STORY: A visitor sees who Aryan is, opens two labeled demo studies, and meets honest gaps where email, resume, and career dates are still missing. " +
  "FIRST VIEWPORT: A framed board with the introduction, Cashless, and Job Portal, then portrait, About, and a coming soon tile, with socials, resume, theme, and contact in the rail. " +
  "FORM: Brief pinned Bentox bento. The concept seed was not rolled because the recreation brief fixes this visual world. " +
  "FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md";

const themeBoot =
  'document.documentElement.setAttribute("data-theme","dark");';

export const metadata: Metadata = {
  title: {
    default: "Aryan Jagtap — Portfolio",
    template: "%s — Aryan Jagtap",
  },
  description:
    "Portfolio of Aryan Jagtap, Senior Associate UX Designer at Digit Insurance in Bangalore.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <body className={`${dmSans.className} antialiased`}>
        <ThemeBoot />
        <div
          hidden
          dangerouslySetInnerHTML={{ __html: `<!-- ${directionContract} -->` }}
        />
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
        <a className="skip-link" href="#content">
          Skip to content
        </a>
        <div id="content" className="page-enter">
          {children}
        </div>
      </body>
    </html>
  );
}
