import type { ReactNode } from "react";

export function Stack(props: { children: ReactNode; gap: number }) {
  return (
    <div className="stack" style={{ gap: `${props.gap}px` }}>
      {props.children}
    </div>
  );
}
