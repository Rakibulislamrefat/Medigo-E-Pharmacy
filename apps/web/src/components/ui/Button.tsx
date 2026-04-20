import type { ReactNode } from "react";

export function Button(props: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  leftIcon?: ReactNode;
}) {
  const variant = props.variant ?? "primary";
  const className = ["btn", `btn${variant[0]?.toUpperCase()}${variant.slice(1)}`].join(" ");
  return (
    <button type={props.type ?? "button"} className={className} disabled={props.disabled} onClick={props.onClick}>
      {props.leftIcon ? <span className="btnIcon">{props.leftIcon}</span> : null}
      <span>{props.children}</span>
    </button>
  );
}
