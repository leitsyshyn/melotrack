import { Edit } from "lucide-react";
import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EditButtonProps extends ComponentProps<typeof Button> {
  className?: string;
}

export function EditButton({ onClick, className, ...props }: EditButtonProps) {
  return (
    <Button
      variant="ghost"
      size={"icon"}
      className={cn(className)}
      onClick={onClick}
      {...props}
    >
      <Edit />
    </Button>
  );
}
