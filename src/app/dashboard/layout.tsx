'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  LayoutDashboard, 
  FileText, 
  Bell, 
  Calendar, 
  ListChecks, 
  AlertTriangle,
  LogOut,
  Menu,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'الرئيسية', href: '/dashboard', icon: LayoutDashboard },
  { name: 'المقالات التوعوية', href: '/dashboard/articles', icon: FileText },
  { name: 'قوالب التذكير', href: '/dashboard/reminders', icon: Bell },
  { name: 'مواعيد الكشف المبكر', href: '/dashboard/screening', icon: Calendar },
  { name: 'خطوات الفحص الذاتي', href: '/dashboard/self-exam', icon: ListChecks },
  { name: 'العلامات التحذيرية', href: '/dashboard/warnings', icon: AlertTriangle },
  { name: 'إعدادات الموقع', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-600" />
            <span className="font-bold text-pink-900">لوحة التحكم</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-0 right-0 h-screen w-64 bg-white border-l z-40
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 hidden lg:block">
              <div className="flex items-center gap-2">
                <Heart className="h-8 w-8 text-pink-600" />
                <div>
                  <h1 className="text-xl font-bold text-pink-900">طمانينة</h1>
                  <p className="text-sm text-gray-600">لوحة التحكم</p>
                </div>
              </div>
            </div>

            <Separator className="hidden lg:block" />

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-pink-50 text-pink-900 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <Separator />

            {/* User Info & Logout */}
            <div className="p-4 space-y-2">
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">{profile?.display_name || 'المدير'}</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
