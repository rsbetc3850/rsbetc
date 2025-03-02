'use client';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { siteLinks } from '../data/config';
import { 
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Navmenu = () => {
  return (
    <div className="lg:hidden z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-zinc-200 hover:text-white hover:bg-red-700"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="bg-zinc-900 bg-opacity-95 backdrop-blur-md border-zinc-700 rounded-t-xl w-full max-w-md mx-auto inset-x-0"
        >
          <SheetHeader>
            <SheetTitle className="text-zinc-100 text-center">Navigation</SheetTitle>
          </SheetHeader>
          <nav className="mt-6">
            <ul className="grid grid-cols-2 gap-3 place-items-center">
              {siteLinks.map((link, index) => (
                <li key={index} className="w-full max-w-[150px]">
                  <SheetClose asChild>
                    <Link 
                      href={link.href}
                      className="text-lg font-semibold text-zinc-200 bg-red-700 hover:bg-red-800 rounded block p-3 text-center transition-colors"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navmenu;
