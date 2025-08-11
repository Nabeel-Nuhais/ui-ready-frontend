import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
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

const [openStart, setOpenStart] = useState(false);
const [openEnd, setOpenEnd] = useState(false);
  const startDateObj = useMemo(() => (form.startDate ? new Date(form.startDate) : undefined), [form.startDate]);
  const endDateObj = useMemo(() => (form.endDate ? new Date(form.endDate) : undefined), [form.endDate]);

  useEffect(() => {
    if (isEditing && existing) {
      setForm({ name: existing.name, startDate: existing.startDate, endDate: existing.endDate });
    }
  }, [isEditing, existing]);

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
                  <Popover open={openStart} onOpenChange={setOpenStart}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !startDateObj && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {startDateObj ? format(startDateObj, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={startDateObj}
                        onSelect={(d) => { setForm((f) => ({ ...f, startDate: d ? format(d, "yyyy-MM-dd") : "" })); setOpenStart(false); }}
                        fromYear={2000}
                        toYear={new Date().getFullYear() + 5}
                        captionLayout="dropdown"
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !endDateObj && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {endDateObj ? format(endDateObj, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                      <Calendar
                        mode="single"
                        selected={endDateObj}
                        onSelect={(d) => { setForm((f) => ({ ...f, endDate: d ? format(d, "yyyy-MM-dd") : "" })); setOpenEnd(false); }}
                        fromYear={2000}
                        toYear={new Date().getFullYear() + 5}
                        captionLayout="dropdown"
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
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
