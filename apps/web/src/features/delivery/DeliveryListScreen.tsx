import { Link } from "react-router-dom";

import { useOrdersStore } from "../orders/ordersStore";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

export function DeliveryListScreen() {
  const orders = useOrdersStore((s) => s.orders).filter((o) => o.paymentStatus === "paid");

  return (
    <Card title="Delivery • Assigned deliveries">
      {orders.length === 0 ? (
        <div className="emptyState">No paid orders available for delivery.</div>
      ) : (
        <div className="cardsGrid">
          {orders.map((o) => (
            <div key={o.id} className="deliveryCard">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <div className="strong">Order {o.id}</div>
                <Badge tone={o.status === "delivered" ? "success" : "warning"}>{o.status}</Badge>
              </div>
              <div className="muted">{o.address.line1}</div>
              <div className="muted">
                {o.address.city} • {o.address.postalCode}
              </div>
              <div className="divider" />
              <Link to={`/delivery/${o.id}`}>Open</Link>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

