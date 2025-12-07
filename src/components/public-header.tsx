'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export function PublicHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show header on login or dashboard pages
  if (pathname.startsWith('/dashboard') || pathname === '/login') {
    return null;
  }

  const links = [
    { href: '/', label: 'الرئيسية' },
    { href: '/articles', label: 'المقالات التوعوية' },
    { href: '/self-exam', label: 'الفحص الذاتي' },
    { href: '/self-exam/steps', label: 'خطوات الفحص' },
    { href: '/self-exam/screening', label: 'مواعيد الكشف' },
    { href: '/self-exam/warnings', label: 'العلامات التحذيرية' },
  ];

  return (
    <header className="fixed top-0 w-full border-b bg-white/95 backdrop-blur z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl text-pink-600">
          أزهــر
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                pathname === link.href ? 'text-pink-600' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild variant="default" className="bg-pink-600 hover:bg-pink-700">
            <Link href="/login">دخول الإدارة</Link>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium ${
                    pathname === link.href ? 'text-pink-600' : 'text-gray-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-4 bg-pink-600 hover:bg-pink-700">
                <Link href="/login">دخول الإدارة</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
