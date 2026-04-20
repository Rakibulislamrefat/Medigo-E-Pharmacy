import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { Medicine } from "../../types/domain";
import { useCartStore } from "../cart/cartStore";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { formatBdt } from "../../lib/money";

import { getMedicine } from "../catalog/catalogApi";

export function MedicineDetailsScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((s) => s.add);
  const [item, setItem] = useState<Medicine | null>(null);
  const [qty, setQty] = useState("1");

  useEffect(() => {
    let mounted = true;
    async function run() {
      const id = params.id ?? "";
      const m = await getMedicine(id);
      if (mounted) setItem(m);
    }
    run();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  if (!item) {
    return (
      <Card title="Medicine">
        <div className="emptyState">
          Not found. <Link to="/">Back to catalog</Link>
        </div>
      </Card>
    );
  }

  const qtyNum = Math.max(1, Math.min(99, Number(qty || "1")));

  return (
    <>
      <div className="breadcrumb">
        <Link to="/">Catalog</Link>
        <span className="breadcrumbSep">/</span>
        <span>{item.name}</span>
      </div>

      <div className="twoColDetail">
        <Card title={item.name} right={item.stockQty > 0 ? <Badge tone="success">In stock</Badge> : <Badge tone="danger">Out</Badge>}>
          <div className="detailMeta">
            <div className="muted">Brand: {item.brand ?? "—"}</div>
            <div className="muted">Category: {item.category ?? "—"}</div>
          </div>

          <div className="detailPrice">{formatBdt(item.price)}</div>
          <p className="detailDesc">{item.description ?? "No description provided."}</p>

          <div className="row" style={{ gap: 12, alignItems: "end" }}>
            <Field label="Quantity">
              <Input value={qty} onChange={setQty} type="number" />
            </Field>
            <Button
              disabled={item.stockQty <= 0}
              onClick={() => {
                addToCart(item, qtyNum);
                navigate("/cart");
              }}
            >
              Add to cart
            </Button>
          </div>
        </Card>

        <Card title="Info">
          <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 10 }}>
            <div className="infoRow">
              <span className="muted">Stock</span>
              <span>{item.stockQty}</span>
            </div>
            <div className="infoRow">
              <span className="muted">Published</span>
              <span>{item.isPublished ? "Yes" : "No"}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
