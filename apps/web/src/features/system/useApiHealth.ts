import { useEffect, useState } from "react";

import { api } from "../../lib/api";

export function useApiHealth() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        const r = await api.health();
        if (mounted) setOk(Boolean(r.ok));
      } catch {
        if (mounted) setOk(false);
      }
    }

    run();
    const id = window.setInterval(run, 30000);
    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, []);

  return { ok };
}

