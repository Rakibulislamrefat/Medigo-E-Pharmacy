import { useEffect, useState } from "react";

import { getHome } from "./homeApi";

const STORAGE_KEY = "medigo_home_categories_v1";

type CacheValue = { categories: string[]; savedAt: number };

function readCache(): CacheValue | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheValue;
    if (!Array.isArray(parsed.categories)) return null;
    if (typeof parsed.savedAt !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(value: CacheValue) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

export function useHomeCategories(fallback: string[]) {
  const [categories, setCategories] = useState<string[]>(() => {
    const cached = readCache();
    if (!cached) return fallback;
    const ageMs = Date.now() - cached.savedAt;
    if (ageMs > 5 * 60 * 1000) return fallback;
    return cached.categories.length ? cached.categories : fallback;
  });

  useEffect(() => {
    let mounted = true;
    async function run() {
      const data = await getHome();
      const cats = data?.categories?.filter((c) => typeof c === "string" && c.trim().length > 0) ?? [];
      if (!mounted) return;
      if (cats.length) {
        setCategories(cats);
        writeCache({ categories: cats, savedAt: Date.now() });
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  return categories.length ? categories : fallback;
}

