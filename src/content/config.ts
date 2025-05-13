import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    publishDate: z.string().transform(str => new Date(str)),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
  })
});

const projectCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string().transform(str => new Date(str)),
    thumbnail: z.string().optional(),
    demoUrl: z.string().optional(),
    repoUrl: z.string().optional(),
    tags: z.array(z.string()).default([]),
    technologies: z.array(z.string()),
    featured: z.boolean().default(false)
  })
});

export const collections = {
  'blog': blogCollection,
  'projects': projectCollection
};