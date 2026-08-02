import { Sidebar } from "@/components/layout/sidebar";
import { getServerSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-4 lg:grid-cols-[18rem_minmax(0,1fr)] lg:px-6">
        <Sidebar />
        <main className="min-w-0">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
