import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAttendance } from "@/hooks/use-attendance";
import { useBatches } from "@/hooks/use-batches";
import { useStudents } from "@/hooks/use-students";

const AttendanceView: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const batchId = params.get("batchId");
  const date = params.get("date");
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/attendance/view${batchId && date ? `?batchId=${batchId}&date=${date}` : ""}` : "/attendance/view";

  const { getByBatchAndDate } = useAttendance();
  const { batches } = useBatches();
  const { students } = useStudents();

  const record = getByBatchAndDate(batchId, date);

  const batchName = useMemo(() => batches.find((b) => b.id === batchId)?.name ?? "(Unknown batch)", [batches, batchId]);
  const studentMap = useMemo(() => new Map(students.map((s) => [s.id, s])), [students]);

  return (
    <AppLayout>
      <Helmet>
        <title>View Attendance | Attendance</title>
        <meta name="description" content="View attendance for a selected batch and date." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="max-w-3xl space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Attendance</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate(`/attendance/mark?batchId=${batchId ?? ""}&date=${date ?? ""}`)}>Edit/Mark</Button>
            <Button variant="secondary" onClick={() => navigate("/attendance")}>Back to Attendance</Button>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>{batchName}</CardTitle>
            <CardDescription>Date: {date || "(no date)"}</CardDescription>
          </CardHeader>
          <CardContent>
            {!record ? (
              <div className="space-y-3">
                <p className="text-muted-foreground">No attendance record found for this batch and date.</p>
                <Button onClick={() => navigate(`/attendance/mark?batchId=${batchId ?? ""}&date=${date ?? ""}`)}>Mark Attendance</Button>
              </div>
            ) : (
              <ul className="divide-y rounded-md border">
                {record.entries.map((e) => {
                  const s = studentMap.get(e.studentId);
                  if (!s) return null;
                  return (
                    <li key={e.studentId} className="flex items-center justify-between p-3">
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.email}</p>
                      </div>
                      <Badge variant={e.present ? "default" : "destructive"}>
                        {e.present ? "Present" : "Absent"}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default AttendanceView;
