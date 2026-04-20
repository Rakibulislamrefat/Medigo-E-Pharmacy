import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useAuthStore } from "../auth/authStore";
import type { Delivery } from "./deliveriesApi";
import { listDeliveries } from "./deliveriesApi";

export function DeliveryListScreen() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      try {
        const data = await listDeliveries(user?.email);
        if (mounted) setItems(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [user?.email]);

  return (
    <Card title="Delivery • Assigned deliveries">
      {loading ? (
        <div className="emptyState">Loading…</div>
      ) : items.length === 0 ? (
        <div className="emptyState">No deliveries assigned yet.</div>
      ) : (
        <div className="cardsGrid">
          {items.map((d) => (
            <div key={d.id} className="deliveryCard">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div className="strong">Order {d.orderId}</div>
                <Badge tone={d.status === "delivered" ? "success" : "warning"}>{d.status}</Badge>
              </div>
              <div className="muted">{d.assignedToEmail ?? "Unassigned"}</div>
              <div className="divider" />
              <Link to={`/delivery/${d.id}`}>Open</Link>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
