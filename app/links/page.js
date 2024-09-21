'use client';
import { useState, useEffect } from 'react'

const LinksPage = () => {
  const [links, setLinks] = useState([])

  useEffect(() => {
    const fetchLinks = async () => {
      const res = await fetch('/api/links')
      const data = await res.json()
      setLinks(data)
    }

    fetchLinks()
  }, [])

  const categories = Array.from(
    new Set(links.flatMap((link) => JSON.parse(link.category)).flat())
  )

  return (
    <div>
      <p>
      Who says the internet has to be all about sleek designs and algorithms? We&apos;re bringing back the retro charm of the early web with our curated links page. Remember when the web was a wild frontier, and exploring links was like stumbling upon hidden treasures? We do, and that&apos;s why we&apos;ve put together a collection of cool, handpicked links for your browsing pleasure. No algorithms, no ads, just pure internet goodness. So take a break from the same old search results and let us guide you to some of the most interesting corners of the web.
      </p>
      {categories.map((category) => (
        <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
          #{category}
        </span>
      ))}
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">URL</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Updated At</th>
            <th className="px-4 py-2">Category</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id}>
              <td className="border px-4 py-2">{link.title}</td>
              <td className="border px-4 py-2">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </td>
              <td className="border px-4 py-2">{link.description}</td>
              <td className="border px-4 py-2">{link.updatedAt}</td>
              <td className="border px-4 py-2">
                {JSON.parse(link.category).map((category) => (
                  <span key={category} className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    #{category}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LinksPage
