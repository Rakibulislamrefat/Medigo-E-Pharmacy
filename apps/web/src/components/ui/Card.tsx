import type { ReactNode } from "react";

export function Card(props: {
  children: ReactNode;
  title?: string;
  right?: ReactNode;
}) {
  return (
    <section className="card">
      {props.title ? (
        <header className="cardHeader">
          <h2 className="cardTitle">{props.title}</h2>
          {props.right ? <div>{props.right}</div> : null}
        </header>
      ) : null}
      <div className="cardBody">{props.children}</div>
    </section>
  );
}
