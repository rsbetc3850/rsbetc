// app/api/headlines/route.js


export const revalidate = 0; // Disable static rendering

export async function GET(req) {
    // const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=7f3f3427bf3e4b069deac06a40fe9609&category=technology');
    const response = await fetch('https://newsapi.org/v2/top-headlines?sources=associated-press&apiKey=7f3f3427bf3e4b069deac06a40fe9609');
    const data = await response.json();

    const titles = data.articles.map(article => `  ${article.title}  `).join('###');

    return new Response(titles, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
