import { useMemo, useState } from "react";

import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { isValidBangladeshiPhone } from "../../lib/validation";
import { useAuthStore } from "../auth/authStore";
import { createPrescription } from "./prescriptionsApi";

export function PrescriptionUploadScreen() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const phoneValid = isValidBangladeshiPhone(phone);

  const canSubmit = useMemo(() => {
    return Boolean(name.trim() && phoneValid && file && fileDataUrl);
  }, [name, phoneValid, file, fileDataUrl]);

  return (
    <Card title="Upload Prescription">
      {error ? <div className="errorBanner">{error}</div> : null}
      {success ? <div className="successBanner">{success}</div> : null}

      <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        <Field label="Full name">
          <Input value={name} onChange={setName} placeholder="Your name" />
        </Field>
        <Field
          label="Phone"
          hint="Format: 01XXXXXXXXX"
          error={phone.trim() && !phoneValid ? "Invalid phone number. Use 01[3-9]XXXXXXXX." : undefined}
        >
          <Input value={phone} onChange={setPhone} placeholder="01XXXXXXXXX" />
        </Field>
        <div style={{ gridColumn: "1 / -1" }}>
          <Field label="Prescription file">
            <input
              className="fileInput"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setError(null);
                setSuccess(null);
                setFile(f);
                setFileDataUrl(null);
                if (!f) return;
                if (f.size > 1024 * 1024) {
                  setError("File too large. Max 1MB.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  const result = typeof reader.result === "string" ? reader.result : null;
                  if (!result || !result.startsWith("data:")) {
                    setError("Failed to read file.");
                    return;
                  }
                  setFileDataUrl(result);
                };
                reader.onerror = () => setError("Failed to read file.");
                reader.readAsDataURL(f);
              }}
            />
          </Field>
          <div className="muted" style={{ marginTop: 8 }}>
            {file ? `Selected: ${file.name}` : "Upload a photo or PDF of your prescription (max 1MB)."}
          </div>
        </div>
      </div>

      <div className="divider" />

      <Button
        variant="primary"
        disabled={!canSubmit || submitting}
        onClick={async () => {
          if (!file || !fileDataUrl) return;
          setSubmitting(true);
          setError(null);
          setSuccess(null);
          try {
            const created = await createPrescription({
              userEmail: user?.email,
              fullName: name.trim(),
              phone: phone.trim(),
              fileName: file.name,
              fileMime: file.type || "application/octet-stream",
              fileSize: file.size,
              fileDataUrl,
            });
            setSuccess(`Prescription submitted. Reference: ${created.id}`);
            setName("");
            setPhone("");
            setFile(null);
            setFileDataUrl(null);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to submit");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {submitting ? "Submitting…" : "Submit"}
      </Button>
    </Card>
  );
}
