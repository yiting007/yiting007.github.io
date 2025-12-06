/**
 * FILE: src/lib/markdown.ts
 * PURPOSE: Utility functions for reading and parsing Markdown files from the file system. Uses `matter` to extract frontmatter metadata.
 * OPTIMIZATION:
 *  - Implement caching (memoization) for file reads to improve performance during development.
 *  - Add error handling for missing files or malformed frontmatter.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

export function getPostSlugs() {
    return fs.readdirSync(contentDirectory);
}

export function getPostBySlug(slug: string, fields: string[] = []) {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    type Items = {
        [key: string]: string;
    };

    const items: Items = {};

    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
        if (field === 'slug') {
            items[field] = realSlug;
        }
        if (field === 'content') {
            items[field] = content;
        }

        if (typeof data[field] !== 'undefined') {
            items[field] = data[field];
        }
    });

    return items;
}

export function getAllPosts(fields: string[] = []) {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    // .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
}
