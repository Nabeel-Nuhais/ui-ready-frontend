import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBatches } from "@/hooks/use-batches";
import { useStudents } from "@/hooks/use-students";
import { useAttendance } from "@/hooks/use-attendance";
import { toast } from "@/hooks/use-toast";

const AttendanceMark: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialBatchId = params.get("batchId") ?? "";
  const initialDate = params.get("date") ?? "";
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/attendance/mark${initialBatchId && initialDate ? `?batchId=${initialBatchId}&date=${initialDate}` : ""}` : "/attendance/mark";

  const { batches } = useBatches();
  const { students } = useStudents();
  const { getByBatchAndDate, save } = useAttendance();

  const [batchId, setBatchId] = useState(initialBatchId);
  const [date, setDate] = useState<Date | undefined>(initialDate ? new Date(initialDate) : undefined);
  const [open, setOpen] = useState(false);
  const dateStr = useMemo(() => (date ? format(date, "yyyy-MM-dd") : ""), [date]);

  const batchOptions = useMemo(() => batches.map((b) => ({ id: b.id, name: b.name })), [batches]);
  const batchStudents = useMemo(() => students.filter((s) => s.batchId === batchId), [students, batchId]);

  const [presence, setPresence] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!batchId || !dateStr) return;
    const existing = getByBatchAndDate(batchId, dateStr);
    if (existing) {
      const map: Record<string, boolean> = {};
      existing.entries.forEach((e) => { map[e.studentId] = e.present; });
      setPresence(map);
    } else {
      const all: Record<string, boolean> = {};
      batchStudents.forEach((s) => { all[s.id] = true; });
      setPresence(all);
    }
  }, [batchId, dateStr, batchStudents]);

  const toggle = (id: string, value: boolean) => {
    setPresence((p) => ({ ...p, [id]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || !dateStr) return;
    const entries = batchStudents.map((s) => ({ studentId: s.id, present: presence[s.id] ?? true }));
    save(batchId, dateStr, entries);
    toast({ title: "Attendance saved", description: `Saved attendance for ${batchStudents.length} students.` });
    navigate(`/attendance/view?batchId=${batchId}&date=${dateStr}`);
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Mark Attendance | Attendance</title>
        <meta name="description" content="Mark attendance for a batch and date." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="max-w-3xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Mark Attendance</h1>
          <Button variant="secondary" onClick={() => navigate("/attendance")}>Back to Attendance</Button>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Select batch and date, then mark presence.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batch</Label>
                  <Select value={batchId} onValueChange={setBatchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      {batchOptions.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => { setDate(d); setOpen(false); }}
                        disabled={(d) => d > new Date()}
                        fromYear={2000}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown"
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Students</Label>
                {batchId ? (
                  batchStudents.length ? (
                    <ul className="divide-y rounded-md border">
                      {batchStudents.map((s) => (
                        <li key={s.id} className="flex items-center justify-between p-3">
                          <div>
                            <p className="font-medium">{s.name}</p>
                            <p className="text-sm text-muted-foreground">{s.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox id={`cb-${s.id}`} checked={presence[s.id] ?? true} onCheckedChange={(v) => toggle(s.id, Boolean(v))} />
                            <Label htmlFor={`cb-${s.id}`}>Present</Label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No students in this batch.</p>
                  )
                ) : (
                  <p className="text-muted-foreground">Select a batch to load students.</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!batchId || !date || batchStudents.length === 0}>Save Attendance</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default AttendanceMark;
