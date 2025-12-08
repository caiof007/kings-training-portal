import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, Filter, Users, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Registration, DEPARTMENTS, FAMILIARITY_LEVELS } from "@/types/registration";
import { downloadCSV } from "@/lib/storage";

interface RegistrationsTableProps {
  registrations: Registration[];
}

export function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [familiarityFilter, setFamiliarityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesDepartment =
        departmentFilter === "all" || reg.department === departmentFilter;
      const matchesFamiliarity =
        familiarityFilter === "all" || reg.familiarityLevel === familiarityFilter;
      const matchesSearch =
        searchTerm === "" ||
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesDepartment && matchesFamiliarity && matchesSearch;
    });
  }, [registrations, departmentFilter, familiarityFilter, searchTerm]);

  const getDepartmentLabel = (value: string) => {
    return DEPARTMENTS.find((d) => d.value === value)?.label || value;
  };

  const getFamiliarityLabel = (value: string) => {
    return FAMILIARITY_LEVELS.find((f) => f.value === value)?.label || value;
  };

  const getFamiliarityVariant = (value: string) => {
    switch (value) {
      case "alto":
        return "default";
      case "medio":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border card-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Inscritos</p>
              <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border card-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Filter className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Filtrados</p>
              <p className="text-2xl font-bold text-foreground">{filteredRegistrations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border card-shadow">
          <Button
            onClick={() => downloadCSV(filteredRegistrations)}
            className="w-full h-full"
            variant="outline"
            disabled={filteredRegistrations.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Departamento" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">Todos os Departamentos</SelectItem>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept.value} value={dept.value}>
                {dept.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={familiarityFilter} onValueChange={setFamiliarityFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Familiaridade" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">Todos os Níveis</SelectItem>
            {FAMILIARITY_LEVELS.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden card-shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Familiaridade</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Acessibilidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhuma inscrição encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistrations.map((reg, index) => (
                <TableRow
                  key={reg.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <TableCell className="font-medium">{reg.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{reg.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getDepartmentLabel(reg.department)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getFamiliarityVariant(reg.familiarityLevel)}>
                      {getFamiliarityLabel(reg.familiarityLevel)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(reg.participationDate), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    {reg.needsAccessibility ? (
                      <span className="text-primary text-sm" title={reg.accessibilityDetails}>
                        Sim
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Não</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
