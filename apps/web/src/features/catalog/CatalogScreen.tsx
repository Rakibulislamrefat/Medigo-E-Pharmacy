import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

import type { Medicine } from "../../types/domain";
import { useCartStore } from "../cart/cartStore";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";

import { listMedicines } from "./catalogApi";
import { formatBdt } from "../../lib/money";

type Availability = "all" | "in" | "out";

function uniqueCategories(meds: Medicine[]) {
  const s = new Set<string>();
  for (const m of meds) if (m.category) s.add(m.category);
  return ["All", ...Array.from(s).sort()];
}

export function CatalogScreen() {
  const [params] = useSearchParams();
  const addToCart = useCartStore((s) => s.add);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Medicine[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState<Availability>("all");

  useEffect(() => {
    const q = params.get("q") ?? "";
    const cat = params.get("category") ?? "";
    if (q) setQuery(q);
    if (cat) setCategory(cat);
  }, [params]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      const meds = await listMedicines();
      if (mounted) {
        setItems(meds.filter((m) => m.isPublished));
        setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => uniqueCategories(items), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((m) => (category === "All" ? true : m.category === category))
      .filter((m) => {
        if (availability === "all") return true;
        if (availability === "in") return m.stockQty > 0;
        return m.stockQty <= 0;
      })
      .filter((m) => {
        if (!q) return true;
        return `${m.name} ${m.brand ?? ""}`.toLowerCase().includes(q);
      });
  }, [items, query, category, availability]);

  return (
    <>
      <div className="pageHeader">
        <div>
          <h1 className="pageTitle">Medicines</h1>
          <p className="pageSubtitle">Search, compare prices, and add items to your cart.</p>
        </div>
      </div>

      <div className="twoCol">
        <Card title="Filters">
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 12 }}>
            <Field label="Search">
              <div className="inputWithIcon">
                <span className="inputIcon">
                  <Search size={16} />
                </span>
                <Input value={query} onChange={setQuery} placeholder="Search by name or brand" />
              </div>
            </Field>

            <Field label="Category">
              <Select
                value={category}
                onChange={setCategory}
                options={categories.map((c) => ({ value: c, label: c }))}
              />
            </Field>

            <Field label="Availability">
              <Select
                value={availability}
                onChange={setAvailability}
                options={[
                  { value: "all", label: "All" },
                  { value: "in", label: "In stock" },
                  { value: "out", label: "Out of stock" },
                ]}
              />
            </Field>
          </div>
        </Card>

        <Card
          title={loading ? "Loading…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
          right={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setAvailability("all");
              }}
            >
              Clear
            </Button>
          }
        >
          {filtered.length === 0 ? (
            <div className="emptyState">No medicines match your search.</div>
          ) : (
            <div className="cardsGrid">
              {filtered.map((m) => (
                <article key={m.id} className="medicineCard">
                  <div className="medicineCardTop">
                    <div className="medicineCardTitleRow">
                      <Link to={`/medicines/${m.id}`} className="medicineLink">
                        {m.name}
                      </Link>
                      {m.stockQty > 0 ? (
                        <Badge tone="success">In stock</Badge>
                      ) : (
                        <Badge tone="danger">Out</Badge>
                      )}
                    </div>
                    <div className="medicineMeta">
                      <span>{m.brand ?? ""}</span>
                      <span className="dot">•</span>
                      <span>{m.category ?? ""}</span>
                    </div>
                    <div className="medicinePrice">{formatBdt(m.price)}</div>
                  </div>

                  <div className="medicineCardActions">
                    <Button
                      disabled={m.stockQty <= 0}
                      onClick={() => addToCart(m, 1)}
                      variant={m.stockQty > 0 ? "primary" : "secondary"}
                    >
                      Add to cart
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
