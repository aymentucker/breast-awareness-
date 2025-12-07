import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, CalendarClock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الفحص الذاتي والكشف المبكر | Azhar Breast Awareness',
  description: 'تعرفي على أهمية الفحص الذاتي، خطواته، جداول الكشف المبكر، والعلامات التحذيرية.',
};

export default function SelfExamLandingPage() {
  const sections = [
    {
      title: 'خطوات الفحص الذاتي',
      description: 'دليل مصور خطوة بخطوة لكيفية إجراء الفحص الذاتي للثدي بشكل صحيح.',
      icon: ClipboardList,
      href: '/self-exam/steps',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'مواعيد الكشف المبكر',
      description: 'تعرفي على جداول الكشف الدوري المناسبة لعمرك والتوصيات الطبية.',
      icon: CalendarClock,
      href: '/self-exam/screening',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'العلامات التحذيرية',
      description: 'تعلمي التمييز بين التغيرات الطبيعية والعلامات التي تستدعي استشارة الطبيب.',
      icon: AlertTriangle,
      href: '/self-exam/warnings',
      color: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-pink-600 mb-6">الكشف المبكر حياة</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          يعتبر الكشف المبكر عن سرطان الثدي حجر الزاوية في زيادة فرص الشفاء التام.
          نقدم لك هنا دليلاً شاملاً يساعدك في الحفاظ على صحتك.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sections.map((section) => (
          <Card key={section.href} className="hover:shadow-xl transition-shadow border-t-4 border-t-pink-500">
            <CardHeader className="text-center pb-2">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${section.color}`}>
                <section.icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl mb-2">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6 min-h-[80px]">{section.description}</p>
              <Button asChild className="w-full group">
                <Link href={section.href}>
                  التفاصيل
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
