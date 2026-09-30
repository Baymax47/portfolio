import Behance from "@thesvg/react/behance";
import Instagram from "@thesvg/react/instagram";
import Linkedin from "@thesvg/react/linkedin";
import X from "@thesvg/react/x";
import { socialHref, socials, type SocialLink } from "@/content/portfolio";

function Icon({ id }: { id: SocialLink["id"] }) {
  const props = { width: 24, height: 24, "aria-hidden": true as const };
  if (id === "linkedin") return <Linkedin {...props} className="social-glyph is-linkedin" />;
  if (id === "instagram") return <Instagram {...props} className="social-glyph is-instagram" variant="mono" />;
  if (id === "behance") return <Behance {...props} className="social-glyph is-behance" variant="mono" />;
  return <X {...props} className="social-glyph is-x" variant="mono" />;
}

export function SocialLinks() {
  return (
    <ul className="social-grid">
      {socials.map((link) => {
        const href = socialHref(link);
        const unavailable = "Link coming soon";

        if (!href) {
          return (
            <li key={link.id}>
              <div className="social-tile is-unavailable" role="group" aria-label={`${link.label}. ${unavailable}`}>
                <Icon id={link.id} />
              </div>
            </li>
          );
        }

        const external = href.startsWith("http");
        return (
          <li key={link.id}>
            <a
              href={href}
              className="social-tile"
              aria-label={link.label}
              title={link.label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon id={link.id} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
