import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import type { Order } from "../../types/domain";
import { getOrder } from "./ordersApi";

export function TrackOrderScreen() {
  const [orderId, setOrderId] = useState("");
  const safe = useMemo(() => orderId.trim(), [orderId]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Track Order</h1>
          <p className="pageSubtitle">Enter your order id to view details.</p>
        </div>
      </div>

      <Card title="Order tracking">
        <div className="grid" style={{ gridTemplateColumns: "1fr auto", gap: 12, alignItems: "end" }}>
          <Field label="Order ID">
            <Input value={orderId} onChange={setOrderId} placeholder="e.g. 12345" />
          </Field>
          <Button
            variant="primary"
            disabled={!safe || loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              setResult(null);
              try {
                const o = await getOrder(safe);
                setResult(o);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Not found");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Searching…" : "Search"}
          </Button>
        </div>

        <div className="divider" />

        {error ? <div className="errorBanner">{error}</div> : null}

        {result ? (
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 8 }}>
            <div className="infoRow">
              <span className="muted">Order</span>
              <span className="strong">{result.id}</span>
            </div>
            <div className="infoRow">
              <span className="muted">Status</span>
              <span className="strong">{result.status}</span>
            </div>
            <div className="infoRow">
              <span className="muted">Payment</span>
              <span className="strong">{result.paymentStatus}</span>
            </div>
            <div className="infoRow">
              <span className="muted">Placed</span>
              <span>{new Date(result.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ) : (
          <div className="muted" style={{ fontSize: 14 }}>
            If you are signed in, you can also view all orders in <Link to="/orders">Orders</Link>.
          </div>
        )}

      </Card>
    </>
  );
}
