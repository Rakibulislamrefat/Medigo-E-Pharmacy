import type { ReactNode } from "react";

export function Container(props: { children: ReactNode }) {
  return <div className="container">{props.children}</div>;
}
