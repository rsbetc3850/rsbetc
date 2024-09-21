import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';

const POSTS_DIR = path.join(process.cwd(), 'app/blog/posts');

export async function GET() {
  try {
    const fileNames = fs.readdirSync(POSTS_DIR);
    const posts = await Promise.all(
      fileNames.map(async (fileName) => {
        const filePath = path.join(POSTS_DIR, fileName);
        const source = fs.readFileSync(filePath, 'utf-8');
        const { content, data } = matter(source);
        const mdxSource = await serialize(content);
        return {
          frontmatter: data,
          slug: fileName.replace(/\.mdx?$/, ''),
          source: mdxSource,
        };
      })
    );
    return new Response(JSON.stringify(posts), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred while fetching the posts' }), { status: 500 })
  }
}
