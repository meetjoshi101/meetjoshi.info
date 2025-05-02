/// <reference types="astro/client" />
declare module 'astro:content' {
    interface Render {
        '.md': Promise<{
            Content: import('astro').MarkdownInstance<{}>['Content'];
            headings: import('astro').MarkdownHeading[];
            remarkPluginFrontmatter: Record<string, any>;
        }>;
    }
}

declare module 'astro:content' {
    type Schema = import('./content/config').collections;
}