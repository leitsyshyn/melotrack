"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { gameInsertSchema } from "@/lib/schemas";
import { GameInsertType } from "@/lib/types";
import { useCreateGame } from "@/mutations/games";

type GameFormProps = Partial<GameInsertType> & {
  onSuccess?: () => void;
};

export function GameForm(game: GameFormProps) {
  const form = useForm<GameInsertType>({
    resolver: zodResolver(gameInsertSchema),
    defaultValues: { name: "", ...game },
  });

  const mutation = useCreateGame();

  const onSubmit = (values: GameInsertType) => {
    mutation.mutate(values);
    form.reset();
    game.onSuccess?.();
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
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 h-13.5"
        >
          {form.formState.isSubmitting ? "Creating…" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
