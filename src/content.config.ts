import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shows collection removed - data comes from Firebase

const videos = defineCollection({
  loader: glob({ pattern: "*.yaml" , base: "src/data/videos" }),
  schema: z.object({
    id: z.string(),
    texto: z.string(),
    url: z.string().url(),
  }),
});

export const collections = { videos };
