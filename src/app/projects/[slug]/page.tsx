import { getPostBySlug, getAllPosts } from '@/lib/markdown';
import Navbar from '@/components/Navbar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeRaw from 'rehype-raw';
/**
 * FILE: src/app/projects/[slug]/page.tsx
 * PURPOSE: Dynamic route handler for Markdown-based project pages. Renders content using react-markdown with GFM and raw HTML support.
 * OPTIMIZATION:
 *  - `generateStaticParams` ensures these pages are statically generated at build time (SSG) for performance.
 *  - Images are optimized using `next/image` via a custom renderer.
 */
import fs from 'fs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';
import { FaCodeFork } from 'react-icons/fa6';

export async function generateStaticParams() {
    const posts = getAllPosts(['slug']);

    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug, ['title', 'date', 'slug', 'author', 'content', 'ogImage', 'coverImage', 'github']);

    return (
        <main className="min-h-screen bg-gray-50 font-sans pb-12">
            <div className="container mx-auto px-4">
                <Navbar />
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-4">
                        {post.title}
                        {post.github && (
                            <a href={post.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                                <FaCodeFork />
                            </a>
                        )}
                    </h1>

                    <div className={`bg-white p-8 rounded-lg shadow-md mb-8 prose prose-lg max-w-none ${slug === 'single-div-css' ? 'text-center' : ''}`}>
                        <ReactMarkdown
                            rehypePlugins={[rehypeRaw]}
                            remarkPlugins={[remarkGfm, remarkUnwrapImages]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                                img: (image: any) => {
                                    // If width and height are provided, render as inline-block with specific dimensions
                                    if (image.width && image.height) {
                                        return (
                                            <Image
                                                src={image.src || ''}
                                                alt={image.alt || ''}
                                                width={parseInt(image.width)}
                                                height={parseInt(image.height)}
                                                className="inline-block m-1 rounded-lg"
                                                style={{ maxWidth: '100%', height: 'auto' }}
                                            />
                                        );
                                    }

                                    // Default behavior for standard markdown images (full width container)
                                    return (
                                        <div className="relative w-full h-64 my-4">
                                            <Image
                                                src={image.src || ''}
                                                alt={image.alt || ''}
                                                fill
                                                className="object-contain rounded-lg"
                                            />
                                        </div>
                                    );
                                }
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </main>
    );
}
