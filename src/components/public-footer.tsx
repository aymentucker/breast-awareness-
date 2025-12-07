import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getSettings } from '@/lib/get-settings';

export async function PublicFooter() {
  // Try catch is handled in getSettings, returns null on error
  const settings = await getSettings();

  return (
    <footer className="bg-pink-900 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-pink-400" />
              <h4 className="font-bold text-xl">Azhar Breast Awareness</h4>
            </div>
            <p className="text-pink-200 max-w-sm leading-relaxed">
              تطبيق وموقع شامل للتوعية بسرطان الثدي والكشف المبكر. نسعى لنشر الوعي الصحي وتوفير المعلومات الموثوقة لكل امرأة عربية.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4 text-pink-100">روابط سريعة</h4>
            <ul className="space-y-2 text-pink-200">
              <li><Link href="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link href="/articles" className="hover:text-white transition-colors">المقالات التوعوية</Link></li>
              <li><Link href="/self-exam" className="hover:text-white transition-colors">الفحص الذاتي</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">دخول الإدارة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-pink-100">معلومات قانونية</h4>
            <ul className="space-y-2 text-pink-200">
              <li><Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-pink-800 pt-8 text-center text-pink-300 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Azhar Breast Awareness. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 items-center">
            {settings?.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="hover:text-white transition-colors">
                {settings.contact_email}
              </a>
            )}
            {settings?.contact_phone && (
               <>
                <span className="mx-2">|</span>
                <a href={`tel:${settings.contact_phone}`} className="hover:text-white transition-colors">
                  {settings.contact_phone}
                </a>
               </>
            )}
            {!settings?.contact_email && !settings?.contact_phone && (
              <span>تواصل معنا عبر الموقع</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
