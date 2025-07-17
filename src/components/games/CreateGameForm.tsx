"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createGame } from "@/actions/games";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { gameInsertSchema } from "@/lib/schemas";
import { GameInsertType } from "@/lib/types";

type CreateGameFormProps = Partial<GameInsertType>;

export function CreateGameForm(game: CreateGameFormProps) {
  const form = useForm<GameInsertType>({
    resolver: zodResolver(gameInsertSchema),
    defaultValues: { name: "", ...game },
  });

  const onSubmit = (values: GameInsertType) => {
    createGame(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
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
          className="w-32"
        >
          {form.formState.isSubmitting ? "Creating…" : "Create"}
        </Button>
      </form>
    </Form>
  );
}
