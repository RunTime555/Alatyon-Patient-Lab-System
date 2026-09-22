import { Header } from "@/components/header";
import { DashboardCard } from "@/components/dashboard-card";
import { Users } from "lucide-react";

export default function PatientsPage() {
  return (
    <div>
      <Header title="Patients" />

      <div className="p-6">
        <DashboardCard className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Patients Directory
          </h2>
          <p className="text-muted-foreground max-w-md">
            This section is available for healthcare providers. 
            Patient users can view their own records from the Dashboard and Lab Results pages.
          </p>
        </DashboardCard>
      </div>
    </div>
  );
}
