import { Link, useParams } from "react-router-dom";

import { useOrdersStore } from "../orders/ordersStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export function DeliveryDetailsScreen() {
  const params = useParams();
  const order = useOrdersStore((s) => s.orders).find((o) => o.id === params.id);
  const setStatus = useOrdersStore((s) => s.setStatus);

  if (!order) {
    return (
      <Card title="Delivery">
        <div className="emptyState">
          Not found. <Link to="/delivery">Back</Link>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`Delivery • Order ${order.id}`}
      >
      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
        <div className="strong">Address</div>
        <div>{order.address.fullName}</div>
        <div>{order.address.phone}</div>
        <div>{order.address.line1}</div>
        <div>
          {order.address.city} • {order.address.postalCode}
        </div>
      </div>

      <div className="divider" />

      <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={() => setStatus(order.id, "shipped")}>
          Picked up
        </Button>
        <Button variant="secondary" onClick={() => setStatus(order.id, "shipped")}>
          On the way
        </Button>
        <Button onClick={() => setStatus(order.id, "delivered")}>Delivered</Button>
      </div>
    </Card>
  );
}

