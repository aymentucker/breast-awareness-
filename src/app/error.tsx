'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="text-red-100 mb-8">
        <AlertOctagon size={150} />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">حدث خطأ ما</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md">
        نعتذر، واجهنا مشكلة غير متوقعة أثناء معالجة طلبك.
      </p>
      <Button 
        onClick={reset}
        size="lg" 
        className="bg-pink-600 hover:bg-pink-700"
      >
        حاول مرة أخرى
      </Button>
    </div>
  );
}
