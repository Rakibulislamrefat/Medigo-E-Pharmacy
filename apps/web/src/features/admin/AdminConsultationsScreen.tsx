import { useEffect, useMemo, useState } from "react";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Drawer } from "../../components/ui/Drawer";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import type { ConsultationRequest } from "../../types/domain";
import { listConsultations, updateConsultation } from "../consultation/consultationApi";

type Status = ConsultationRequest["status"];
type StatusFilter = "all" | Status;

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "requested", label: "Requested" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function AdminConsultationsScreen() {
  const [items, setItems] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [active, setActive] = useState<ConsultationRequest | null>(null);
  const [scheduledTimeDraft, setScheduledTimeDraft] = useState("");

  async function refresh() {
    const data = await listConsultations();
    setItems(data);
  }

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await listConsultations();
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load consultations");
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
    return items.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (phone && !c.phone.includes(phone)) return false;
      return true;
    });
  }, [items, phoneQuery, statusFilter]);

  const statusOptionsWithAll: { value: StatusFilter; label: string }[] = useMemo(() => {
    return [{ value: "all", label: "All" }, ...STATUS_OPTIONS];
  }, []);

  return (
    <Card title="Admin • Doctor Consultations">
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
        <div className="emptyState">No consultation requests yet.</div>
      ) : (
        <div className="table">
          <div className="tableHeader" style={{ gridTemplateColumns: "1fr 1fr 1fr 0.9fr 0.8fr" }}>
            <div>Date</div>
            <div>Name</div>
            <div>Phone</div>
            <div>Status</div>
            <div className="right">Actions</div>
          </div>
          {filtered.map((c) => (
            <div key={c.id} className="tableRow" style={{ gridTemplateColumns: "1fr 1fr 1fr 0.9fr 0.8fr" }}>
              <div>{new Date(c.createdAt).toLocaleString()}</div>
              <div className="strong">{c.fullName}</div>
              <div className="muted">{c.phone}</div>
              <div>
                <Badge tone={c.status === "completed" ? "success" : c.status === "cancelled" ? "danger" : "warning"}>
                  {c.status}
                </Badge>
              </div>
              <div className="right">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setActive(c);
                    setScheduledTimeDraft(c.scheduledTime ?? "");
                  }}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        open={Boolean(active)}
        title={active ? `Consultation • ${active.id}` : "Consultation"}
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
              <div className="muted">Notes</div>
              <div className="strong">{active.notes}</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 6 }}>
              <div className="muted">Preferred time</div>
              <div className="strong">{active.preferredTime ?? "—"}</div>
            </div>
            <Field label="Scheduled time">
              <Input value={scheduledTimeDraft} onChange={setScheduledTimeDraft} placeholder="Example: 2026-04-21 8:00pm" />
            </Field>
            <Field label="Status">
              <Select
                value={active.status}
                onChange={async (v) => {
                  const next = await updateConsultation(active.id, { status: v });
                  setItems((prev) => prev.map((x) => (x.id === next.id ? next : x)));
                  setActive(next);
                }}
                options={STATUS_OPTIONS}
              />
            </Field>
            <div className="row" style={{ justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
              <Button
                variant="secondary"
                onClick={async () => {
                  const st = scheduledTimeDraft.trim();
                  const next = await updateConsultation(active.id, { status: "scheduled", scheduledTime: st || null });
                  setItems((prev) => prev.map((x) => (x.id === next.id ? next : x)));
                  setActive(next);
                }}
              >
                Set schedule
              </Button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </Card>
  );
}
