export interface Registration {
  id: string;
  fullName: string;
  email: string;
  department: string;
  familiarityLevel: string;
  needsAccessibility: boolean;
  accessibilityDetails?: string;
  observations?: string;
  participationDate: string;
  createdAt: string;
}

export const DEPARTMENTS = [
  { value: "rh", label: "RH" },
  { value: "ti", label: "TI" },
  { value: "vendas", label: "Vendas" },
  { value: "operacoes", label: "Operações" },
] as const;

export const FAMILIARITY_LEVELS = [
  { value: "baixo", label: "Baixo" },
  { value: "medio", label: "Médio" },
  { value: "alto", label: "Alto" },
] as const;
