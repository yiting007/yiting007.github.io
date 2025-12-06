/**
 * FILE: src/app/projects/2048/page.tsx
 * PURPOSE: Dedicated page for the 2048 game project. Wraps the Game2048 component.
 * OPTIMIZATION:
 *  - Uses `client` component for the game logic while keeping the page wrapper server-side (mostly).
 */
import Game2048 from '@/components/Game2048';
import Navbar from '@/components/Navbar';

export default function Page2048() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans pb-12">
            <div className="container mx-auto px-4">
                <Navbar />
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center">2048</h1>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <p className="text-gray-700 mb-4 text-center">
                            Join the numbers and get to the <strong>2048 tile!</strong>
                        </p>
                        <Game2048 />
                    </div>
                </div>
            </div>
        </main>
    );
}
