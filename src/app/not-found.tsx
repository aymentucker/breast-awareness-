import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="text-pink-100 mb-8">
        <FileQuestion size={150} />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">الصفحة غير موجودة</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        عذراً، الصفحة التي تبحثين عنها غير موجودة أو تم نقلها.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
          <Link href="/">العودة للرئيسية</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/articles">تصفح المقالات</Link>
        </Button>
      </div>
    </div>
  );
}
