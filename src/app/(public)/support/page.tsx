import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'الدعم والاتصال | طمانينة - التوعية بسرطان الثدي',
  description: 'تواصل معنا للحصول على الدعم والمساعدة في استخدام تطبيق طمانينة للتوعية بسرطان الثدي.',
};

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
      <h1 className="text-4xl font-bold mb-4 text-pink-600">الدعم والاتصال</h1>
      <p className="text-lg text-gray-600 mb-12">
        نحن هنا لمساعدتك! إذا كان لديك أي أسئلة أو تحتاج إلى دعم، يرجى التواصل معنا.
      </p>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card className="border-pink-200">
          <CardHeader>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-pink-600" />
            </div>
            <CardTitle>البريد الإلكتروني</CardTitle>
            <CardDescription>أرسل لنا بريداً إلكترونياً وسنرد عليك في أقرب وقت</CardDescription>
          </CardHeader>
          <CardContent>
            <a 
              href="mailto:sheildlab@gmail.com" 
              className="text-pink-600 hover:text-pink-700 font-medium break-all"
            >
              sheildlab@gmail.com
            </a>
          </CardContent>
        </Card>

        <Card className="border-pink-200">
          <CardHeader>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-pink-600" />
            </div>
            <CardTitle>العنوان</CardTitle>
            <CardDescription>موقعنا الجغرافي</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">القاهرة، مصر</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-12 border-pink-200">
        <CardHeader>
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-pink-600" />
          </div>
          <CardTitle>أوقات الاستجابة</CardTitle>
          <CardDescription>نحن نعمل على الرد على استفساراتك في أقرب وقت ممكن</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-gray-700">
            <p>نحاول الرد على جميع الاستفسارات خلال 24-48 ساعة</p>
            <p>للاستفسارات العاجلة، يرجى استخدام البريد الإلكتروني مع وضع &quot;عاجل&quot; في عنوان الرسالة</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-12 border-pink-200">
        <CardHeader>
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
            <MessageSquare className="h-6 w-6 text-pink-600" />
          </div>
          <CardTitle>كيف يمكننا مساعدتك؟</CardTitle>
          <CardDescription>نقدم الدعم في المجالات التالية</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">الدعم الفني</h3>
              <p className="text-gray-700">
                إذا واجهت أي مشاكل تقنية في استخدام التطبيق، أو لديك أسئلة حول الميزات والوظائف
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">الاستفسارات العامة</h3>
              <p className="text-gray-700">
                أسئلة حول التطبيق، الميزات الجديدة، أو أي معلومات عامة
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">الاقتراحات والملاحظات</h3>
              <p className="text-gray-700">
                نرحب بآرائك واقتراحاتك لتحسين التطبيق وتجربة المستخدم
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">مشاكل الحساب</h3>
              <p className="text-gray-700">
                إذا واجهت مشاكل في تسجيل الدخول، استعادة كلمة المرور، أو إدارة حسابك
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-pink-200">
        <CardHeader>
          <CardTitle>أسئلة شائعة</CardTitle>
          <CardDescription>إجابات على الأسئلة الأكثر شيوعاً</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">كيف يمكنني إعادة تعيين كلمة المرور؟</h3>
              <p className="text-gray-700">
                يمكنك استخدام ميزة &quot;نسيت كلمة المرور&quot; في صفحة تسجيل الدخول. إذا واجهت مشاكل، يرجى التواصل معنا.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">كيف يمكنني حذف حسابي؟</h3>
              <p className="text-gray-700">
                يمكنك حذف حسابك من إعدادات التطبيق. إذا كنت بحاجة إلى مساعدة، يرجى التواصل معنا.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">هل بياناتي آمنة؟</h3>
              <p className="text-gray-700">
                نعم، نحن نستخدم تقنيات تشفير متقدمة لحماية بياناتك. يمكنك قراءة المزيد في{' '}
                <Link href="/privacy" className="text-pink-600 hover:text-pink-700 underline">
                  سياسة الخصوصية
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">كيف يمكنني الإبلاغ عن خطأ في التطبيق؟</h3>
              <p className="text-gray-700">
                يرجى إرسال بريد إلكتروني إلينا مع وصف تفصيلي للمشكلة، ونوع الجهاز، وإصدار التطبيق.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 p-6 bg-pink-50 rounded-lg border border-pink-200">
        <h2 className="text-2xl font-bold text-pink-900 mb-4">لم تجد ما تبحث عنه؟</h2>
        <p className="text-gray-700 mb-4">
          لا تتردد في التواصل معنا مباشرة. فريقنا جاهز لمساعدتك في أي وقت.
        </p>
        <a 
          href="mailto:sheildlab@gmail.com?subject=استفسار عن تطبيق طمانينة"
          className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
        >
          إرسال بريد إلكتروني
        </a>
      </div>
    </div>
  );
}

