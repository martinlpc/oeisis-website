import { defineCollection, z } from 'astro:content';

const showsCollection = defineCollection({
    type: "data", 
    schema: z.object({
      shows: z.array(
        z.object({
          ciudad: z.string(),
          lugar: z.string(),
          fecha: z.string(),
          linkCompra: z.string().optional(),
        })
      ),
    }),
  });

export const collections = {
    shows: showsCollection
};