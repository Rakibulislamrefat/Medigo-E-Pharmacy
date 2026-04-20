import { useEffect, useMemo, useState } from "react";

import { Card } from "../../components/ui/Card";
import { Field } from "../../components/ui/Field";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";

import type { Banner } from "./bannersApi";
import { createBanner, deleteBanner, listBanners, updateBanner } from "./bannersApi";

type FormState = {
  title: string;
  subtitle: string;
  imageUrl: string;
  isActive: "true" | "false";
  sortOrder: string;
};

function emptyForm(): FormState {
  return { title: "", subtitle: "", imageUrl: "", isActive: "true", sortOrder: "0" };
}

function toForm(b: Banner): FormState {
  return {
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.imageUrl,
    isActive: b.isActive ? "true" : "false",
    sortOrder: String(b.sortOrder),
  };
}

export function AdminBannersScreen() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Banner[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return form.title.trim() && form.subtitle.trim() && form.imageUrl.trim();
  }, [form]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data = await listBanners();
        if (mounted) setItems(data);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Failed to load banners");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  async function refresh() {
    const data = await listBanners();
    setItems(data);
  }

  const isEditing = Boolean(editingId);

  return (
    <Card title="Admin • Banners">
      {error ? <div className="errorBanner">{error}</div> : null}

      <Card title={isEditing ? "Edit banner" : "Create banner"}>
        <div className="grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          <Field label="Title">
            <Input value={form.title} onChange={(v) => setForm((s) => ({ ...s, title: v }))} placeholder="Banner title" />
          </Field>
          <Field label="Subtitle">
            <Input
              value={form.subtitle}
              onChange={(v) => setForm((s) => ({ ...s, subtitle: v }))}
              placeholder="Banner subtitle"
            />
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Image URL">
              <Input
                value={form.imageUrl}
                onChange={(v) => setForm((s) => ({ ...s, imageUrl: v }))}
                placeholder="https://... or image CDN URL"
              />
            </Field>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="bannerPreview">
              <img
                className="bannerPreviewImg"
                src={
                  form.imageUrl.trim() ||
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='700' viewBox='0 0 1600 700'%3E%3Crect width='1600' height='700' rx='40' fill='%23F1F5F9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23647569' font-family='system-ui, -apple-system, Segoe UI, Roboto, Arial' font-size='28' font-weight='900'%3EPreview%3C/text%3E%3C/svg%3E"
                }
                alt=""
              />
            </div>
          </div>
          <Field label="Active">
            <Select
              value={form.isActive}
              onChange={(v) => setForm((s) => ({ ...s, isActive: v as FormState["isActive"] }))}
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
            />
          </Field>
          <Field label="Sort order">
            <Input
              value={form.sortOrder}
              onChange={(v) => setForm((s) => ({ ...s, sortOrder: v }))}
              placeholder="0"
            />
          </Field>
        </div>

        <div className="divider" />

        <div className="row" style={{ justifyContent: "flex-end", gap: 10 }}>
          {isEditing ? (
            <Button
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm());
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setForm(emptyForm())}>
              Clear
            </Button>
          )}
          <Button
            variant="primary"
            disabled={!canSubmit}
            onClick={async () => {
              setError(null);
              const sortOrder = Number(form.sortOrder || 0);
              try {
                const payload = {
                  title: form.title.trim(),
                  subtitle: form.subtitle.trim(),
                  imageUrl: form.imageUrl.trim(),
                  isActive: form.isActive === "true",
                  sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
                };

                if (editingId) {
                  await updateBanner(editingId, payload);
                  setEditingId(null);
                } else {
                  await createBanner(payload);
                }

                setForm(emptyForm());
                await refresh();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to create banner");
              }
            }}
          >
            {isEditing ? "Save" : "Create"}
          </Button>
        </div>
      </Card>

      <div className="divider" />

      <Card title={loading ? "Loading…" : `Banners (${items.length})`}>
        {items.length === 0 ? (
          <div className="emptyState">No banners yet. Create one above to control the homepage slider.</div>
        ) : (
          <div className="table">
            <div className="tableHeader" style={{ gridTemplateColumns: "2fr 0.7fr 0.6fr 0.9fr 1fr" }}>
              <div>Title</div>
              <div>Active</div>
              <div className="right">Sort</div>
              <div>Preview</div>
              <div className="right">Actions</div>
            </div>
            {items.map((b) => (
              <div key={b.id} className="tableRow" style={{ gridTemplateColumns: "2fr 0.7fr 0.6fr 0.9fr 1fr" }}>
                <div>
                  <div className="strong">{b.title}</div>
                  <div className="muted">{b.subtitle}</div>
                </div>
                <div className="muted">{b.isActive ? "Yes" : "No"}</div>
                <div className="right">{b.sortOrder}</div>
                <div className="bannerThumbCell">
                  <a href={b.imageUrl} target="_blank" rel="noreferrer" className="bannerThumbLink">
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="bannerThumb"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='700' viewBox='0 0 1600 700'%3E%3Crect width='1600' height='700' rx='40' fill='%23F1F5F9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23647569' font-family='system-ui, -apple-system, Segoe UI, Roboto, Arial' font-size='28' font-weight='900'%3ENo image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </a>
                </div>
                <div className="right row" style={{ justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditingId(b.id);
                      setForm(toForm(b));
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await updateBanner(b.id, { isActive: !b.isActive });
                      await refresh();
                    }}
                  >
                    Toggle
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await deleteBanner(b.id);
                      await refresh();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </Card>
  );
}
