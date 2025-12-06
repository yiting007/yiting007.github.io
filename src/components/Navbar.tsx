import Link from 'next/link';
import { FaHome, FaGithubSquare, FaLinkedin, FaInstagram, FaSmile } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="flex flex-col items-center py-8 space-y-6">
            <div className="text-center">
                <Link href="/" className="flex items-center justify-center space-x-2 text-gray-800 hover:text-blue-600 transition-colors">
                    <FaSmile className="text-2xl" />
                    <span className="text-2xl font-bold">Yiting's Blog</span>
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
                <a href="https://www.instagram.com/netbeans007/?hl=en" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 transition-colors">
                    <FaInstagram className="text-3xl" />
                </a>
            </div>
        </nav>
    );
};

export default Navbar;
