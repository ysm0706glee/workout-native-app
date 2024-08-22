import { z } from "zod";

export const chartSchema = z.record(
  // exercise_id
  z.string(),
  z.array(
    z.object({
      value: z.number(),
      label: z.string(),
    })
  )
);

export type Chart = z.infer<typeof chartSchema>;
