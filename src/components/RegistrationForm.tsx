import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DEPARTMENTS, FAMILIARITY_LEVELS } from "@/types/registration";
import { saveRegistration } from "@/lib/storage";
import { SuccessModal } from "./SuccessModal";

const formSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z
    .string()
    .email("E-mail inválido")
    .refine((email) => email.includes("@"), "Digite um e-mail válido"),
  department: z.string().min(1, "Selecione um departamento"),
  familiarityLevel: z.string().min(1, "Selecione um nível"),
  needsAccessibility: z.boolean(),
  accessibilityDetails: z.string().optional(),
  observations: z.string().max(500).optional(),
  participationDate: z.date({
    required_error: "Selecione a data de participação",
  }),
}).refine(
  (data) => {
    if (data.needsAccessibility && !data.accessibilityDetails?.trim()) {
      return false;
    }
    return true;
  },
  {
    message: "Descreva suas necessidades de acessibilidade",
    path: ["accessibilityDetails"],
  }
);

type FormData = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
      familiarityLevel: "",
      needsAccessibility: false,
      accessibilityDetails: "",
      observations: "",
    },
  });

  const watchAccessibility = form.watch("needsAccessibility");

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    saveRegistration({
      fullName: data.fullName,
      email: data.email,
      department: data.department,
      familiarityLevel: data.familiarityLevel,
      needsAccessibility: data.needsAccessibility,
      accessibilityDetails: data.accessibilityDetails,
      observations: data.observations,
      participationDate: format(data.participationDate, "yyyy-MM-dd"),
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    form.reset();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome Completo */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "0ms" }}>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite seu nome completo"
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* E-mail */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "50ms" }}>
                <FormLabel>E-mail Corporativo *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu.email@empresa.com"
                    {...field}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Departamento */}
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                <FormLabel>Departamento/Área *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="transition-all duration-200">
                      <SelectValue placeholder="Selecione seu departamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-card">
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nível de Familiaridade */}
          <FormField
            control={form.control}
            name="familiarityLevel"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "150ms" }}>
                <FormLabel>Nível de Familiaridade com Automação *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap gap-4 pt-2"
                  >
                    {FAMILIARITY_LEVELS.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={level.value}
                          id={level.value}
                          className="border-2 border-muted-foreground/30 data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor={level.value}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {level.label}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Acessibilidade */}
          <FormField
            control={form.control}
            name="needsAccessibility"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer">
                      Precisa de acessibilidade especial?
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Marque se necessitar de recursos especiais durante o treinamento
                    </p>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Detalhes de Acessibilidade */}
          {watchAccessibility && (
            <FormField
              control={form.control}
              name="accessibilityDetails"
              render={({ field }) => (
                <FormItem className="animate-slide-up">
                  <FormLabel>Descreva suas necessidades de acessibilidade *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os recursos de acessibilidade que você precisa..."
                      {...field}
                      className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Data de Participação */}
          <FormField
            control={form.control}
            name="participationDate"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "250ms" }}>
                <FormLabel>Dia que irá participar *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Observações */}
          <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                <FormLabel>Observações/Dúvidas (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite suas observações ou dúvidas..."
                    {...field}
                    className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botão de Envio */}
          <Button
            type="submit"
            size="lg"
            className="w-full animate-fade-in"
            style={{ animationDelay: "350ms" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Realizar Inscrição"
            )}
          </Button>
        </form>
      </Form>

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </>
  );
}
