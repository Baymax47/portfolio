import Image from "next/image";
import Link from "next/link";
import { demoNotice, type Project } from "@/content/portfolio";
import { ThemeToggle } from "@/components/theme-toggle";

export function CaseStudyLayout({
  project,
  others,
}: {
  project: Project;
  others: Project[];
}) {
  return (
    <article className="internal-top">
      <div className="internal-theme">
        <ThemeToggle variant="icon" />
      </div>
      <header className="mx-auto mt-8 max-w-[1060px]">
        <h1 className="text-[40px] leading-tight font-medium md:text-[48px]">{project.name}</h1>
        <p className="mt-2 text-[18px] text-[var(--muted)]">{project.category}</p>
        {project.demo ? (
          <p className="demo-note mt-6" role="note">
            {demoNotice} This case study is hypothetical and does not describe Aryan’s client work.
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)]">
          <dl className="bento-card grid gap-5 p-6">
            <div>
              <dt className="field-label">Organization</dt>
              <dd className="mt-2 text-lg">{project.metadata.organization}</dd>
            </div>
            <div>
              <dt className="field-label">Role</dt>
              <dd className="mt-2 text-lg">{project.metadata.role}</dd>
            </div>
            <div>
              <dt className="field-label">Tools</dt>
              <dd className="mt-2 text-lg">{project.metadata.tools.join(", ")}</dd>
            </div>
            <div>
              <dt className="field-label">Timeline</dt>
              <dd className="mt-2 text-lg">{project.metadata.timeline}</dd>
            </div>
          </dl>
          <div className="bento-card p-6 md:p-8">
            <h2 className="field-label">Summary</h2>
            <p className="mt-3 text-lg leading-8">{project.summary}</p>
            <h2 className="field-label mt-6">Context</h2>
            <p className="mt-3 max-w-[62ch] text-lg leading-8">{project.context}</p>
            {project.prototypeUrl ? (
              <a
                className="action-button mt-6 inline-flex w-auto"
                href={project.prototypeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View prototype
              </a>
            ) : null}
          </div>
        </div>

        <figure className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[32px] border border-[var(--line)]">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            priority
            sizes="(min-width: 1060px) 1060px, 100vw"
            className="object-cover"
          />
        </figure>
      </header>

      <div className="mx-auto mt-12 grid max-w-[840px] gap-10">
        {project.sections.map((block) => {
          if (block.type === "text") {
            return (
              <section key={block.heading}>
                <h2 className="text-[28px] leading-[1.3] font-medium">{block.heading}</h2>
                <p className="mt-4 text-lg leading-8">{block.body}</p>
              </section>
            );
          }
          if (block.type === "list") {
            return (
              <section key={block.heading}>
                <h2 className="text-[28px] leading-[1.3] font-medium">{block.heading}</h2>
                <ul className="mt-4 list-disc space-y-3 pl-5">
                  {block.items.map((item) => (
                    <li key={item} className="text-lg leading-8">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            );
          }
          if (block.type === "image") {
            return (
              <figure key={block.src} className="overflow-hidden rounded-[28px] border border-[var(--line)]">
                <div className="relative aspect-[16/9]">
                  <Image src={block.src} alt={block.alt} fill sizes="(min-width: 840px) 840px, 100vw" className="object-cover" />
                </div>
                {block.caption ? (
                  <figcaption className="px-4 py-3 text-sm text-[var(--muted)]">{block.caption}</figcaption>
                ) : null}
              </figure>
            );
          }
          if (block.type === "two-image") {
            return (
              <div key={block.images.map((image) => image.src).join("-")} className="grid gap-4 md:grid-cols-2">
                {block.images.map((image) => (
                  <figure key={image.src} className="overflow-hidden rounded-[28px] border border-[var(--line)]">
                    <div className="relative aspect-[4/3]">
                      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 840px) 410px, 100vw" className="object-cover" />
                    </div>
                    {image.caption ? (
                      <figcaption className="px-4 py-3 text-sm text-[var(--muted)]">{image.caption}</figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            );
          }
          return (
            <blockquote key={block.text} className="border-t border-[var(--line)] pt-6">
              <p className="text-[26px] leading-[1.4] font-medium">{block.text}</p>
              {block.attribution ? (
                <footer className="mt-3 text-sm text-[var(--muted)]">{block.attribution}</footer>
              ) : null}
            </blockquote>
          );
        })}
      </div>

      <nav className="mx-auto mt-12 flex max-w-[840px] flex-wrap gap-3" aria-label="More work">
        <Link className="action-button w-auto" href="/">
          Back to work
        </Link>
        {others.map((other) => (
          <Link key={other.slug} className="action-button w-auto" href={`/work/${other.slug}`}>
            {other.name}
            {other.demo ? <span className="sr-only">, demo project</span> : null}
          </Link>
        ))}
      </nav>
    </article>
  );
}
