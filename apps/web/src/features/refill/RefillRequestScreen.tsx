import { useState } from "react";

import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { isValidBangladeshiPhone } from "../../lib/validation";

export function RefillRequestScreen() {
  const [text, setText] = useState("");
  const [phone, setPhone] = useState("");
  const phoneValid = isValidBangladeshiPhone(phone);

  return (
    <Card title="Refill Request">
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

      <Button variant="primary" disabled={!text.trim() || !phoneValid} onClick={() => {}}>
        Submit request
      </Button>
    </Card>
  );
}
