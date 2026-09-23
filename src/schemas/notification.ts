import { z } from "zod";

export const NotificationSchema = z.object({
  timestamp: z.string(),
  userId: z.string(),
  userName: z.string(),
  documentId: z.string(),
  documentTitle: z.string(),
});

export type Notification = z.infer<typeof NotificationSchema>;
