import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Senha padrão - pode ser alterada aqui
const HR_PASSWORD = "Kingsman";

interface HRPasswordGateProps {
  onAuthenticated: () => void;
}

export const HRPasswordGate = ({ onAuthenticated }: HRPasswordGateProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular um pequeno delay para feedback visual
    setTimeout(() => {
      if (password === HR_PASSWORD) {
        sessionStorage.setItem("hr_authenticated", "true");
        onAuthenticated();
        toast({
          title: "Acesso autorizado",
          description: "Bem-vindo ao painel do RH.",
        });
      } else {
        toast({
          title: "Senha incorreta",
          description: "Por favor, verifique a senha e tente novamente.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-secondary">Área Restrita</CardTitle>
          <CardDescription>
            Digite a senha para acessar o painel de gestão do RH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha de Acesso</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !password}>
              {isLoading ? "Verificando..." : "Acessar Painel"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
