import Image from "next/image";
import { about, comingSoon, profile, projects } from "@/content/portfolio";
import { CopyEmailButton } from "@/components/copy-email-button";
import { ExperienceSummary } from "@/components/experience-summary";
import { ComingSoonCard, ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { SocialLinks } from "@/components/social-links";
import { ClockCard } from "@/components/clock-card";
import { ToolStack } from "@/components/tool-stack";

export function HomeBoard({
  portraitReady,
  resumeReady,
}: {
  portraitReady: boolean;
  resumeReady: boolean;
}) {
  const cashless = projects.find((project) => project.slug === "cashless");
  const jobPortal = projects.find((project) => project.slug === "job-portal");

  return (
    <>
      <div className="main-bento">
        <div className="bento-row row-one">
          <section className="bento-card intro-card">
            <div className="intro-copy">
              <h1>{profile.headline}</h1>
              <p>{profile.supporting}</p>
            </div>
          </section>
          {cashless ? <ProjectCard project={cashless} /> : null}
          {jobPortal ? <ProjectCard project={jobPortal} /> : null}
        </div>
        <div className="bento-row row-two">
          <figure className="portrait-card">
            {portraitReady ? (
              <Image
                src={profile.portrait.src}
                alt={profile.portrait.alt}
                fill
                sizes="(min-width: 1200px) 280px, 100vw"
                className="object-cover"
                style={{ objectPosition: profile.portrait.objectPosition }}
                priority
              />
            ) : (
              <div className="portrait-placeholder" aria-hidden="true">
                <p>AJ</p>
              </div>
            )}
          </figure>
          <section className="about-card bento-card" aria-labelledby="about-card-title">
            <p className="field-label">About</p>
            <h2 id="about-card-title">
              <span className="about-lead">{about.cardLead}</span>
              {about.cardTitle}
            </h2>
          </section>
          <ComingSoonCard {...comingSoon} />
        </div>
        <div className="bento-row row-three">
          <ExperienceSummary />
          <ToolStack variant="strip" />
        </div>
      </div>
      <aside className="utility-rail">
        <SocialLinks />
        <ResumeCard available={resumeReady} />
        <ClockCard />
        <section className="bento-card contact-card" aria-labelledby="contact-title">
          <h2 id="contact-title">Have a project in mind?</h2>
          <div className="contact-foot">
            <CopyEmailButton email={profile.email} />
          </div>
        </section>
      </aside>
    </>
  );
}
