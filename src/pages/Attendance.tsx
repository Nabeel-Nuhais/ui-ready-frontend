import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useBatches } from "@/hooks/use-batches";

const Attendance: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/attendance` : "/attendance";
  const navigate = useNavigate();
  const { batches } = useBatches();
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const dateStr = useMemo(() => (date ? format(date, "yyyy-MM-dd") : ""), [date]);

  const batchOptions = useMemo(() => batches.map((b) => ({ id: b.id, name: b.name })), [batches]);

  const onView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || !dateStr) return;
    navigate(`/attendance/view?batchId=${batchId}&date=${dateStr}`);
  };

  const onMark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || !dateStr) return;
    navigate(`/attendance/mark?batchId=${batchId}&date=${dateStr}`);
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Attendance | Select batch and date</title>
        <meta name="description" content="Select a batch and date to view or mark attendance." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="max-w-2xl space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
        <Card>
          <CardHeader>
            <CardTitle>Quick attendance lookup</CardTitle>
            <CardDescription>Select a batch and date to view or mark attendance.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={onView}>
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
                      fromYear={1990}
                      toYear={new Date().getFullYear()}
                      captionLayout="dropdown"
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!batchId || !date}>View Attendance</Button>
                <Button type="button" variant="secondary" disabled={!batchId || !date} onClick={onMark}>Mark Attendance</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default Attendance;
