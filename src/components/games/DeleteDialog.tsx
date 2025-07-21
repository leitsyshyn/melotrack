import { DialogClose } from "@radix-ui/react-dialog";
import { UseMutationResult } from "@tanstack/react-query";
import { Loader2, Trash } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface DeleteDialogProps {
  dialogTitle: string;
  dialogDescription?: string;
  deleteMutation: UseMutationResult<void, unknown, void, unknown>;
}

export default function DeleteDialog({
  dialogTitle,
  dialogDescription,
  deleteMutation,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"icon"}>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="secondary"
              disabled={deleteMutation.isPending}
              className="h-13.5 flex-1"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteMutation?.mutate(undefined, {
                onSuccess: () => setOpen(false),
              })
            }
            className="h-13.5 flex-1"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
