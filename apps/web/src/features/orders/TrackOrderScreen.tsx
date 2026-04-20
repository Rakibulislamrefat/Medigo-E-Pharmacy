import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export function TrackOrderScreen() {
  const [orderId, setOrderId] = useState("");
  const safe = useMemo(() => orderId.trim(), [orderId]);

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
          <Button variant="primary" disabled={!safe} onClick={() => {}}>
            Search
          </Button>
        </div>

        <div className="divider" />

        <div className="muted" style={{ fontSize: 14 }}>
          If you are signed in, you can also view all orders in <Link to="/orders">Orders</Link>.
        </div>
      </Card>
    </>
  );
}

