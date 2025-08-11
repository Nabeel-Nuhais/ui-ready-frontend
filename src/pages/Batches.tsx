import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useBatches } from "@/hooks/use-batches";
import { toast } from "@/hooks/use-toast";

const Batches: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/batches` : "/batches";
  const navigate = useNavigate();
  const { batches, remove } = useBatches();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    return [...batches].sort((a, b) => a.name.localeCompare(b.name));
  }, [batches]);

  const onEdit = (id: string) => navigate(`/batches/edit?id=${id}`);
  const onCreate = () => navigate(`/batches/edit`);

  const onConfirmDelete = () => {
    if (!pendingDeleteId) return;
    remove(pendingDeleteId);
    setPendingDeleteId(null);
    toast({ title: "Batch deleted", description: "The batch was removed successfully." });
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Batches | Manage cohorts</title>
        <meta name="description" content="List of available batches with start and end dates." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Batches</h1>
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" /> New Batch
          </Button>
        </header>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead>End date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No batches yet. Create one to get started.</TableCell>
                </TableRow>
              ) : (
                sorted.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell>{b.startDate}</TableCell>
                    <TableCell>{b.endDate}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(b.id)} aria-label={`Edit ${b.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setPendingDeleteId(b.id)} aria-label={`Delete ${b.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <AlertDialog open={!!pendingDeleteId} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this batch?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the batch.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Batches;
