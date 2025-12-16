import type { Metadata } from 'next';
import { getSettings } from '@/lib/get-settings';

export const metadata: Metadata = {
  title: 'الشروط والأحكام | طمانينة - التوعية بسرطان الثدي',
  description: 'الشروط والأحكام لاستخدام تطبيق وموقع طمانينة للتوعية بسرطان الثدي.',
};

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">الشروط والأحكام</h1>
      
      <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 whitespace-pre-wrap">
        {settings?.terms_conditions_ar ? (
          <p>{settings.terms_conditions_ar}</p>
        ) : (
          <p>جاري تحديث الشروط والأحكام...</p>
        )}
      </div>
    </div>
  );
}
