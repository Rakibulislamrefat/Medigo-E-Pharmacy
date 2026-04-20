import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import type { Order } from "../../types/domain";
import type { Delivery, DeliveryStatus } from "./deliveriesApi";
import { getDelivery, updateDelivery } from "./deliveriesApi";
import { getOrder, updateOrder } from "../orders/ordersApi";

export function DeliveryDetailsScreen() {
  const params = useParams();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function run() {
      const id = params.id ?? "";
      if (!id) return;
      setLoading(true);
      try {
        const d = await getDelivery(id);
        const o = await getOrder(d.orderId);
        if (!mounted) return;
        setDelivery(d);
        setOrder(o);
      } catch {
        if (!mounted) return;
        setDelivery(null);
        setOrder(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  async function setStatus(next: DeliveryStatus) {
    if (!delivery) return;
    const updated = await updateDelivery(delivery.id, { status: next });
    setDelivery(updated);

    if (order) {
      if (next === "delivered") setOrder(await updateOrder(order.id, { status: "delivered" }));
      if (next === "picked_up" || next === "on_the_way") setOrder(await updateOrder(order.id, { status: "shipped" }));
    }
  }

  if (loading) {
    return (
      <Card title="Delivery">
        <div className="emptyState">Loading…</div>
      </Card>
    );
  }

  if (!delivery || !order) {
    return (
      <Card title="Delivery">
        <div className="emptyState">
          Not found. <Link to="/delivery">Back</Link>
        </div>
      </Card>
    );
  }

  return (
    <Card title={`Delivery • Order ${order.id}`}>
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
        <Button variant="secondary" onClick={() => setStatus("picked_up")}>
          Picked up
        </Button>
        <Button variant="secondary" onClick={() => setStatus("on_the_way")}>
          On the way
        </Button>
        <Button onClick={() => setStatus("delivered")}>Delivered</Button>
      </div>
    </Card>
  );
}
