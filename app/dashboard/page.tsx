'use client';
import Navbar from '../components/Navbar';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/config';
import { getTechHeadlines } from '@/api'; // Import the function to fetch tech headlines

const HomePage = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [techNews, setTechNews] = useState([]); // State to store tech news
  const [newsLoading, setNewsLoading] = useState(true); // State for news loading

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/');
    } else {
      const fetchData = async () => {
        const docRef = doc(db, 'users', user.uid);

        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const fullName = docSnap.data().fullName;
            const firstName = fullName.split(' ')[0];
            setFirstName(firstName);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user, loading, router]);

  // Fetch tech news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await getTechHeadlines(); // Call API function
        setTechNews(news);
      } catch (error) {
        console.error('Error fetching tech news:', error);
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen text-white">
      <Navbar />
  
      {/* Hero Section */}
      <section className="text-center p-16">
        <h1 className="text-5xl font-bold">Welcome, {firstName}!</h1>
        <p className="text-lg mb-6">This is your dashboard for collaborative project development.</p>
      </section>
  
      {/* Tech News Section */}
      <section className="p-8">
        <h2 className="text-3xl font-bold mb-4">Latest Tech News</h2>
        {newsLoading ? (
          <p>Loading news...</p>
        ) : (
          <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-700">
            {techNews.length > 0 ? (
              techNews.map((news, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-lg h- w-80   flex-shrink-0">
                  <img
                    src={news.urlToImage || '/default-news-image.jpg'}
                    alt={news.title}
                    className="rounded-lg mb-2 object-cover h-32 w-full" // Increased image height
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">
                      {news.title.length > 50 ? `${news.title.slice(0, 30)}...` : news.title}
                    </h3>
                    <p className="text-gray-400 mb-2 text-sm"> {/* Decreased text size */}
                      {news.description && news.description.length > 60
                        ? `${news.description.slice(0, 60)}...`
                        : news.description}
                    </p>
                    <a href={news.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                      Read more
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p>No news available at the moment.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
  
};

export default HomePage;
