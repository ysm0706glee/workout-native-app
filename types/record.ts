import { z } from "zod";

export const recordSchema = z.object({
  sets: z.number().min(1),
  reps: z.number().min(1),
  weight: z.number().min(0),
});

export const recordsSchema = z.record(
  z.number(),
  z.object({
    memo: z.string().optional(),
    records: z.array(recordSchema),
  })
);

export type Record = z.infer<typeof recordSchema>;

export type Records = z.infer<typeof recordsSchema>;
