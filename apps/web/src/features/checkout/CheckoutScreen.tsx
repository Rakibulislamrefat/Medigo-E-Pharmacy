import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../auth/authStore";
import { useCartStore } from "../cart/cartStore";
import { useOrdersStore } from "../orders/ordersStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { formatBdt } from "../../lib/money";

export function CheckoutScreen() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const cart = useCartStore();
  const createOrder = useOrdersStore((s) => s.create);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.subtotal();
  const deliveryFee = cart.items.length ? 1.5 : 0;
  const total = subtotal + deliveryFee;

  const isValid = useMemo(() => {
    if (!cart.items.length) return false;
    return Boolean(fullName.trim() && phone.trim() && line1.trim() && city.trim() && postalCode.trim());
  }, [cart.items.length, fullName, phone, line1, city, postalCode]);

  async function onSubmit() {
    if (!user || !isValid) return;
    setSubmitting(true);
    const order = createOrder({
      userEmail: user.email,
      items: cart.items.map((i) => ({ ...i })),
      address: { fullName, phone, line1, city, postalCode },
      totalAmount: total,
    });
    cart.clear();
    setSubmitting(false);
    navigate(`/orders/${order.id}`);
  }

  return (
    <div className="twoCol">
      <Card title="Checkout">
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Full name">
            <Input value={fullName} onChange={setFullName} placeholder="Your name" />
          </Field>
          <Field label="Phone">
            <Input value={phone} onChange={setPhone} placeholder="Phone number" type="tel" />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Address">
              <Input value={line1} onChange={setLine1} placeholder="Street, apartment, etc." />
            </Field>
          </div>
          <Field label="City">
            <Input value={city} onChange={setCity} placeholder="City" />
          </Field>
          <Field label="Postal code">
            <Input value={postalCode} onChange={setPostalCode} placeholder="Postal code" />
          </Field>
        </div>

        <div className="divider" />
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="strong">Payment</div>
            <div className="muted">This demo places the order locally. Hook payment later.</div>
          </div>
          <Button disabled={!isValid || submitting} onClick={onSubmit}>
            {submitting ? "Placing…" : "Place order"}
          </Button>
        </div>
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
            <span>{formatBdt(total)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
