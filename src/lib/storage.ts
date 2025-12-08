import { Registration, ApprovalStatus } from "@/types/registration";

const STORAGE_KEY = "kings_tech_registrations";

export const getRegistrations = (): Registration[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRegistration = (registration: Omit<Registration, "id" | "createdAt" | "approvalStatus">): Registration => {
  const registrations = getRegistrations();
  const newRegistration: Registration = {
    ...registration,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    approvalStatus: "pending",
  };
  registrations.push(newRegistration);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  return newRegistration;
};

export const updateApprovalStatus = (id: string, status: ApprovalStatus): void => {
  const registrations = getRegistrations();
  const index = registrations.findIndex((r) => r.id === id);
  if (index !== -1) {
    registrations[index].approvalStatus = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
  }
};

const getApprovalLabel = (status: ApprovalStatus): string => {
  switch (status) {
    case "approved": return "Aprovado";
    case "rejected": return "Reprovado";
    default: return "Pendente";
  }
};

export const exportToCSV = (registrations: Registration[]): string => {
  const headers = [
    "ID",
    "Nome Completo",
    "E-mail",
    "Departamento",
    "Nível de Familiaridade",
    "Precisa Acessibilidade",
    "Detalhes Acessibilidade",
    "Observações",
    "Data de Participação",
    "Data de Inscrição",
    "Status",
  ];

  const rows = registrations.map((r) => [
    r.id,
    r.fullName,
    r.email,
    r.department,
    r.familiarityLevel,
    r.needsAccessibility ? "Sim" : "Não",
    r.accessibilityDetails || "",
    r.observations || "",
    r.participationDate,
    new Date(r.createdAt).toLocaleDateString("pt-BR"),
    getApprovalLabel(r.approvalStatus),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  return csvContent;
};

export const downloadCSV = (registrations: Registration[]) => {
  const csv = exportToCSV(registrations);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `inscricoes_treinamento_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
