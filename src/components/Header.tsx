import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Cpu, Users } from "lucide-react";

export function Header() {
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border card-shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
              <Cpu className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-secondary">Kings Technologies</h1>
              <p className="text-xs text-muted-foreground">Treinamento Interno</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                location.pathname === "/"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Inscrição
            </Link>
            <Link
              to="/rh"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
                location.pathname === "/rh"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Users className="w-4 h-4" />
              Painel RH
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
