import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Bell, BookOpen, Users, Smartphone } from "lucide-react";
import Link from "next/link";
import { getSettings } from "@/lib/get-settings";

export default async function Home() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header removed - using global PublicHeader */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-pink-900 mb-4 sm:mb-6 leading-tight">
            التوعية بسرطان الثدي والكشف المبكر
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
            تطبيق شامل يوفر معلومات موثوقة، تذكيرات ذكية، وإرشادات للفحص الذاتي
            للمساعدة في الكشف المبكر عن سرطان الثدي
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto">
              <Smartphone className="ml-2 h-5 w-5" />
              تحميل التطبيق
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/self-exam">
                <BookOpen className="ml-2 h-5 w-5" />
                معرفة المزيد
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <h3 className="text-2xl sm:text-3xl font-bold text-center text-pink-900 mb-8 sm:mb-12">
          ميزات التطبيق
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>مقالات توعوية</CardTitle>
              <CardDescription>
                محتوى تعليمي شامل حول سرطان الثدي، الوقاية، والعلاج
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>تذكيرات ذكية</CardTitle>
              <CardDescription>
                إشعارات تلقائية لمواعيد الفحص الدوري والفحص الذاتي
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>إرشادات الفحص الذاتي</CardTitle>
              <CardDescription>
                خطوات مفصلة بالصور والفيديو لإجراء الفحص الذاتي بشكل صحيح
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>العلامات التحذيرية</CardTitle>
              <CardDescription>
                معلومات عن العلامات الطبيعية والتي تستدعي استشارة الطبيب
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>جداول الكشف المبكر</CardTitle>
              <CardDescription>
                توصيات مخصصة حسب العمر والجنس لمواعيد الفحوصات الطبية
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-pink-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-pink-600" />
              </div>
              <CardTitle>سهل الاستخدام</CardTitle>
              <CardDescription>
                واجهة بسيطة وسهلة الاستخدام باللغة العربية
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-pink-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-4 sm:mb-6">
              عن المشروع
            </h3>
            <div className="text-base sm:text-lg text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">
              {settings?.about_us_ar ? (
                <p>{settings.about_us_ar}</p>
              ) : (
                <>
                  <p className="mb-4">
                    تطبيق Azhar Breast Awareness هو مبادرة توعوية تهدف إلى نشر الوعي حول
                    سرطان الثدي وأهمية الكشف المبكر. يوفر التطبيق معلومات موثوقة ومحدثة
                    باللغة العربية لمساعدة المستخدمين على فهم المرض والوقاية منه.
                  </p>
                  <p>
                    تم تطوير التطبيق بالتعاون مع خبراء طبيين لضمان دقة المعلومات المقدمة
                    وملاءمتها للمجتمع العربي.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-pink-900 mb-4 sm:mb-6">
            حمّل التطبيق الآن
          </h3>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            متوفر مجاناً على متجر التطبيقات
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button size="lg" className="bg-black hover:bg-gray-800">
              <svg className="ml-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <svg className="ml-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Google Play
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
