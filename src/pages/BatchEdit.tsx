import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBatches, type Batch } from "@/hooks/use-batches";
import { toast } from "@/hooks/use-toast";

const BatchEdit: React.FC = () => {
  const [params] = useSearchParams();
  const id = params.get("id");
  const isEditing = Boolean(id);
  const { getById, create, update } = useBatches();
  const navigate = useNavigate();

  const existing = useMemo(() => getById(id), [getById, id]);

  const [form, setForm] = useState<Pick<Batch, "name" | "startDate" | "endDate">>({
    name: existing?.name ?? "",
    startDate: existing?.startDate ?? "",
    endDate: existing?.endDate ?? "",
  });

  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/batches/edit${id ? `?id=${id}` : ""}` : "/batches/edit";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && existing) {
      update({ id: existing.id, ...form });
      toast({ title: "Batch updated", description: `${form.name} has been updated.` });
    } else {
      const created = create(form);
      toast({ title: "Batch created", description: `${created.name} has been added.` });
    }
    navigate("/batches");
  };

  return (
    <AppLayout>
      <Helmet>
        <title>{isEditing ? "Edit Batch" : "New Batch"} | Batches</title>
        <meta name="description" content={isEditing ? "Edit existing batch details." : "Create a new batch with start and end dates."} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">{isEditing ? "Edit Batch" : "Create Batch"}</h1>
        <Card>
          <CardHeader>
            <CardTitle>Batch details</CardTitle>
            <CardDescription>Provide the batch name and timeline.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Batch name</Label>
                <Input id="name" name="name" value={form.name} onChange={onChange} required placeholder="e.g., AI Batch" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input id="startDate" name="startDate" type="date" value={form.startDate} onChange={onChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input id="endDate" name="endDate" type="date" value={form.endDate} onChange={onChange} required />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default BatchEdit;
