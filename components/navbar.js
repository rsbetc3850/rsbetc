import Link from 'next/link';
import { siteLinks } from '../data/config';

const Navbar = () => {
  return (
    <div className="hidden lg:block">
      <nav className="flex">
        <ul className="flex space-x-1 items-center justify-end">
          {siteLinks.map((link, index) => (
            <li key={index}>
              <Link 
                href={link.href}
                className="text-zinc-200 bg-red-700 hover:bg-red-800 px-4 py-2 rounded font-semibold block transition-colors text-sm"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
