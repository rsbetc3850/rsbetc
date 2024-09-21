import Image from 'next/image';
import Link from 'next/link';
import Navbar from './navbar';
import Navmenu from './navmenu';

const Logo = () => {
    return (
        <Image
            src="/rslogo.png" // replace with your logo path
            alt="abstract logo"
            width={50} // set your desired width
            height={50} // set your desired height
            className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
        />
    );
};

export default function Header({ font, slug }) {
    return (
        <div className="bg-zinc-900 bg-opacity-50 flex flex-col relative z-50 mb-2">
            <div className="flex items-center justify-between p-1">
                <Link href="/" className="pl-2 flex items-center">
                    <Logo />
                    <h1 className={`drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] ml-5 text-4xl md:text-xl text-white drop-shadow-lg font-black ${font}`}>{slug}</h1>
                </Link>
                <Navmenu />
                <Navbar />
            </div>

        </div>
    );
}
