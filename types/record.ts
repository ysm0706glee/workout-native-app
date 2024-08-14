import { z } from "zod";

export const recordForPostSchema = z.object({
  sets: z.number().min(1),
  reps: z.number().min(1),
  weight: z.number().min(0),
});

export type Record = z.infer<typeof recordForPostSchema>;

export const recordsForPostSchema = z.record(
  z.string(),
  z.object({
    memo: z.string().optional(),
    records: z.array(recordForPostSchema),
  })
);

export type RecordsForPost = z.infer<typeof recordsForPostSchema>;

// TODO: refactor
export const recordSchema = recordForPostSchema;

export const formattedCalenderRecordsSchema = z.object({
  menu: z.object({
    id: z.number(),
    name: z.string(),
    memo: z.string().nullable(),
  }),
  records: z.record(
    z.string(),
    z.object({
      memo: z.string().nullable(),
      records: z.array(recordSchema),
    })
  ),
});

export type FormattedCalenderRecords = z.infer<
  typeof formattedCalenderRecordsSchema
>;
