import { useEffect, useMemo, useState } from "react";

export type AttendanceEntry = {
  studentId: string;
  present: boolean;
};

export type AttendanceRecord = {
  id: string;
  batchId: string;
  date: string; // YYYY-MM-DD
  entries: AttendanceEntry[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "attendance";

function readStorage(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AttendanceRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(records: AttendanceRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function useAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    setRecords(readStorage());
  }, []);

  const listAll = useMemo(() => records, [records]);

  const getByBatchAndDate = (batchId?: string | null, date?: string | null) => {
    if (!batchId || !date) return undefined;
    return records.find((r) => r.batchId === batchId && r.date === date);
  };

  const save = (batchId: string, date: string, entries: AttendanceEntry[]) => {
    const existing = records.find((r) => r.batchId === batchId && r.date === date);
    const now = new Date().toISOString();
    if (existing) {
      const next = records.map((r) =>
        r.id === existing.id ? { ...r, entries, updatedAt: now } : r
      );
      setRecords(next);
      writeStorage(next);
      return next.find((r) => r.id === existing.id)!;
    }
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID?.() || String(Date.now()),
      batchId,
      date,
      entries,
      createdAt: now,
      updatedAt: now,
    };
    const next = [newRecord, ...records];
    setRecords(next);
    writeStorage(next);
    return newRecord;
  };

  const listByBatch = (batchId: string) => records.filter((r) => r.batchId === batchId);

  return { records: listAll, getByBatchAndDate, save, listByBatch };
}
