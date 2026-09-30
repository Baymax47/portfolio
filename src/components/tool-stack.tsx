import CursorLogo from "@thesvg/react/cursor";
import Figma from "@thesvg/react/figma";
import Framer from "@thesvg/react/framer";
import Openai from "@thesvg/react/openai";
import Supabase from "@thesvg/react/supabase";
import { tools, type ToolId } from "@/content/portfolio";

function ToolGlyph({ id }: { id: ToolId }) {
  const props = { width: 28, height: 28, "aria-hidden": true as const };
  if (id === "figma") return <Figma {...props} />;
  if (id === "framer") return <Framer {...props} />;
  if (id === "cursor") return <CursorLogo {...props} />;
  if (id === "supabase") return <Supabase {...props} />;
  return <Openai {...props} />;
}

export function ToolStack({
  className = "",
  variant = "list",
}: {
  className?: string;
  variant?: "list" | "strip";
}) {
  if (variant === "strip") {
    const loop = [...tools, ...tools];
    return (
      <section className={`bento-card stack-card ${className}`} aria-labelledby="tools-title">
        <h2 id="tools-title">Stack I use</h2>
        <div className="tool-ticker" aria-label="Tools">
          <ul className="tool-track">
            {loop.map((tool, index) => {
              const clone = index >= tools.length;
              return (
                <li
                    key={`${tool.id}-${clone ? "clone" : "live"}`}
                    className={clone ? "tool-clone" : undefined}
                    aria-hidden={clone || undefined}
                  >
                    <span className="tool-tile" aria-label={clone ? undefined : tool.name} title={clone ? undefined : tool.name}>
                      <ToolGlyph id={tool.id} />
                    </span>
                  </li>
              );
            })}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section className={`bento-card flex h-full flex-col p-6 min-[1200px]:p-7 ${className}`} aria-labelledby="tools-title">
      <h2 id="tools-title" className="text-[24px] leading-[1.4] font-medium">
        Tools
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-4">
        {tools.map((tool) => (
          <li key={tool.id}>
            <span className="tool-item">
              <ToolGlyph id={tool.id} />
              <span>{tool.name}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
