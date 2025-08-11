import React from "react";
import { Helmet } from "react-helmet-async";
import AppLayout from "@/components/layout/AppLayout";

const Dashboard: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "/dashboard";

  return (
    <AppLayout>
      <Helmet>
        <title>Dashboard | ui-ready-frontend</title>
        <meta name="description" content="Dashboard overview for your app." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <section className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Use the sidebar to navigate: Students, Batches, Attendance.</p>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
