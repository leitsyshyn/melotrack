"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Slot } from "@radix-ui/react-slot";
import { GripVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SortableProps {
  id: number;
  index: number;
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}
export function SortableItem({
  id,
  index,
  children,
  className,
  asChild,
}: SortableProps) {
  const { ref, handleRef } = useSortable({ id, index });
  const Comp = asChild ? Slot : "li";
  return (
    <Comp
      ref={ref}
      className={cn("p-2 flex gap-2 items-center justify-between", className)}
    >
      {children}
      <Button ref={handleRef} variant="ghost" size="icon" className="">
        <GripVertical />
      </Button>
    </Comp>
  );
}

export interface SortableListProps {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function SortableList({
  className,
  children,
  asChild,
}: SortableListProps) {
  const Comp = asChild ? Slot : "ul";
  return (
    <DragDropProvider>
      <Comp className={className}>{children}</Comp>
    </DragDropProvider>
  );
}
