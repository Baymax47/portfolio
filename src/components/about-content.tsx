"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { about, experience, photos, profile, skills } from "@/content/portfolio";
import { CopyEmailButton } from "@/components/copy-email-button";
import { ToolStack } from "@/components/tool-stack";
import { formatDateRange } from "@/lib/experience";

export function AboutContent() {
  return (
    <div className="mx-auto grid max-w-[1060px] gap-4">
      <header className="bento-card p-8 min-[1200px]:p-10">
        <h1 className="text-[32px] leading-[1.25] font-medium">{profile.displayName}</h1>
        <p className="mt-4 max-w-[62ch] text-[22px] leading-[1.5]">{about.story}</p>
      </header>

      <section className="bento-card p-8 min-[1200px]:p-10" aria-labelledby="current-work-title">
        <h2 id="current-work-title" className="text-[24px] leading-[1.4] font-medium">
          Current work
        </h2>
        <p className="mt-4 max-w-[62ch] text-lg leading-8">{about.currentWork}</p>
        <p className="mt-4 max-w-[62ch] text-base leading-7 text-[var(--muted)]">
          {profile.positioning}
        </p>
      </section>

      <section className="bento-card p-8 min-[1200px]:p-10" aria-labelledby="experience-list-title">
        <h2 id="experience-list-title" className="text-[24px] leading-[1.4] font-medium">
          Experience
        </h2>
        <ol className="mt-6 grid gap-6">
          {experience.map((entry) => (
            <li key={entry.id} className="border-t border-[var(--line)] pt-5 first:border-t-0 first:pt-0">
              <p className="text-xl font-medium">{entry.role}</p>
              <p className="mt-1">{entry.organization}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{formatDateRange(entry)}</p>
              <p className="mt-3 max-w-[62ch] leading-7">{entry.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <SkillsCarousel />
      <ToolStack />
      <PhotoCarousel />

      <section className="bento-card p-8 min-[1200px]:p-10" aria-labelledby="about-contact-title">
        <h2 id="about-contact-title" className="text-[24px] leading-[1.4] font-medium">
          {about.contactHeading}
        </h2>
        {profile.email ? (
          <>
            <p className="mt-4">
              <a className="selectable-email" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </p>
            <div className="mt-4">
              <CopyEmailButton email={profile.email} />
            </div>
          </>
        ) : (
          <>
            <p className="mt-4 text-[var(--muted)]">Email coming soon</p>
            <div className="mt-4">
              <CopyEmailButton email={null} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function SkillsCarousel() {
  const [index, setIndex] = useState(0);
  const skill = skills[index];

  return (
    <section className="bento-card p-8 min-[1200px]:p-10" aria-labelledby="skills-title" aria-roledescription="carousel">
      <div className="flex items-center justify-between gap-4">
        <h2 id="skills-title" className="text-[24px] leading-[1.4] font-medium">
          Skills
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous skill"
            onClick={() => setIndex((value) => (value - 1 + skills.length) % skills.length)}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Next skill"
            onClick={() => setIndex((value) => (value + 1) % skills.length)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      {skill ? (
        <div className="mt-6" aria-live="polite">
          <p className="text-[22px] leading-[1.4] font-medium">{skill.title}</p>
          <p className="mt-3 max-w-[58ch] text-lg leading-8">{skill.body}</p>
          <p className="mt-4 text-sm text-[var(--muted)]">
            {index + 1} of {skills.length}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function PhotoCarousel() {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  const photo = photos[index];
  if (!photo) return null;

  return (
    <section className="bento-card overflow-hidden p-4" aria-labelledby="photos-title">
      <div className="flex items-center justify-between px-4 pt-4">
        <h2 id="photos-title" className="text-[24px] font-medium">
          Photos
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous photo"
            onClick={() => setIndex((value) => (value - 1 + photos.length) % photos.length)}
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Next photo"
            onClick={() => setIndex((value) => (value + 1) % photos.length)}
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
      <figure className="relative mt-4 aspect-[4/3] overflow-hidden rounded-[24px]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1060px) 1060px, 100vw"
          className="object-cover"
          style={{ objectPosition: "center center" }}
        />
      </figure>
    </section>
  );
}
