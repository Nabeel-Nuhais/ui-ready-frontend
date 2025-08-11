import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Layers, CalendarCheck, UserMinus } from "lucide-react";
import { useStudents } from "@/hooks/use-students";
import { useBatches } from "@/hooks/use-batches";
import { useAttendance } from "@/hooks/use-attendance";

const Stat = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard";
  const { students } = useStudents();
  const { batches } = useBatches();
  const { records } = useAttendance();

  const today = new Date().toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const totalBatches = batches.length;
    const unassigned = students.filter((s) => !s.batchId).length;
    const todayRecords = records.filter((r) => r.date === today).length;
    return { totalStudents, totalBatches, unassigned, todayRecords };
  }, [students, batches, records, today]);

  return (
    <AppLayout>
      <Helmet>
        <title>Dashboard | Batch Manager</title>
        <meta name="description" content="Overview: students, batches, and attendance status." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <Badge variant="secondary">Live</Badge>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Stat icon={Users} label="Students" value={stats.totalStudents} />
          <Stat icon={Layers} label="Batches" value={stats.totalBatches} />
          <Stat icon={UserMinus} label="Unassigned" value={stats.unassigned} />
          <Stat icon={CalendarCheck} label="Today’s Attendance" value={stats.todayRecords} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">Unassigned students are those without a batch. Use Students → Assign to place them.</div>
            <Separator />
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>Attendance records are grouped by batch and date.</li>
              <li>Use Attendance to view or mark attendance for any day.</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
