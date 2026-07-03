import { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {eyebrow ? <p className="text-eyebrow text-ink-accent">{eyebrow}</p> : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <h1 className="text-page-title text-ink">{title}</h1>
          <p className="max-w-measure text-body-lg text-ink/70">{description}</p>
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
    </div>
  );
}
