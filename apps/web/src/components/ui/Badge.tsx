import type { ReactNode } from "react";

const tones = {
  neutral: "badge badgeNeutral",
  success: "badge badgeSuccess",
  warning: "badge badgeWarning",
  danger: "badge badgeDanger",
} as const;

export function Badge(props: {
  children: ReactNode;
  tone?: keyof typeof tones;
}) {
  const tone = props.tone ?? "neutral";
  return <span className={tones[tone]}>{props.children}</span>;
}
