import { Trash } from "lucide-react";
import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DeleteButtonProps extends ComponentProps<typeof Button> {
  className?: string;
}

export function DeleteButton({
  onClick,
  className,
  ...props
}: DeleteButtonProps) {
  return (
    <Button
      variant="ghost"
      size={"icon"}
      className={cn(className)}
      onClick={onClick}
      {...props}
    >
      <Trash />
    </Button>
  );
}
