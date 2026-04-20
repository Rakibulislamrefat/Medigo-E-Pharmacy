import { useEffect, useMemo, useState } from "react";

import type { Medicine } from "../../types/domain";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { listMedicines } from "../catalog/catalogApi";

type Sort = "name" | "stock";

function money(v: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(v);
}

export function AdminInventoryScreen() {
  const [items, setItems] = useState<Medicine[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("name");

  useEffect(() => {
    let mounted = true;
    async function run() {
      const meds = await listMedicines();
      if (mounted) setItems(meds);
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = items.filter((m) => (q ? `${m.name} ${m.brand ?? ""}`.toLowerCase().includes(q) : true));
    const sorted = [...base].sort((a, b) => {
      if (sort === "stock") return b.stockQty - a.stockQty;
      return a.name.localeCompare(b.name);
    });
    return sorted;
  }, [items, query, sort]);

  return (
    <Card title="Admin • Inventory & pricing">
      <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
        <div style={{ minWidth: 260, flex: "1" }}>
          <Field label="Search">
            <Input value={query} onChange={setQuery} placeholder="Search medicine" />
          </Field>
        </div>
        <div style={{ width: 200 }}>
          <Field label="Sort">
            <Select
              value={sort}
              onChange={setSort}
              options={[
                { value: "name", label: "Name" },
                { value: "stock", label: "Stock" },
              ]}
            />
          </Field>
        </div>
      </div>

      <div className="divider" />

      <div className="table">
        <div className="tableHeader">
          <div>Name</div>
          <div>Category</div>
          <div className="right">Price</div>
          <div className="right">Stock</div>
          <div>Published</div>
        </div>
        {filtered.map((m) => (
          <div key={m.id} className={m.stockQty <= 10 ? "tableRow tableRowWarn" : "tableRow"}>
            <div className="strong">{m.name}</div>
            <div className="muted">{m.category ?? "—"}</div>
            <div className="right">{money(m.price)}</div>
            <div className="right">{m.stockQty}</div>
            <div className="muted">{m.isPublished ? "Yes" : "No"}</div>
          </div>
        ))}
      </div>
      <div className="note">This screen reads from the same medicines API/demo data.</div>
    </Card>
  );
}

