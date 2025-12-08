import { Header } from "@/components/Header";
import { RegistrationForm } from "@/components/RegistrationForm";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-2">
              Inscrição para Treinamento Interno
            </h1>
            <p className="text-muted-foreground">
              Preencha os dados abaixo para participar do nosso programa de capacitação em automação.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card rounded-xl border border-border card-shadow-lg p-6 md:p-8 animate-slide-up">
            <RegistrationForm />
          </div>

          {/* Footer Info */}
          <p className="text-center text-sm text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
            Campos marcados com * são obrigatórios
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
