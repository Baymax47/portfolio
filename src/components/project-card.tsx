import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Project } from "@/content/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="project-card">
      <span className="project-media">
        <Image
          src={project.tileImage}
          alt=""
          fill
          sizes="(min-width: 1200px) 280px, 100vw"
          className="object-cover"
        />
      </span>
      {project.demo ? <span className="demo-badge">Demo</span> : null}
      <span className="project-meta">
        <span>
          <span className="project-category">{project.category}</span>
          <span className="project-name">{project.name}</span>
        </span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </span>
    </Link>
  );
}

export function ComingSoonCard({
  title,
  status,
  image,
  alt,
}: {
  title: string;
  status: string;
  image: string;
  alt: string;
}) {
  return (
    <article className="coming-soon-card">
      <Image src={image} alt={alt} fill sizes="(min-width: 1200px) 320px, 100vw" className="object-cover" />
      <div className="coming-soon-copy">
        <p>{status}</p>
        <h2>{title}</h2>
      </div>
    </article>
  );
}
