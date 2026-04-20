import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useAuthStore } from "../auth/authStore";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { formatBdt } from "../../lib/money";
import type { Order } from "../../types/domain";
import { getOrder, updateOrder } from "./ordersApi";

export function OrderDetailsScreen() {
  const params = useParams();
  const user = useAuthStore((s) => s.user);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function run() {
      const id = params.id ?? "";
      if (!id) return;
      setLoading(true);
      try {
        const data = await getOrder(id);
        if (mounted) setOrder(data);
      } catch {
        if (mounted) setOrder(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <Card title="Order">
        <div className="emptyState">Loading…</div>
      </Card>
    );
  }

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
          <Button
            variant="secondary"
            onClick={async () => {
              const next = await updateOrder(order.id, { paymentStatus: "paid" });
              setOrder(next);
            }}
          >
            Mark paid
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              const next = await updateOrder(order.id, { status: "packed" });
              setOrder(next);
            }}
          >
            Mark packed
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              const next = await updateOrder(order.id, { status: "shipped" });
              setOrder(next);
            }}
          >
            Mark shipped
          </Button>
          <Button
            variant="secondary"
            onClick={async () => {
              const next = await updateOrder(order.id, { status: "delivered" });
              setOrder(next);
            }}
          >
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
