import Navbar from '@/components/Navbar';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
