import type { ReactNode } from "react";

export function Field(props: {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="field">
      <span className="fieldLabel">{props.label}</span>
      {props.children}
      {props.error ? <span className="fieldError">{props.error}</span> : props.hint ? <span className="fieldHint">{props.hint}</span> : null}
    </label>
  );
}
