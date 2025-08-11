import { useEffect, useMemo, useState } from "react";

export type Batch = {
  id: string;
  name: string;
  startDate: string; // ISO yyyy-mm-dd
  endDate: string;   // ISO yyyy-mm-dd
};

const STORAGE_KEY = "batches";

function readStorage(): Batch[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Batch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(batches: Batch[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(batches));
}

export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);

  // Seed with an example if empty
  useEffect(() => {
    const existing = readStorage();
    if (existing.length === 0) {
      const seed: Batch[] = [
        {
          id: String(Date.now()),
          name: "AI Batch",
          startDate: new Date().toISOString().slice(0, 10),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 10),
        },
      ];
      writeStorage(seed);
      setBatches(seed);
    } else {
      setBatches(existing);
    }
  }, []);

  const getById = useMemo(
    () => (id?: string | null) => batches.find((b) => b.id === id),
    [batches]
  );

  const create = (data: Omit<Batch, "id">) => {
    const newBatch: Batch = { id: crypto.randomUUID?.() || String(Date.now()), ...data };
    const next = [newBatch, ...batches];
    setBatches(next);
    writeStorage(next);
    return newBatch;
  };

  const update = (updated: Batch) => {
    const next = batches.map((b) => (b.id === updated.id ? updated : b));
    setBatches(next);
    writeStorage(next);
  };

  const remove = (id: string) => {
    const next = batches.filter((b) => b.id !== id);
    setBatches(next);
    writeStorage(next);
  };

  return { batches, create, update, remove, getById };
}
