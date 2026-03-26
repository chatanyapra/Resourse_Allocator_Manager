import { Sidebar, TopBar } from "@/components";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <main className="ml-64 min-h-screen flex flex-col flex-1">
        <TopBar />
        <div className="mt-16 p-8 flex-1 bg-surface-dim">{children}</div>
      </main>
    </div>
  );
}
