import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/hooks/use-students";
import { useBatches } from "@/hooks/use-batches";
import { toast } from "@/hooks/use-toast";

const StudentAssign: React.FC = () => {
  const [params] = useSearchParams();
  const id = params.get("id");
  const navigate = useNavigate();
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/students/assign${id ? `?id=${id}` : ""}` : "/students/assign";
  const { getById, assignBatch } = useStudents();
  const { batches } = useBatches();

  const student = useMemo(() => getById(id), [getById, id]);
  const [batchId, setBatchId] = useState(student?.batchId ?? "");

  const batchOptions = useMemo(() => batches.map((b) => ({ id: b.id, name: b.name })), [batches]);

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !id || !batchId) return;
    assignBatch(id, batchId);
    toast({ title: "Student assigned", description: `${student.name} assigned to batch.` });
    navigate("/students");
  };

  if (!student) {
    return (
      <AppLayout>
        <section className="max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight mb-4">Assign Student</h1>
          <p className="text-muted-foreground">Student not found.</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate("/students")}>Back to Students</Button>
          </div>
        </section>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Helmet>
        <title>Assign Student | Students</title>
        <meta name="description" content="Assign a student to a batch." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Assign {student.name}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Select batch</CardTitle>
            <CardDescription>Choose one of the available batches to assign.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2">
                <Label>Batch</Label>
                <Select value={batchId} onValueChange={setBatchId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchOptions.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!batchId}>Assign</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default StudentAssign;
