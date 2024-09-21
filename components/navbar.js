import Link from 'next/link';
import { siteLinks } from '../data/config';
//import './globals.css';

const Navbar = () => {
    return (
        <div className="hidden lg:block border-zinc-700">
            <ul className="flex space-x-4 justify-end mr-4">
                {siteLinks.map((link, index) => (
                    <li key={index} className="nav-link">
                        <Link href={link.href}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Navbar;
