import type { Metadata } from 'next';
import { getSettings } from '@/lib/get-settings';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | Azhar Breast Awareness',
  description: 'سياسة الخصوصية وكيفية تعاملنا مع بيانات المستخدمين في تطبيق أزهر للتوعية بسرطان الثدي.',
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">سياسة الخصوصية</h1>
      
      <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 whitespace-pre-wrap">
        {settings?.privacy_policy_ar ? (
          <p>{settings.privacy_policy_ar}</p>
        ) : (
          <p>جاري تحديث سياسة الخصوصية...</p>
        )}
      </div>
    </div>
  );
}
