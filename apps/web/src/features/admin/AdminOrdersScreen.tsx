import { useEffect, useState } from "react";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { formatBdt } from "../../lib/money";
import type { Order } from "../../types/domain";
import { listOrders, updateOrder } from "../orders/ordersApi";

export function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      try {
        const data = await listOrders();
        if (mounted) setOrders(data);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card title="Admin • Orders">
      {loading ? (
        <div className="emptyState">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="emptyState">No orders yet.</div>
      ) : (
        <div className="table">
          <div className="tableHeader" style={{ gridTemplateColumns: "1.2fr 1.2fr 0.7fr 0.8fr 0.8fr 0.9fr" }}>
            <div>Date</div>
            <div>User</div>
            <div className="right">Total</div>
            <div>Status</div>
            <div>Payment</div>
            <div className="right">Actions</div>
          </div>
          {orders.map((o) => (
            <div key={o.id} className="tableRow" style={{ gridTemplateColumns: "1.2fr 1.2fr 0.7fr 0.8fr 0.8fr 0.9fr" }}>
              <div>{new Date(o.createdAt).toLocaleString()}</div>
              <div className="muted">{o.userEmail}</div>
              <div className="right">{formatBdt(o.totalAmount)}</div>
              <div>
                <Badge tone={o.status === "delivered" ? "success" : "warning"}>{o.status}</Badge>
              </div>
              <div>
                <Badge tone={o.paymentStatus === "paid" ? "success" : "warning"}>{o.paymentStatus}</Badge>
              </div>
              <div className="right row" style={{ justifyContent: "flex-end", gap: 8 }}>
                <a
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    const next = await updateOrder(o.id, { paymentStatus: o.paymentStatus === "paid" ? "unpaid" : "paid" });
                    setOrders((prev) => prev.map((x) => (x.id === next.id ? next : x)));
                  }}
                >
                  Toggle paid
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
