import type { ReactNode } from "react";

export function Drawer(props: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (!props.open) return null;

  return (
    <div className="drawerRoot" role="dialog" aria-modal="true" aria-label={props.title}>
      <button type="button" className="drawerOverlay" aria-label="Close" onClick={props.onClose} />
      <div className="drawerPanel">
        <div className="drawerHeader">
          <div className="drawerTitle">{props.title}</div>
          <button type="button" className="drawerClose" onClick={props.onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="drawerBody">{props.children}</div>
      </div>
    </div>
  );
}

