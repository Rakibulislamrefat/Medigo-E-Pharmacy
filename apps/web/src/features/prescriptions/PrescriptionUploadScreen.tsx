import { useState } from "react";

import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { isValidBangladeshiPhone } from "../../lib/validation";

export function PrescriptionUploadScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const phoneValid = isValidBangladeshiPhone(phone);

  return (
    <Card title="Upload Prescription">
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
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
            />
          </Field>
          <div className="muted" style={{ marginTop: 8 }}>
            {fileName ? `Selected: ${fileName}` : "Upload a photo or PDF of your prescription."}
          </div>
        </div>
      </div>

      <div className="divider" />

      <Button
        variant="primary"
        disabled={!name.trim() || !phoneValid || !fileName}
        onClick={() => {}}
      >
        Submit
      </Button>
    </Card>
  );
}
