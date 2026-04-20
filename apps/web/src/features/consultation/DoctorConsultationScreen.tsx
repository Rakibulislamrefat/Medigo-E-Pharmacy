import { useMemo, useState } from "react";

import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../auth/authStore";
import { isValidBangladeshiPhone } from "../../lib/validation";
import { createConsultation } from "./consultationApi";

export function DoctorConsultationScreen() {
  const user = useAuthStore((s) => s.user);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const phoneValid = isValidBangladeshiPhone(phone);
  const canSubmit = useMemo(() => {
    return Boolean(fullName.trim() && phoneValid && notes.trim());
  }, [fullName, phoneValid, notes]);

  return (
    <Card title="Doctor Consultation">
      {error ? <div className="errorBanner">{error}</div> : null}
      {success ? <div className="successBanner">{success}</div> : null}

      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
        <Field label="Full name">
          <Input value={fullName} onChange={setFullName} placeholder="Your name" />
        </Field>
        <Field
          label="Phone"
          hint="Format: 01XXXXXXXXX"
          error={phone.trim() && !phoneValid ? "Invalid phone number. Use 01[3-9]XXXXXXXX." : undefined}
        >
          <Input value={phone} onChange={setPhone} placeholder="01XXXXXXXXX" />
        </Field>
        <Field label="Problem / notes">
          <Input value={notes} onChange={setNotes} placeholder="Example: fever for 3 days, headache" />
        </Field>
        <Field label="Preferred time (optional)">
          <Input value={preferredTime} onChange={setPreferredTime} placeholder="Example: today 8pm" />
        </Field>
      </div>

      <div className="divider" />

      <Button
        variant="primary"
        disabled={!canSubmit || submitting}
        onClick={async () => {
          setSubmitting(true);
          setError(null);
          setSuccess(null);
          try {
            const created = await createConsultation({
              userEmail: user?.email,
              fullName: fullName.trim(),
              phone: phone.trim(),
              notes: notes.trim(),
              preferredTime: preferredTime.trim() || undefined,
            });
            setSuccess(`Request submitted. Reference: ${created.id}`);
            setFullName("");
            setPhone("");
            setNotes("");
            setPreferredTime("");
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to submit");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {submitting ? "Submitting…" : "Book appointment"}
      </Button>
    </Card>
  );
}
