import { z } from "zod";

export const DocumentUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const DocumentSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string(),
  attachments: z.array(z.string()),
  contributors: z.array(DocumentUserSchema),
  version: z.string(),
});

export const DocumentsSchema = z.array(DocumentSchema);

export type DocumentUser = z.infer<typeof DocumentUserSchema>;
export type Document = z.infer<typeof DocumentSchema>;
