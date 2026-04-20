import { useEffect, useMemo, useState } from "react";

import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { Drawer } from "../../components/ui/Drawer";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import type { RefillRequest } from "../../types/domain";
import { listRefillRequests, updateRefillRequest } from "../refill/refillApi";

type Status = RefillRequest["status"];
type StatusFilter = "all" | Status;

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "processed", label: "Processed" },
  { value: "rejected", label: "Rejected" },
];

export function AdminRefillRequestsScreen() {
  const [items, setItems] = useState<RefillRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [active, setActive] = useState<RefillRequest | null>(null);

  async function refresh() {
    const data = await listRefillRequests();
    setItems(data);
  }

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await listRefillRequests();
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load refill requests");
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
    return items.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (phone && !r.phone.includes(phone)) return false;
      return true;
    });
  }, [items, phoneQuery, statusFilter]);

  const statusOptionsWithAll: { value: StatusFilter; label: string }[] = useMemo(() => {
    return [{ value: "all", label: "All" }, ...STATUS_OPTIONS];
  }, []);

  return (
    <Card title="Admin • Refill Requests">
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
        <div className="emptyState">No refill requests yet.</div>
      ) : (
        <div className="table">
          <div className="tableHeader" style={{ gridTemplateColumns: "1fr 0.9fr 0.8fr 0.8fr" }}>
            <div>Date</div>
            <div>Phone</div>
            <div>Status</div>
            <div className="right">Actions</div>
          </div>
          {filtered.map((r) => (
            <div key={r.id} className="tableRow" style={{ gridTemplateColumns: "1fr 0.9fr 0.8fr 0.8fr" }}>
              <div>{new Date(r.createdAt).toLocaleString()}</div>
              <div className="muted">{r.phone}</div>
              <div>
                <Badge tone={r.status === "processed" ? "success" : r.status === "rejected" ? "danger" : "warning"}>
                  {r.status}
                </Badge>
              </div>
              <div className="right row" style={{ justifyContent: "flex-end", gap: 10 }}>
                <Button variant="ghost" onClick={() => setActive(r)}>
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer open={Boolean(active)} title={active ? `Refill • ${active.id}` : "Refill"} onClose={() => setActive(null)}>
        {active ? (
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 6 }}>
              <div className="muted">Created</div>
              <div className="strong">{new Date(active.createdAt).toLocaleString()}</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 6 }}>
              <div className="muted">Phone</div>
              <div className="strong">{active.phone}</div>
            </div>
            <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 6 }}>
              <div className="muted">Request</div>
              <div className="strong">{active.text}</div>
            </div>
            <Field label="Status">
              <Select
                value={active.status}
                onChange={async (v) => {
                  const next = await updateRefillRequest(active.id, { status: v });
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
