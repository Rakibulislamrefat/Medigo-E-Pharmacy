import { useEffect, useMemo, useState } from "react";

import { useAuthStore } from "../auth/authStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import type { Feedback, Order } from "../../types/domain";
import { listOrders } from "../orders/ordersApi";
import { createFeedback, listFeedback } from "./feedbackApi";

export function FeedbackScreen() {
  const user = useAuthStore((s) => s.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [orderId, setOrderId] = useState<string>(orders[0]?.id ?? "");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");

  const canSubmit = useMemo(() => Boolean(user && orderId && comment.trim()), [user, orderId, comment]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!user?.email) return;
      setLoading(true);
      try {
        const allOrders = await listOrders(user.email);
        const delivered = allOrders.filter((o) => o.status === "delivered");
        const feedback = await listFeedback(user.email);
        if (!mounted) return;
        setOrders(delivered);
        setItems(feedback);
        setOrderId((prev) => prev || delivered[0]?.id || "");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [user?.email]);

  return (
    <div className="twoCol">
      <Card title="Submit feedback">
        {loading ? (
          <div className="emptyState">Loading…</div>
        ) : orders.length === 0 ? (
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
              disabled={!canSubmit || submitting}
              onClick={async () => {
                if (!user) return;
                setSubmitting(true);
                try {
                  const created = await createFeedback({
                    userEmail: user.email,
                    orderId,
                    rating: Math.max(1, Math.min(5, Number(rating) || 5)),
                    comment: comment.trim(),
                  });
                  setItems((prev) => [created, ...prev]);
                  setComment("");
                } finally {
                  setSubmitting(false);
                }
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
