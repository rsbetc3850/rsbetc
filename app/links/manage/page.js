'use client';
import { useState, useEffect } from 'react'
import { HiPencilAlt, HiTrash } from 'react-icons/hi'

const ManageLinksPage = () => {
  const [links, setLinks] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
  })

  const [editing, setEditing] = useState(false)
  const [editedLink, setEditedLink] = useState(null)

  useEffect(() => {
    const fetchLinks = async () => {
      const res = await fetch('/api/links')
      const data = await res.json()
      setLinks(data)
    }

    fetchLinks()
  }, [])

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleAddLink = async (event) => {
    event.preventDefault()

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const newLink = await res.json()
      setLinks([...links, newLink])
      setFormData({
        title: '',
        url: '',
        description: '',
        category: '',
      })
    } catch (error) {
      console.error('An error occurred while creating the link:', error)
    }
  }

  const handleEditLink = (link) => {
    setEditing(true)
    setEditedLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description,
      category: link.category,
    })
  }

  const handleUpdateLink = async (event) => {
    event.preventDefault()

    try {
      const res = await fetch('/api/links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editedLink, ...formData }),
      })

      const updatedLink = await res.json()
      setLinks(links.map((link) => (link.id === updatedLink.id ? updatedLink : link)))
      setEditing(false)
      setFormData({
        title: '',
        url: '',
        description: '',
        category: '',
      })
    } catch (error) {
      console.error('An error occurred while updating the link:', error)
    }
  }

  const handleDeleteLink = async (linkId) => {
    try {
      const res = await fetch('/api/links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: linkId }),
      })

      const deletedLink = await res.json()
      setLinks(links.filter((link) => link.id !== deletedLink.id))
    } catch (error) {
      console.error('An error occurred while deleting the link:', error)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-5/6">
        <form onSubmit={!editing ? handleAddLink : handleUpdateLink}>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="title">
              Title
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="url">
              URL
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2" htmlFor="category">
              Category
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>
          <button className="px-4 py-2 bg-blue-500 text-zinc-900 rounded">
            {editing ? 'Update Link' : 'Add Link'}
          </button>
        </form>
        <table className="w-full text-left mt-10">
          <thead>
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Category</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
                  <div className="flex items-center">
                    <span className="mr-2">{link.title}</span>
                    <span className="hidden md:block ml-2 text-gray-500">{link.url}</span>
                  </div>
                </td>
                <td className="border px-4 py-2">{link.category}</td>
                <td className="border px-4 py-2 flex justify-center">
                  <button
                    onClick={() => handleEditLink(link)}
                    className="mr-2 text-blue-500 hover:text-blue-700"
                  >
                    <HiPencilAlt className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageLinksPage
