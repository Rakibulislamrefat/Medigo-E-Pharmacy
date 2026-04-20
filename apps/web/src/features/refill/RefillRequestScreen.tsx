import { useState } from "react";

import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { isValidBangladeshiPhone } from "../../lib/validation";
import { createRefillRequest } from "./refillApi";
import { useAuthStore } from "../auth/authStore";

export function RefillRequestScreen() {
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const phoneValid = isValidBangladeshiPhone(phone);

  return (
    <Card title="Refill Request">
      {error ? <div className="errorBanner">{error}</div> : null}
      {success ? <div className="successBanner">{success}</div> : null}

      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
        <Field label="What do you need to reorder?">
          <Input value={text} onChange={setText} placeholder="Example: Napa 500mg x 10, Seclo 20mg x 5" />
        </Field>
        <Field
          label="Phone"
          hint="Format: 01XXXXXXXXX"
          error={phone.trim() && !phoneValid ? "Invalid phone number. Use 01[3-9]XXXXXXXX." : undefined}
        >
          <Input value={phone} onChange={setPhone} placeholder="01XXXXXXXXX" />
        </Field>
      </div>

      <div className="divider" />

      <Button
        variant="primary"
        disabled={!text.trim() || !phoneValid || submitting}
        onClick={async () => {
          setSubmitting(true);
          setError(null);
          setSuccess(null);
          try {
            const created = await createRefillRequest({ userEmail: user?.email, phone: phone.trim(), text: text.trim() });
            setSuccess(`Request submitted. Reference: ${created.id}`);
            setText("");
            setPhone("");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to submit");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {submitting ? "Submitting…" : "Submit request"}
      </Button>
    </Card>
  );
}
