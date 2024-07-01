import * as z from "zod";

export const galleryIdSchema = z.object({
  id: z.number().optional(),
});

export const gallerySchema = z
  .object({
    name: z.string(),
    description: z.string(),
    image: z.string().optional(),
  })
  .merge(galleryIdSchema);

export type IGallery = z.infer<typeof gallerySchema>;
