"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createTrack } from "@/actions/tracks";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trackInsertSchema } from "@/lib/schemas";
import { TrackInsertType } from "@/lib/types";

type CreateTrackFormProps = Partial<Omit<TrackInsertType, "roundId">> &
  Pick<TrackInsertType, "roundId">;

export function CreateTrackForm(track: CreateTrackFormProps) {
  const form = useForm<TrackInsertType>({
    resolver: zodResolver(trackInsertSchema),
    defaultValues: {
      url: "",
      title: "",
      artist: "",
      start: 0,
      end: 0,
      ...track,
    },
  });

  const onSubmit = (values: TrackInsertType) => {
    createTrack(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Track URL" {...field} />
              </FormControl>
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="artist"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Artist"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="start"
            render={({ field }) => (
              <FormItem>
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
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem>
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
              </FormItem>
            )}
          />
        </div>
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
