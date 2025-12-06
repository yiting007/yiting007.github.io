/**
 * FILE: src/components/ProjectCard.tsx
 * PURPOSE: Reusable component for displaying project summaries. Handles internal vs. external link logic, image rendering, and click tracking.
 * OPTIMIZATION:
 *  - Uses `next/image` for automatic image optimization (resizing, lazy loading, format conversion).
 *  - `fill` prop allows the image to be responsive within its container.
 *  - Tracks clicks via Google Analytics when available.
 */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/data/projects';

interface ProjectCardProps {
    project: Project;
}

// Declare gtag type for TypeScript
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}

const ProjectCard = ({ project }: ProjectCardProps) => {
    const isExternal = project.url.startsWith('http');

    const handleClick = () => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'project_click', {
                event_category: 'engagement',
                event_label: project.name,
                project_id: project.id,
                project_type: project.pageType,
            });
        }
    };

    const CardContent = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <div className="relative h-48 w-full">
                <Image
                    src={project.src}
                    alt={project.name}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm">{project.description}</p>
            </div>
        </div>
    );

    if (isExternal) {
        return (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="block h-full" onClick={handleClick}>
                <CardContent />
            </a>
        );
    }

    return (
        <Link href={project.url} className="block h-full" onClick={handleClick}>
            <CardContent />
        </Link>
    );
};

export default ProjectCard;
