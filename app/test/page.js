'use client';
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>LMYNL - At The Threshold</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full mr-2"></div>
            <span className="text-2xl font-bold text-yellow-400">LMYNL</span>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              {['home', 'services', 'about', 'contact', 'blog'].map((item) => (
                <li key={item}>
                  <Link href={`/${item}`} className="hover:text-yellow-400">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button 
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="md:hidden bg-gray-800 p-4">
          <ul className="space-y-2">
            {['home', 'services', 'about', 'contact', 'blog'].map((item) => (
              <li key={item}>
                <Link href={`/${item}`} className="block hover:text-yellow-400">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-4">AT THE THRESHOLD</h1>
        <p className="text-lg md:text-xl mb-8">Realize your vision with LMYNL</p>

        <div className="space-y-6">
          <p className="text-sm md:text-base">
            <span className="text-yellow-400">Liminality</span> refers to the quality of being in a transitional or transformative state, between what was and what will be. At <span className="text-yellow-400">LMYNL</span>, we believe that this concept has a powerful resonance with the world of software development and technology solutions. Just as <span className="text-yellow-400">liminal</span> spaces can be places of creativity, experimentation, and growth, so too can the process of building new software or implementing new technologies be a transformative experience for businesses and individuals alike.
          </p>
          <p className="text-sm md:text-base">
            In the world of technology, change is constant and rapid. Companies that are able to adapt and evolve quickly are better positioned to succeed in this dynamic landscape. At <span className="text-yellow-400">LMYNL</span>, we embrace the liminality of technology, helping our clients navigate the ever-shifting landscape of software development and digital transformation. We specialize in building custom solutions that are tailored to each client&apos;s unique needs, leveraging the latest tools and techniques to create innovative and effective solutions.
          </p>
          <p className="text-sm md:text-base">
            But <span className="text-yellow-400">liminality</span> is not just about change for its own sake. It is also about the potential for growth and transformation that arises in times of transition. At <span className="text-yellow-400">LMYNL</span>, we believe that technology has the power to unlock new possibilities and create new opportunities for our clients. Whether it&apos;s streamlining operations, improving customer experiences, or opening up new markets, we work closely with our clients to identify areas where technology can drive meaningful change and growth. By embracing the liminality of technology, we help our clients achieve their full potential and thrive in an ever-changing world.
          </p>
        </div>
      </main>

      <footer className="bg-gray-800 p-4 mt-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <p className="font-bold text-sm md:text-base">We stand at the threshold ready to achieve your vision.</p>
            <p className="text-sm md:text-base">LMYNL is a boutique technology solutions provider.</p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="font-bold mb-2 text-sm md:text-base">Sitemap</h3>
              <ul className="space-y-1 text-sm">
                {['home', 'services', 'about', 'contact'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item}`} className="hover:text-yellow-400">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-sm md:text-base">Policies</h3>
              <ul className="space-y-1 text-sm">
                {['terms', 'privacy', 'legal'].map((item) => (
                  <li key={item}>
                    <Link href={`/${item}`} className="hover:text-yellow-400">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}