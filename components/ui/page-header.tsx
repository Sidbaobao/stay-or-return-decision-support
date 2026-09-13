import { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {eyebrow ? <p className="text-eyebrow text-ink-accent">{eyebrow}</p> : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0 space-y-3">
          {/* Focusable so an action that removes its own control (reset) can
              park focus here instead of letting it fall to <body>. */}
          <h1 tabIndex={-1} className="text-page-title text-ink outline-none">
            {title}
          </h1>
          {description ? <p className="text-body-lg text-ink/70">{description}</p> : null}
        </div>
        {/* An action that renders nothing must not leave a gap behind. */}
        {actions ? <div className="shrink-0 empty:hidden">{actions}</div> : null}
      </div>
    </div>
  );
}
