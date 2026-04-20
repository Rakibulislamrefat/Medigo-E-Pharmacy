import { Link, useParams } from "react-router-dom";

import { useAuthStore } from "../auth/authStore";
import { useOrdersStore } from "./ordersStore";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { formatBdt } from "../../lib/money";

export function OrderDetailsScreen() {
  const params = useParams();
  const user = useAuthStore((s) => s.user);
  const order = useOrdersStore((s) => s.orders).find((o) => o.id === params.id);
  const setStatus = useOrdersStore((s) => s.setStatus);
  const setPaymentStatus = useOrdersStore((s) => s.setPaymentStatus);

  if (!order || order.userEmail !== user?.email) {
    return (
      <Card title="Order">
        <div className="emptyState">
          Not found. <Link to="/orders">Back to orders</Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="twoColDetail">
      <Card
        title={`Order ${order.id}`}
        right={
          <Badge tone={order.paymentStatus === "paid" ? "success" : "warning"}>{order.paymentStatus}</Badge>
        }
      >
        <div className="statusRow">
          <Badge tone={order.status === "delivered" ? "success" : "warning"}>{order.status}</Badge>
          <span className="muted">Placed {new Date(order.createdAt).toLocaleString()}</span>
        </div>

        <div className="divider" />

        <div className="table">
          <div className="tableHeader">
            <div>Item</div>
            <div className="right">Unit</div>
            <div className="right">Qty</div>
            <div className="right">Total</div>
          </div>
          {order.items.map((i) => (
            <div key={i.medicineId} className="tableRow">
              <div className="strong">{i.name}</div>
              <div className="right">{formatBdt(i.unitPrice)}</div>
              <div className="right">{i.qty}</div>
              <div className="right">{formatBdt(i.unitPrice * i.qty)}</div>
            </div>
          ))}
        </div>

        <div className="divider" />

        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={() => setPaymentStatus(order.id, "paid")}>
            Mark paid
          </Button>
          <Button variant="secondary" onClick={() => setStatus(order.id, "packed")}>
            Mark packed
          </Button>
          <Button variant="secondary" onClick={() => setStatus(order.id, "shipped")}>
            Mark shipped
          </Button>
          <Button variant="secondary" onClick={() => setStatus(order.id, "delivered")}>
            Mark delivered
          </Button>
        </div>

        {order.status === "delivered" ? (
          <div className="note">
            Delivered. <Link to="/feedback">Leave feedback</Link>
          </div>
        ) : null}
      </Card>

      <Card title="Delivery address">
        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 8 }}>
          <div className="infoRow">
            <span className="muted">Name</span>
            <span>{order.address.fullName}</span>
          </div>
          <div className="infoRow">
            <span className="muted">Phone</span>
            <span>{order.address.phone}</span>
          </div>
          <div className="infoRow">
            <span className="muted">Address</span>
            <span>{order.address.line1}</span>
          </div>
          <div className="infoRow">
            <span className="muted">City</span>
            <span>{order.address.city}</span>
          </div>
          <div className="infoRow">
            <span className="muted">Postal code</span>
            <span>{order.address.postalCode}</span>
          </div>
          <div className="divider" />
          <div className="summaryRow summaryTotal">
            <span>Total</span>
            <span>{formatBdt(order.totalAmount)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
