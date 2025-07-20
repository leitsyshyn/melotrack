import { ComponentProps, useState } from "react";

import { GameForm } from "@/components/games/GameForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface GameDialogProps extends ComponentProps<typeof GameForm> {
  children: React.ReactNode;
  dialogTitle: string;
  dialogDescription?: string;
}

export default function GameDialog({ children, ...props }: GameDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.dialogTitle}</DialogTitle>
          <DialogDescription>{props.dialogDescription}</DialogDescription>
        </DialogHeader>
        <GameForm {...props} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
