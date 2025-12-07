import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const BASE_URL = 'https://azhar-breast-awareness.web.app'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/login',
    '/privacy',
    '/terms',
    '/articles',
    '/self-exam',
    '/self-exam/steps',
    '/self-exam/screening',
    '/self-exam/warnings',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Add dynamic article routes
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const q = query(collection(db, 'articles'), where('is_published', '==', true));
    const snapshot = await getDocs(q);
    articleRoutes = snapshot.docs.map((doc) => ({
      url: `${BASE_URL}/articles/${doc.id}`,
      lastModified: doc.data().created_at?.toDate() || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
  }

  return [...routes, ...articleRoutes];
}
