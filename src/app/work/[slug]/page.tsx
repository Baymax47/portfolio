import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { HomeCloseButton } from "@/components/home-close-button";
import { SiteFrame } from "@/components/site-frame";
import { getProject, projects } from "@/content/portfolio";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return { title: "Project not found" };
  }

  return {
    title: project.name,
    description: project.demo
      ? `Demo case study: ${project.name}. Hypothetical layout content, not a record of Aryan Jagtap’s client work.`
      : project.summary,
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <SiteFrame>
      <HomeCloseButton />
      <CaseStudyLayout
        project={project}
        others={projects.filter((item) => item.slug !== project.slug)}
      />
    </SiteFrame>
  );
}
