import GameOfLifeComponent from '@/components/GameOfLife';
import Navbar from '@/components/Navbar';

export default function GameOfLife() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans pb-12">
            <div className="container mx-auto px-4">
                <Navbar />
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center">Conway's Game of Life</h1>

                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h3 className="text-xl font-semibold mb-4">Rules</h3>
                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                            <li>Any live cell with fewer than two live neighbours dies, as if caused by under-population.</li>
                            <li>Any live cell with two or three live neighbours lives on to the next generation.</li>
                            <li>Any live cell with more than three live neighbours dies, as if by overcrowding.</li>
                            <li>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</li>
                        </ol>
                    </div>

                    <GameOfLifeComponent />
                </div>
            </div>
        </main>
    );
}
