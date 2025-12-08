import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, Filter, Users, Search, Check, X, Clock } from "lucide-react";

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
import { Registration, DEPARTMENTS, FAMILIARITY_LEVELS, ApprovalStatus } from "@/types/registration";
import { downloadCSV, updateApprovalStatus } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface RegistrationsTableProps {
  registrations: Registration[];
  onStatusChange?: () => void;
}

export function RegistrationsTable({ registrations, onStatusChange }: RegistrationsTableProps) {
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [familiarityFilter, setFamiliarityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesDepartment =
        departmentFilter === "all" || reg.department === departmentFilter;
      const matchesFamiliarity =
        familiarityFilter === "all" || reg.familiarityLevel === familiarityFilter;
      const matchesStatus =
        statusFilter === "all" || reg.approvalStatus === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesDepartment && matchesFamiliarity && matchesStatus && matchesSearch;
    });
  }, [registrations, departmentFilter, familiarityFilter, statusFilter, searchTerm]);

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

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Reprovado</Badge>;
      default:
        return <Badge variant="outline" className="text-amber-600 border-amber-500/30">Pendente</Badge>;
    }
  };

  const handleApproval = (id: string, status: ApprovalStatus) => {
    updateApprovalStatus(id, status);
    toast({
      title: status === "approved" ? "Inscrição aprovada" : "Inscrição reprovada",
      description: status === "approved" 
        ? "O participante foi aprovado para o treinamento."
        : "O participante foi reprovado.",
    });
    onStatusChange?.();
  };

  const pendingCount = registrations.filter(r => r.approvalStatus === "pending").length;
  const approvedCount = registrations.filter(r => r.approvalStatus === "approved").length;
  const rejectedCount = registrations.filter(r => r.approvalStatus === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border card-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{registrations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border card-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border card-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Aprovados</p>
              <p className="text-2xl font-bold text-foreground">{approvedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border card-shadow">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reprovados</p>
              <p className="text-2xl font-bold text-foreground">{rejectedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border card-shadow col-span-2 md:col-span-1">
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card">
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="rejected">Reprovados</SelectItem>
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
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
                  <TableCell>{getStatusBadge(reg.approvalStatus)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant={reg.approvalStatus === "approved" ? "default" : "outline"}
                        className={reg.approvalStatus === "approved" ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-500/10 hover:text-green-600"}
                        onClick={() => handleApproval(reg.id, "approved")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={reg.approvalStatus === "rejected" ? "default" : "outline"}
                        className={reg.approvalStatus === "rejected" ? "bg-red-600 hover:bg-red-700" : "hover:bg-red-500/10 hover:text-red-600"}
                        onClick={() => handleApproval(reg.id, "rejected")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
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
