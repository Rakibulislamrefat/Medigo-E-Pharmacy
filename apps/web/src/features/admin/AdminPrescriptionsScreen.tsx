import { useEffect, useMemo, useState } from "react";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Drawer } from "../../components/ui/Drawer";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import type { PrescriptionRequest } from "../../types/domain";
import { listPrescriptions, updatePrescription } from "../prescriptions/prescriptionsApi";

type Status = PrescriptionRequest["status"];

type StatusFilter = "all" | Status;

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "reviewed", label: "Reviewed" },
  { value: "fulfilled", label: "Fulfilled" },
  { value: "rejected", label: "Rejected" },
];

export function AdminPrescriptionsScreen() {
  const [items, setItems] = useState<PrescriptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [active, setActive] = useState<PrescriptionRequest | null>(null);

  async function refresh() {
    const data = await listPrescriptions();
    setItems(data);
  }

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await listPrescriptions();
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load prescriptions");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const phone = phoneQuery.trim();
    return items.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (phone && !p.phone.includes(phone)) return false;
      return true;
    });
  }, [items, phoneQuery, statusFilter]);

  const statusOptionsWithAll: { value: StatusFilter; label: string }[] = useMemo(() => {
    return [{ value: "all", label: "All" }, ...STATUS_OPTIONS];
  }, []);

  return (
    <Card title="Admin • Prescription Uploads">
      {error ? <div className="errorBanner">{error}</div> : null}

      <div className="adminFilters">
        <Field label="Search by phone">
          <Input value={phoneQuery} onChange={setPhoneQuery} placeholder="01XXXXXXXXX" />
        </Field>
        <Field label="Status">
          <Select value={statusFilter} onChange={setStatusFilter} options={statusOptionsWithAll} />
        </Field>
      </div>

      <div className="divider" />

      <div className="row" style={{ justifyContent: "flex-end" }}>
        <Button
          variant="secondary"
          onClick={async () => {
            setLoading(true);
            try {
              await refresh();
            } finally {
              setLoading(false);
            }
          }}
        >
          Refresh
        </Button>
      </div>

      <div className="divider" />

      {loading ? (
        <div className="emptyState">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="emptyState">No prescription uploads yet.</div>
      ) : (
        <div className="table">
          <div className="tableHeader" style={{ gridTemplateColumns: "1fr 1fr 1fr 0.8fr 0.8fr" }}>
            <div>Date</div>
            <div>Name</div>
            <div>Phone</div>
            <div>Status</div>
            <div className="right">Actions</div>
          </div>
          {filtered.map((p) => (
            <div key={p.id} className="tableRow" style={{ gridTemplateColumns: "1fr 1fr 1fr 0.8fr 0.8fr" }}>
              <div>{new Date(p.createdAt).toLocaleString()}</div>
              <div className="strong">{p.fullName}</div>
              <div className="muted">{p.phone}</div>
              <div>
                <Badge tone={p.status === "fulfilled" ? "success" : p.status === "rejected" ? "danger" : "warning"}>
                  {p.status}
                </Badge>
              </div>
              <div className="right">
                <Button variant="ghost" onClick={() => setActive(p)}>
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        open={Boolean(active)}
        title={active ? `Prescription • ${active.id}` : "Prescription"}
        onClose={() => setActive(null)}
      >
        {active ? (
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 6 }}>
              <div className="muted">Created</div>
              <div className="strong">{new Date(active.createdAt).toLocaleString()}</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 6 }}>
              <div className="muted">Patient</div>
              <div className="strong">{active.fullName}</div>
              <div className="muted">{active.phone}</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 6 }}>
              <div className="muted">File</div>
              <div className="strong">{active.fileName}</div>
              <div className="muted">
                {active.fileMime} • {Math.round(active.fileSize / 1024)} KB
              </div>
            </div>
            <Field label="Status">
              <Select
                value={active.status}
                onChange={async (v) => {
                  const next = await updatePrescription(active.id, { status: v });
                  setItems((prev) => prev.map((x) => (x.id === next.id ? next : x)));
                  setActive(next);
                }}
                options={STATUS_OPTIONS}
              />
            </Field>
          </div>
        ) : null}
      </Drawer>
    </Card>
  );
}
