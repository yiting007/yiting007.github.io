/**
 * FILE: src/app/projects/mario/page.tsx
 * PURPOSE: Project page for Mario endless platformer game
 */
import MarioGame from '@/components/MarioGame';
import Navbar from '@/components/Navbar';

export default function MarioPage() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans pb-12">
            <div className="container mx-auto px-4">
                <Navbar />
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center">Endless Mario Platformer</h1>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-semibold mb-4">About</h2>
                        <p className="text-gray-700 mb-4">
                            A procedurally-generated endless platformer inspired by Super Mario Bros.
                            Jump across platforms, avoid falling, and survive as long as you can!
                        </p>

                        <h3 className="font-semibold mb-2">Features:</h3>
                        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
                            <li>Infinite procedurally-generated levels</li>
                            <li>Smooth platforming controls (walk, run, jump)</li>
                            <li>Physics-based movement with gravity</li>
                            <li>Score tracking based on distance traveled</li>
                            <li>Simple retro-style graphics</li>
                        </ul>

                        <h3 className="font-semibold mb-2">Controls:</h3>
                        <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                            <li><strong>Arrow Keys</strong> or <strong>WASD</strong>: Move left/right</li>
                            <li><strong>Spacebar</strong>: Jump</li>
                            <li><strong>Shift</strong>: Run faster</li>
                        </ul>

                        <MarioGame />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Tech Stack:</h3>
                        <p className="text-gray-700 text-sm">
                            Built with <strong>TypeScript</strong>, <strong>React</strong>, and <strong>HTML5 Canvas</strong>.
                            Features a custom physics engine with collision detection and procedural level generation.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
