import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SelfExamStep } from '@/types';
import { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Video } from 'lucide-react';

export const metadata: Metadata = {
  title: 'خطوات الفحص الذاتي | Azhar Breast Awareness',
  description: 'تعلمي كيفية إجراء الفحص الذاتي للثدي خطوة بخطوة بالصور والفيديو.',
};

async function getSteps() {
  try {
    const q = query(collection(db, 'self_exam_steps'), orderBy('step_number', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SelfExamStep[];
  } catch (error) {
    console.error('Error fetching steps:', error);
    return [];
  }
}

export default async function SelfExamStepsPage() {
  const steps = await getSteps();

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">خطوات الفحص الذاتي</h1>
        <p className="text-lg text-gray-600">
          يجب إجراء الفحص الذاتي مرة واحدة شهرياً، ويفضل أن يكون ذلك بعد انتهاء الدورة الشهرية بأسبوع.
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-6 md:gap-10 pb-12 last:pb-0">
            {/* Timeline Line */}
            {index !== steps.length - 1 && (
              <div className="absolute top-12 right-[2.25rem] md:right-[3rem] bottom-0 w-1 bg-pink-100 -z-10" />
            )}

            {/* Step Number */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xl md:text-2xl shadow-lg ring-4 ring-pink-100">
                {step.step_number}
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow">
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title_ar}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{step.description_ar}</p>
                  </div>

                  {/* Media */}
                  {(step.image_url || step.video_url) && (
                    <div className="bg-gray-50 border-t p-4 md:p-6 flex flex-col items-center">
                      {step.video_url ? (
                        <video 
                          controls 
                          className="w-full max-h-[400px] object-contain rounded-lg shadow-sm"
                          poster={step.image_url} 
                        >
                          <source src={step.video_url} type="video/mp4" />
                          متصفحك لا يدعم الفيديو.
                        </video>
                      ) : step.image_url ? (
                        <img 
                          src={step.image_url} 
                          alt={step.title_ar}
                          className="w-full max-h-[400px] object-contain rounded-lg shadow-sm bg-white"
                        />
                      ) : null}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
