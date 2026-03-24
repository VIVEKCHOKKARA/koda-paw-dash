import { KodaSidebar } from "@/components/KodaSidebar";

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <KodaSidebar />
      <main className="flex-1 overflow-y-auto koda-gradient">
        {children}
      </main>
    </div>
  );
}
