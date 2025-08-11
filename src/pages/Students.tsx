import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { useStudents } from "@/hooks/use-students";
import { useBatches } from "@/hooks/use-batches";
import { toast } from "@/hooks/use-toast";

const Students: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/students` : "/students";
  const navigate = useNavigate();
  const { students, remove } = useStudents();
  const { batches } = useBatches();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const batchMap = useMemo(() => new Map(batches.map((b) => [b.id, b.name])), [batches]);
  const sorted = useMemo(() => [...students].sort((a, b) => a.name.localeCompare(b.name)), [students]);

  const onCreate = () => navigate("/students/create");
  const onAssign = (id: string) => navigate(`/students/assign?id=${id}`);

  const onConfirmDelete = () => {
    if (!pendingDeleteId) return;
    remove(pendingDeleteId);
    setPendingDeleteId(null);
    toast({ title: "Student deleted", description: "The student was removed successfully." });
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Students | Manage students</title>
        <meta name="description" content="List of students with batch assignments." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" /> New Student
          </Button>
        </header>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">No students yet. Add one to get started.</TableCell>
                </TableRow>
              ) : (
                sorted.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone || "-"}</TableCell>
                    <TableCell>{s.batchId ? batchMap.get(s.batchId) || "(removed)" : "Not assigned"}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => onAssign(s.id)} aria-label={`Assign batch to ${s.name}`}>
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setPendingDeleteId(s.id)} aria-label={`Delete ${s.name}`}>
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
            <AlertDialogTitle>Delete this student?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student.
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

export default Students;
