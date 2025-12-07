import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Article } from '@/types';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Video, Image as ImageIcon } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'المقالات التوعوية | Azhar Breast Awareness',
  description: 'مكتبة شاملة من المقالات التوعوية حول صحة الثدي والكشف المبكر والوقاية.',
};

async function getArticles() {
  // Note: Using client SDK in server component is fine for read-only if initialized properly,
  // but preferably use Admin SDK for server components. For simplicity/speed here, we use the existing client SDK setup
  // which works in Next.js server components as long as we don't need auth context.
  // Ideally, move db logic to a comprehensive service.
  
  try {
    const q = query(
      collection(db, 'articles'),
      where('is_published', '==', true)
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Article[];
    // Sort in memory to avoid Firestore composite index requirement
    return docs.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">المقالات التوعوية</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          اكتشفي المزيد عن صحة الثدي، طرق الوقاية، وأهمية الكشف المبكر من خلال مقالاتنا المتخصصة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
            {article.media_url && article.media_type === 'image' && (
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={article.media_url} 
                  alt={article.title_ar}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
            )}
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={article.media_type === 'video' ? "secondary" : "outline"}>
                  {article.media_type === 'video' ? <Video className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                  {article.media_type === 'video' ? 'فيديو' : 'مقال'}
                </Badge>
              </div>
              <CardTitle className="text-xl line-clamp-2 leading-relaxed">
                {article.title_ar}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                {article.body_ar}
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild className="w-full bg-pink-50 text-pink-600 hover:bg-pink-100 border-none shadow-none">
                <Link href={`/articles/${article.id}`}>
                  قراءة المزيد
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد مقالات منشورة حالياً.</p>
        </div>
      )}
    </div>
  );
}
