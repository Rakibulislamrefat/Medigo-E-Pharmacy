import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function DoctorConsultationScreen() {
  return (
    <Card title="Doctor Consultation">
      <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
        <div className="strong">Online consultation (demo)</div>
        <div className="muted">
          This page is a placeholder for integrating video/audio consultation with a provider.
        </div>
      </div>

      <div className="divider" />

      <Button variant="primary" onClick={() => {}}>
        Book appointment
      </Button>
    </Card>
  );
}

