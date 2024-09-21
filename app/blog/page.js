'use client';
import { MDXRemote } from 'next-mdx-remote';
import { useState, useEffect } from 'react';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('/api/posts');
      const data = await res.json();
      const sortedPosts = data.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
      );
      setPosts(sortedPosts);
    }
    fetchPosts();
  }, []);

  const loadMDX = async (source) => {
    const { serialize } = await import('next-mdx-remote/serialize');
    const mdxSource = await serialize(source);
    return mdxSource;
  };

  const handlePostClick = async (post) => {
    const mdxSource = await loadMDX(post.content);
    setCurrentPost({ ...post, source: mdxSource });
  };

  return (
    <div className="page-container">
      <div className="flex-container">
        <div className="page-title-container">
          <h2 className="page-title">Blog</h2>
        </div>
        {currentPost ? (
          <div>
            <button onClick={() => setCurrentPost(null)}>Back</button>
            <button>Forward</button>
            <button>List</button>
            <h3>{currentPost.frontmatter.title}</h3>
            <MDXRemote {...currentPost.source} />
          </div>
        ) : (
          <div className="section-title-container">
            <ul>
              {posts.map((post) => (
                <li key={post.frontmatter.title} onClick={() => handlePostClick(post)}>
                  {post.frontmatter.title}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
