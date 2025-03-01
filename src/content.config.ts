import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const shows = defineCollection({
  loader: glob({ pattern: "*.yaml" ,base: "src/data/shows" }),
  schema: z.object({
      id: z.string(),
      ciudad: z.string(),
      lugar: z.string(),
      fecha: z.string(),
      linkCompra: z.string().optional(),
  }),
});


const videos = defineCollection({
  loader: glob({ pattern: "*.yaml" , base: "src/data/videos" }),
  schema: z.object({
    id: z.string(),
    texto: z.string(),
    url: z.string().url(),
  }),
});

export const collections = { shows, videos } ;
