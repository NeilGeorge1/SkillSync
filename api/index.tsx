// api/index.tsx
export const getTechHeadlines = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`, 
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch tech headlines');
      }
      const newsData = await response.json();
      return newsData.articles; // Assuming the articles are under `articles` field
    } catch (error) {
      console.error('Error fetching tech headlines:', error);
      return [];
    }
  };
  