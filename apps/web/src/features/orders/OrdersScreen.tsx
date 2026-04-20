import { Link } from "react-router-dom";

import { useAuthStore } from "../auth/authStore";
import { useOrdersStore } from "./ordersStore";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

function money(v: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(v);
}

export function OrdersScreen() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrdersStore((s) => s.orders).filter((o) => o.userEmail === user?.email);

  return (
    <Card title="Orders">
      {orders.length === 0 ? (
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
              <div className="right">{money(o.totalAmount)}</div>
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

