import type { Metadata } from "next";
import { HomeBoard } from "@/components/home-board";
import { SiteFrame } from "@/components/site-frame";
import { profile, resume } from "@/content/portfolio";
import { isPdfAsset, publicAssetExists } from "@/lib/public-file";

export const metadata: Metadata = {
  title: { absolute: "Aryan Jagtap — Portfolio" },
  description: `${profile.supporting} ${profile.positioning}`,
};

export default function HomePage() {
  return (
    <SiteFrame fit>
      <HomeBoard
        portraitReady={publicAssetExists(profile.portrait.src)}
        resumeReady={isPdfAsset(resume.href)}
      />
    </SiteFrame>
  );
}
