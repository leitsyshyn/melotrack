import { ComponentProps, useState } from "react";

import { RoundForm } from "@/components/games/RoundForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface RoundDialogProps extends ComponentProps<typeof RoundForm> {
  children: React.ReactNode;
  dialogTitle: string;
  dialogDescription?: string;
}

export default function RoundDialog({ children, ...props }: RoundDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.dialogTitle}</DialogTitle>
          <DialogDescription>{props.dialogDescription}</DialogDescription>
        </DialogHeader>
        <RoundForm {...props} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
