"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { roundInsertSchema } from "@/lib/schemas";
import { RoundInsertType } from "@/lib/types";
import { useCreateRound, useUpdateRound } from "@/mutations/rounds";

type RoundFormProps = Partial<Omit<RoundInsertType, "gameId" | "position">> &
  Pick<RoundInsertType, "gameId"> & { onSuccess?: () => void };

export function RoundForm(props: RoundFormProps) {
  const form = useForm<RoundInsertType>({
    resolver: zodResolver(roundInsertSchema),
    defaultValues: {
      name: "",
      ...props,
    },
  });

  const createMutation = useCreateRound(props.gameId);
  const updateMutation = useUpdateRound(props.gameId, props.id ?? "");

  const onSubmit = (values: RoundInsertType) => {
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
                <Input placeholder="Round name" {...field} />
              </FormControl>
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
