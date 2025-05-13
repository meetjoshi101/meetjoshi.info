import { z } from 'astro:content';

export const projectSchema = z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    technologies: z.array(z.string()),
    image: z.string().optional(),
    github: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
});

export const blogSchema = z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().optional().default(false),
});

export type Project = z.infer<typeof projectSchema>;
export type Blog = z.infer<typeof blogSchema>;