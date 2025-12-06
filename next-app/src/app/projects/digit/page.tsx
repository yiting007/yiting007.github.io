import Navbar from '@/components/Navbar';
import Image from 'next/image';

export default function Digit() {
    return (
        <main className="min-h-screen bg-gray-50 font-sans pb-12">
            <div className="container mx-auto px-4">
                <Navbar />
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-6">Digit Recognition</h1>

                    <div className="bg-white p-8 rounded-lg shadow-md mb-8 flex flex-col items-center">
                        <div className="relative h-64 w-64 mb-6">
                            <Image
                                src="/images/digitRec.eda0a436.png"
                                alt="Digit Recognition"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-xl text-gray-600 mb-4">Coming Soon</p>
                        <p className="text-gray-500">This project is currently being migrated or is under construction.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
