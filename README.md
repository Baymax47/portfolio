# Aryan Jagtap portfolio

A compact portfolio based on the Bentox bento layout, with Aryan’s own copy, a light-first theme, and an experience timeline.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run build
```

## Edit content

Personal copy, links, career records, tools, and case studies live in `src/content/portfolio.ts`. Components read that file. Do not paste personal data into individual components.

| What to replace | Where |
| --- | --- |
| Portrait | Add `public/images/aryan-portrait.webp`. Adjust `profile.portrait.objectPosition` if the crop is off. Until that file exists, the site shows an AJ placeholder. |
| Email | Set `profile.email`. The copy button and the mailto action both use that field. Until it is set, both stay in a disabled preview. |
| LinkedIn, Instagram, Behance | Set `href` on those items in `socials`. Leave `null` to show “Link coming soon”. The Email tile uses `profile.email`. |
| Resume | Add a real PDF at `public/resume/aryan-jagtap-resume.pdf`. View and Download stay disabled until the file is a PDF. |
| Employment dates and history | Edit the `experience` array. Only the Digit Insurance role is confirmed, and its start date is unknown. Add earlier roles only when they are real. A duration appears only when every record has a start date. |
| Case studies | Replace the Cashless and Job Portal entries in `projects`, including images under `public/images/work`. Set `demo` to `false` after the sample notice should disappear. |
| Photos | Add files and list them in `photos`. The About carousel stays hidden while that list is empty. |

Do not invent employers, years, social handles, metrics, or testimonials to fill a blank.
