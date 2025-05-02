import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishDate: z.date(),
        author: z.string(),
        image: z.string().optional(),
        tags: z.array(z.string()),
    }),
});

const projectCollection = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        publishDate: z.date(),
        technologies: z.array(z.string()),
        image: z.string().optional(),
        github: z.string().url().optional(),
        liveUrl: z.string().url().optional(),
    }),
});

export const collections = {
    'blogs': blogCollection,
    'projects': projectCollection,
};