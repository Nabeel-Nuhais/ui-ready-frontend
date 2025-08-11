import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useBatches } from "@/hooks/use-batches";

const Attendance: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/attendance` : "/attendance";
  const navigate = useNavigate();
  const { batches } = useBatches();
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState("");

  const batchOptions = useMemo(() => batches.map((b) => ({ id: b.id, name: b.name })), [batches]);

  const onView = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || !date) return;
    navigate(`/attendance/view?batchId=${batchId}&date=${date}`);
  };

  const onMark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId || !date) return;
    navigate(`/attendance/mark?batchId=${batchId}&date=${date}`);
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Attendance | Select batch and date</title>
        <meta name="description" content="Select a batch and date to view or mark attendance." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Attendance</h1>
        <Card>
          <CardHeader>
            <CardTitle>Choose batch and date</CardTitle>
            <CardDescription>View existing records or mark attendance for a specific date.</CardDescription>
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
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
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
