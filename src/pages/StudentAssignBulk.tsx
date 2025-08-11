import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/hooks/use-students";
import { useBatches } from "@/hooks/use-batches";
import { toast } from "@/hooks/use-toast";

const StudentAssignBulk: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/students/assign-bulk` : "/students/assign-bulk";
  const navigate = useNavigate();
  const { students, assignBatch } = useStudents();
  const { batches } = useBatches();

  const [search, setSearch] = useState("");
  const [batchId, setBatchId] = useState("");

  const unassigned = useMemo(() => students.filter((s) => !s.batchId), [students]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return unassigned;
    return unassigned.filter((s) =>
      s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  }, [search, unassigned]);

  const batchOptions = useMemo(() => batches.map((b) => ({ id: b.id, name: b.name })), [batches]);

  const assignAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) return;
    if (unassigned.length === 0) return;
    unassigned.forEach((s) => assignBatch(s.id, batchId));
    toast({ title: "Assigned", description: `Assigned ${unassigned.length} students to selected batch.` });
    navigate("/students");
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Assign Unassigned | Students</title>
        <meta name="description" content="Bulk-assign all unassigned students to a batch. Search to preview who will be assigned." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Assign Unassigned Students</h1>
        <Card>
          <CardHeader>
            <CardTitle>Bulk assignment</CardTitle>
            <CardDescription>Select a batch, review unassigned students, then assign all.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={assignAll}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target batch</Label>
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
                  <Label htmlFor="search">Search unassigned</Label>
                  <Input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Unassigned students</Label>
                  <span className="text-sm text-muted-foreground">{filtered.length} shown · {unassigned.length} total</span>
                </div>
                <div className="rounded-md border max-h-80 overflow-auto">
                  {unassigned.length === 0 ? (
                    <p className="p-3 text-muted-foreground">All students are assigned.</p>
                  ) : filtered.length === 0 ? (
                    <p className="p-3 text-muted-foreground">No matches.</p>
                  ) : (
                    <ul className="divide-y">
                      {filtered.map((s) => (
                        <li key={s.id} className="p-3">
                          <p className="font-medium">{s.name}</p>
                          <p className="text-sm text-muted-foreground">{s.email}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!batchId || unassigned.length === 0}>Assign all unassigned</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default StudentAssignBulk;
