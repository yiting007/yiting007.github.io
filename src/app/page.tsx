/**
 * FILE: src/app/page.tsx
 * PURPOSE: The main landing page of the portfolio. Displays the hero section and the grid of project cards.
 * OPTIMIZATION:
 *  - Implement lazy loading for ProjectCard components if the list grows large.
 *  - Use `generateStaticParams` if this page were dynamic, but it's static by default.
 */
import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export default function Home() {
  const modernProjects = projects.filter(p => p.era === 'modern');
  const classicProjects = projects.filter(p => p.era === 'classic');

  return (
    <main className="min-h-screen bg-gray-50 font-sans pb-12">
      <div className="container mx-auto px-4">
        <Navbar />

        {/* Modern Projects Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modernProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative bg-gray-50 px-4 text-sm text-gray-500 uppercase tracking-widest font-semibold">
            Before Gen AI was a thing...
          </div>
        </div>

        {/* Classic Projects Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classicProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
