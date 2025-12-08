import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { RegistrationsTable } from "@/components/RegistrationsTable";
import { HRPasswordGate } from "@/components/HRPasswordGate";
import { Registration } from "@/types/registration";
import { getRegistrations } from "@/lib/storage";
import { ClipboardList } from "lucide-react";

const HRDashboard = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("hr_authenticated") === "true";
  });

  const loadData = () => {
    setRegistrations(getRegistrations());
  };

  useEffect(() => {
    loadData();
    
    // Listen for storage changes (in case of multiple tabs)
    window.addEventListener("storage", loadData);
    
    // Refresh every 5 seconds to catch new submissions
    const interval = setInterval(loadData, 5000);

    return () => {
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
    };
  }, []);

  if (!isAuthenticated) {
    return <HRPasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Title Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/10 rounded-xl">
              <ClipboardList className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-secondary">
                Painel de Gestão - RH
              </h1>
              <p className="text-muted-foreground">
                Visualize e gerencie todas as inscrições para o treinamento
              </p>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="animate-slide-up">
          <RegistrationsTable registrations={registrations} onStatusChange={loadData} />
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;
