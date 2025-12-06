/**
 * FILE: src/components/Navbar.tsx
 * PURPOSE: Global navigation bar component. Provides links to the home page and external social profiles.
 * OPTIMIZATION:
 *  - Uses `next/link` for client-side transitions to internal pages.
 *  - External links use `rel="noopener noreferrer"` for security.
 */
import Link from 'next/link';
import { FaHome, FaGithubSquare, FaLinkedin, FaSmile } from 'react-icons/fa';
import { SiRedbubble } from 'react-icons/si';

const Navbar = () => {
    return (
        <nav className="flex flex-col items-center py-8 space-y-6">
            <div className="text-center">
                <Link href="/" className="flex items-center justify-center space-x-2 text-gray-800 hover:text-blue-600 transition-colors">
                    <FaSmile className="text-2xl" />
                    <span className="text-2xl font-bold">Yiting's Dev Lab</span>
                </Link>
            </div>
            <div className="flex space-x-6">
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                    <FaHome className="text-3xl" />
                </Link>
                <a href="https://github.com/yiting007" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <FaGithubSquare className="text-3xl" />
                </a>
                <a href="https://www.linkedin.com/in/yiting-l-91031959/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors">
                    <FaLinkedin className="text-3xl" />
                </a>
                <a href="https://www.redbubble.com/people/yiting007/shop?asc=u" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-red-600 transition-colors">
                    <SiRedbubble className="text-3xl" />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
