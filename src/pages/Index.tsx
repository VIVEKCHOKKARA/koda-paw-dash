import { KodaSidebar } from "@/components/KodaSidebar";
import { DashboardContent } from "@/components/DashboardContent";

const Index = () => {
  return (
    <div className="flex min-h-screen w-full">
      <KodaSidebar />
      <DashboardContent />
    </div>
  );
};

export default Index;
