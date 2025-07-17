"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createRound } from "@/actions/rounds";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { roundInsertSchema } from "@/lib/schemas";
import { RoundInsertType } from "@/lib/types";

type CreateRoundFormProps = Partial<
  Omit<RoundInsertType, "gameId" | "position">
> &
  Pick<RoundInsertType, "gameId" | "position">;

export function CreateRoundForm(round: CreateRoundFormProps) {
  const form = useForm<RoundInsertType>({
    resolver: zodResolver(roundInsertSchema),
    defaultValues: {
      name: "",
      ...round,
    },
  });

  const onSubmit = (values: RoundInsertType) => {
    createRound(values);
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
                <Input placeholder="Round name" {...field} />
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
