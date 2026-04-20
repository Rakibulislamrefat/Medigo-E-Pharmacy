import { useMemo, useState } from "react";

import { useAuthStore } from "../auth/authStore";
import { useOrdersStore } from "../orders/ordersStore";
import { useFeedbackStore } from "./feedbackStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

export function FeedbackScreen() {
  const user = useAuthStore((s) => s.user);
  const orders = useOrdersStore((s) => s.orders).filter((o) => o.userEmail === user?.email && o.status === "delivered");
  const add = useFeedbackStore((s) => s.add);
  const items = useFeedbackStore((s) => s.items).filter((f) => f.userEmail === user?.email);

  const [orderId, setOrderId] = useState<string>(orders[0]?.id ?? "");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const canSubmit = useMemo(() => Boolean(user && orderId && comment.trim()), [user, orderId, comment]);

  return (
    <div className="twoCol">
      <Card title="Submit feedback">
        {orders.length === 0 ? (
          <div className="emptyState">You can leave feedback after an order is delivered.</div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
            <Field label="Delivered order">
              <Select value={orderId} onChange={setOrderId} options={orders.map((o) => ({ value: o.id, label: o.id }))} />
            </Field>
            <Field label="Rating (1–5)">
              <Input value={rating} onChange={setRating} type="number" />
            </Field>
            <Field label="Comment">
              <textarea
                className="textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience"
                rows={5}
              />
            </Field>
            <Button
              disabled={!canSubmit}
              onClick={() => {
                if (!user) return;
                add({
                  userEmail: user.email,
                  orderId,
                  rating: Math.max(1, Math.min(5, Number(rating) || 5)),
                  comment: comment.trim(),
                });
                setComment("");
              }}
            >
              Submit
            </Button>
          </div>
        )}
      </Card>

      <Card title="My feedback">
        {items.length === 0 ? (
          <div className="emptyState">No feedback submitted yet.</div>
        ) : (
          <div className="stack" style={{ gap: "12px" }}>
            {items.map((f) => (
              <div key={f.id} className="feedbackCard">
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <div className="strong">Order {f.orderId}</div>
                  <div className="muted">{new Date(f.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="muted">Rating: {f.rating}/5</div>
                <div>{f.comment}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

