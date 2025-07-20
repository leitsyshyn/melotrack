import { ComponentProps, useState } from "react";

import { TrackForm } from "@/components/games/TrackForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface TrackDialogProps extends ComponentProps<typeof TrackForm> {
  children: React.ReactNode;
  dialogTitle: string;
  dialogDescription?: string;
}

export default function TrackDialog({ children, ...props }: TrackDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.dialogTitle}</DialogTitle>
          <DialogDescription>{props.dialogDescription}</DialogDescription>
        </DialogHeader>
        <TrackForm {...props} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
