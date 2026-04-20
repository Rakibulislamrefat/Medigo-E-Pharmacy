import { useOrdersStore } from "../orders/ordersStore";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { formatBdt } from "../../lib/money";

export function AdminOrdersScreen() {
  const orders = useOrdersStore((s) => s.orders);

  return (
    <Card title="Admin • Orders">
      {orders.length === 0 ? (
        <div className="emptyState">No orders yet.</div>
      ) : (
        <div className="table">
          <div className="tableHeader">
            <div>Date</div>
            <div>User</div>
            <div className="right">Total</div>
            <div>Status</div>
            <div>Payment</div>
          </div>
          {orders.map((o) => (
            <div key={o.id} className="tableRow">
              <div>{new Date(o.createdAt).toLocaleString()}</div>
              <div className="muted">{o.userEmail}</div>
              <div className="right">{formatBdt(o.totalAmount)}</div>
              <div>
                <Badge tone={o.status === "delivered" ? "success" : "warning"}>{o.status}</Badge>
              </div>
              <div>
                <Badge tone={o.paymentStatus === "paid" ? "success" : "warning"}>{o.paymentStatus}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
