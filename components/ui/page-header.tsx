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
      {eyebrow ? <p className="text-sm font-medium uppercase tracking-[0.2em] text-legacy-teal">{eyebrow}</p> : null}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-2">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">{title}</h1>
          <p className="text-base leading-7 text-ink/75">{description}</p>
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
    </div>
  );
}
