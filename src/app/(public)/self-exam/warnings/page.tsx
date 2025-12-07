import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { WarningSign } from '@/types';
import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'العلامات التحذيرية | Azhar Breast Awareness',
  description: 'دليل للتمييز بين التغيرات الطبيعية والعلامات التحذيرية للثدي التي تستدعي استشارة الطبيب.',
};

async function getSigns() {
  try {
    const snapshot = await getDocs(collection(db, 'warning_signs'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WarningSign[];
  } catch (error) {
    console.error('Error fetching signs:', error);
    return [];
  }
}

export default async function WarningsPage() {
  const signs = await getSigns();
  const normalSigns = signs.filter(s => s.category === 'normal');
  const abnormalSigns = signs.filter(s => s.category === 'abnormal');

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">العلامات التحذيرية</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          ليس كل تغير في الثدي يعني وجود سرطان. من المهم معرفة الفرق بين التغيرات الطبيعية والعلامات التي تستدعي القلق.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Abnormal Signs Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h2 className="text-3xl font-bold text-red-600">علامات يجب الانتباه لها</h2>
          </div>
          <div className="space-y-6">
            {abnormalSigns.map((sign) => (
              <Card key={sign.id} className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  {sign.image_url && (
                    <img src={sign.image_url} alt={sign.title_ar} className="w-16 h-16 rounded-full object-cover border" />
                  )}
                  <div>
                    <CardTitle className="text-xl">{sign.title_ar}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{sign.description_ar}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Normal Signs Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl font-bold text-green-600">تغيرات طبيعية</h2>
          </div>
          <div className="space-y-6">
            {normalSigns.map((sign) => (
              <Card key={sign.id} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow bg-green-50/30">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                   {sign.image_url && (
                    <img src={sign.image_url} alt={sign.title_ar} className="w-16 h-16 rounded-full object-cover border" />
                  )}
                  <div>
                    <CardTitle className="text-xl">{sign.title_ar}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{sign.description_ar}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
