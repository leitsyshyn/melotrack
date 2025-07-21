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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trackInsertSchema } from "@/lib/schemas";
import { TrackInsertType } from "@/lib/types";
import { useCreateTrack, useUpdateTrack } from "@/mutations/tracks";

type TrackFormProps = Partial<Omit<TrackInsertType, "roundId">> &
  Pick<TrackInsertType, "roundId"> & {
    gameId: string;
    onSuccess?: () => void;
  };

export function TrackForm(props: TrackFormProps) {
  const form = useForm<TrackInsertType>({
    resolver: zodResolver(trackInsertSchema),
    defaultValues: {
      url: "",
      title: "",
      start: 0,
      end: 0,
      ...props,
    },
  });

  const createTrackMutation = useCreateTrack(props.gameId, props.roundId);
  const updateTrackMutation = useUpdateTrack(
    props.gameId,
    props.roundId,
    props.id ?? "",
  );

  const onSubmit = (values: TrackInsertType) => {
    if (props.id) {
      updateTrackMutation.mutate(values, {
        onSuccess: () => {
          form.reset();
          props.onSuccess?.();
        },
      });
    } else if (props.roundId) {
      createTrackMutation.mutate(values, {
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
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Start (s)"
                    step="1"
                    {...field}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="number"
                    placeholder="End (s)"
                    step="1"
                    {...field}
                    value={field.value ?? 0}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
