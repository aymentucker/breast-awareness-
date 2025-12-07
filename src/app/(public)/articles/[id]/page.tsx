import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Article } from '@/types';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Calendar, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';

// Fetch article data
async function getArticle(id: string) {
  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() } as Article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  
  if (!article) {
    return {
      title: 'مقال غير موجود',
    };
  }

  const description = (article.body_ar || '').substring(0, 160) + '...';

  return {
    title: `${article.title_ar} | Azhar Breast Awareness`,
    description: description,
    openGraph: {
      title: article.title_ar,
      description: description,
      images: article.media_url ? [{ url: article.media_url }] : [],
    },
  };
}

export default async function ArticleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-6 hover:bg-transparent pl-0 hover:text-pink-600">
          <Link href="/articles" className="flex items-center gap-2 text-gray-600">
            <ArrowRight className="h-4 w-4" />
            العودة للمقالات
          </Link>
        </Button>
        
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-gray-900">
          {article.title_ar}
        </h1>
      </div>

      {article.media_url && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
          {article.media_type === 'video' ? (
            <video 
              controls 
              className="w-full max-h-[500px] object-contain mx-auto"
              poster="/placeholder-video.jpg"
            >
              <source src={article.media_url} type="video/mp4" />
              متصفحك لا يدعم تشغيل الفيديو.
            </video>
          ) : (
            <img 
              src={article.media_url} 
              alt={article.title_ar}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          )}
        </div>
      )}

      <div className="prose prose-lg max-w-none prose-headings:text-pink-600 prose-p:text-gray-700 prose-img:rounded-xl">
        {(article.body_ar || '').split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      
      <div className="mt-12 pt-8 border-t flex justify-center">
        <Button variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          مشاركة المقال
        </Button>
      </div>
    </article>
  );
}
