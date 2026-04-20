import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuthStore } from "../auth/authStore";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { formatBdt } from "../../lib/money";
import type { Order } from "../../types/domain";
import { listOrders } from "./ordersApi";

export function OrdersScreen() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      try {
        const data = await listOrders(user?.email);
        if (mounted) setOrders(data);
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
    <Card title="Orders">
      {loading ? (
        <div className="emptyState">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="emptyState">No orders yet.</div>
      ) : (
        <div className="table">
          <div className="tableHeader">
            <div>Date</div>
            <div>Items</div>
            <div className="right">Total</div>
            <div>Status</div>
            <div></div>
          </div>
          {orders.map((o) => (
            <div key={o.id} className="tableRow">
              <div>{new Date(o.createdAt).toLocaleString()}</div>
              <div>{o.items.length}</div>
              <div className="right">{formatBdt(o.totalAmount)}</div>
              <div>
                <Badge tone={o.status === "delivered" ? "success" : o.status === "created" ? "neutral" : "warning"}>
                  {o.status}
                </Badge>
              </div>
              <div className="right">
                <Link to={`/orders/${o.id}`}>View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
