import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatePanelProps = {
  id: string;
  innerClassName?: string;
  children?: ReactNode;
};

export const StatePanel: FC<StatePanelProps> = ({ id, innerClassName = "", children }) => (
  <section id={id}>
    <div className="space-y-8">
      <div className="space-y-3">
        <div className={cn("reviews-wrapper space-y-4", innerClassName)}>{children}</div>
      </div>
    </div>
  </section>
);
