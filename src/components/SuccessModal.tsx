import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessModal({ open, onClose }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-12 w-12 text-success animate-check-bounce" />
          </div>
          <DialogTitle className="text-2xl text-center">Inscrição Realizada!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Obrigado por participar do treinamento interno da Kings Technologies.
            Você receberá mais informações no e-mail cadastrado.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Button onClick={onClose} className="w-full" size="lg">
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
