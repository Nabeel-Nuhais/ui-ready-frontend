import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStudents } from "@/hooks/use-students";
import { useBatches } from "@/hooks/use-batches";
import { toast } from "@/hooks/use-toast";

const StudentEdit: React.FC = () => {
  const [params] = useSearchParams();
  const id = params.get("id");
  const navigate = useNavigate();
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/students/edit${id ? `?id=${id}` : ""}` : "/students/edit";

  const { getById, update } = useStudents();
  const { batches } = useBatches();

  const existing = useMemo(() => getById(id), [getById, id]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", batchId: "" });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || "",
        email: existing.email || "",
        phone: existing.phone || "",
        batchId: existing.batchId ?? "none",
      });
    }
  }, [existing]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!existing) return;
    const normalizedBatchId = form.batchId === "none" || form.batchId === "" ? null : form.batchId;
    update({ id: existing.id, name: form.name, email: form.email, phone: form.phone || undefined, batchId: normalizedBatchId as any });
    toast({ title: "Student updated", description: `${form.name} has been updated.` });
    navigate("/students");
  };

  const batchOptions = useMemo(() => batches.map((b) => ({ id: b.id, name: b.name })), [batches]);

  return (
    <AppLayout>
      <Helmet>
        <title>Edit Student | Students</title>
        <meta name="description" content="Edit an existing student and optionally update batch assignment." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">Edit Student</h1>
        <Card>
          <CardHeader>
            <CardTitle>Student details</CardTitle>
            <CardDescription>Update details and optionally select a batch.</CardDescription>
          </CardHeader>
          <CardContent>
            {!existing ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">Student not found.</p>
                <Button variant="secondary" onClick={() => navigate("/students")}>Back to Students</Button>
              </div>
            ) : (
              <form onSubmit={onSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={onChange} required placeholder="e.g., Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={onChange} required placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="+1 555 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label>Assign to batch (optional)</Label>
                  <Select value={form.batchId} onValueChange={(v) => setForm((f) => ({ ...f, batchId: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a batch (optional)" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      <SelectItem value="none">None</SelectItem>
                      {batchOptions.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default StudentEdit;
