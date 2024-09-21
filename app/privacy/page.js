import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';

export default async function Terms() {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'app', 'privacy', 'privacy.md');
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Compile the markdown to HTML
    const { content } = await compileMDX({
        source: fileContent,
        options: { parseFrontmatter: true }
    });

    return (
        <div className={`p-1 relative z-10 overflow-y-auto`}>
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 flex justify-end">
                    <h2 className="flex items-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]
   w-full p-6 m-4 md:m-2 md:p-6 mx-auto md:mx-0 md:w-10/12 text-5xl italic font-black text-left text-amber-200 uppercase">
                        Privacy
                    </h2>
                </div>
                <div className="w-full md:w-3/5 p-6 pl-8 m-4 md:m-2 mx-auto md:mx-0 md:w-10/12">
                    <p className="italic font-bold m-6 p-6 text-2xl text-right text-zinc-100 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Privacy Policies
                    </p>
                </div>
            </div>
            <div className="markdown-content leading-loose md:m-6 md:p-6 md:my-4 md:py-2 m-2 p-2 text-xl text-left text-yellow-100 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                {content}
            </div>
        </div>
    );
}