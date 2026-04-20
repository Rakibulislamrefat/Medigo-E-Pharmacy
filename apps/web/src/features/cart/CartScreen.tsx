import { Link, useNavigate } from "react-router-dom";

import { useCartStore } from "./cartStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { formatBdt } from "../../lib/money";

export function CartScreen() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQty = useCartStore((s) => s.setQty);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <div className="twoCol">
      <Card title="Your cart">
        {items.length === 0 ? (
          <div className="emptyState">
            Your cart is empty. <Link to="/medicines">Browse medicines</Link>
          </div>
        ) : (
          <div className="table">
            <div className="tableHeader">
              <div>Item</div>
              <div className="right">Price</div>
              <div className="right">Qty</div>
              <div className="right">Total</div>
              <div></div>
            </div>
            {items.map((i) => (
              <div key={i.medicineId} className="tableRow">
                <div>
                  <div className="strong">{i.name}</div>
                  <div className="muted">#{i.medicineId}</div>
                </div>
                <div className="right">{formatBdt(i.unitPrice)}</div>
                <div className="right">
                  <Field label="" >
                    <Input value={String(i.qty)} onChange={(v) => setQty(i.medicineId, Number(v))} type="number" />
                  </Field>
                </div>
                <div className="right">{formatBdt(i.unitPrice * i.qty)}</div>
                <div className="right">
                  <Button variant="ghost" onClick={() => remove(i.medicineId)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Summary">
        <div className="summary">
          <div className="summaryRow">
            <span className="muted">Subtotal</span>
            <span>{formatBdt(subtotal)}</span>
          </div>
          <div className="summaryRow">
            <span className="muted">Delivery</span>
            <span>{formatBdt(items.length ? 60 : 0)}</span>
          </div>
          <div className="summaryRow summaryTotal">
            <span>Total</span>
            <span>{formatBdt(subtotal + (items.length ? 60 : 0))}</span>
          </div>
          <Button disabled={items.length === 0} onClick={() => navigate("/checkout")}> 
            Proceed to checkout
          </Button>
        </div>
      </Card>
    </div>
  );
}
