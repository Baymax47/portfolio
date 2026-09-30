import { Download } from "lucide-react";
import { resume } from "@/content/portfolio";

export function ResumeCard({ available }: { available: boolean }) {
  return (
    <section className="bento-card resume-card" aria-labelledby="resume-title">
      <div>
        <p className="field-label">{resume.label}</p>
        <h2 id="resume-title">{resume.title}</h2>
        {available ? null : <p className="missing-note">Resume coming soon</p>}
      </div>
      <div className="resume-actions">
        {available ? (
          <>
            <a className="action-button is-primary" href={resume.href} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
            <a className="action-button" href={resume.href} download={resume.downloadName}>
              <Download size={16} aria-hidden="true" />
              Download PDF
            </a>
          </>
        ) : (
          <>
            <button type="button" className="action-button is-primary" disabled>
              View Resume
            </button>
            <button type="button" className="action-button" disabled>
              <Download size={16} aria-hidden="true" />
              Download PDF
            </button>
          </>
        )}
      </div>
    </section>
  );
}
