"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateGame, useUpdateGame } from "@/lib/mutations/games";
import { gameInsertSchema } from "@/lib/schemas";
import { GameInsertType } from "@/lib/types";

type GameFormProps = Partial<GameInsertType> & {
  onSuccess?: () => void;
};

export function GameForm(props: GameFormProps) {
  const form = useForm<GameInsertType>({
    resolver: zodResolver(gameInsertSchema),
    defaultValues: { name: "", ...props },
  });

  const createMutation = useCreateGame();
  const updateMutation = useUpdateGame(props.id ?? "");

  const onSubmit = (values: GameInsertType) => {
    if (props.id) {
      updateMutation.mutate(values, {
        onSuccess: () => {
          form.reset();
          props.onSuccess?.();
        },
      });
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          form.reset();
          props.onSuccess?.();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Game name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gap (s)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Gap (s)"
                  step="1"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value) || "")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 h-13.5"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : props.id ? (
            "Save"
          ) : (
            "Add"
          )}
        </Button>
      </form>
    </Form>
  );
}
