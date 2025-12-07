'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Bell, Calendar, ListChecks, AlertTriangle, Users } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'المقالات', value: '0', icon: FileText, color: 'bg-blue-500' },
    { name: 'قوالب التذكير', value: '0', icon: Bell, color: 'bg-green-500' },
    { name: 'مواعيد الكشف', value: '0', icon: Calendar, color: 'bg-purple-500' },
    { name: 'خطوات الفحص', value: '0', icon: ListChecks, color: 'bg-orange-500' },
    { name: 'العلامات', value: '0', icon: AlertTriangle, color: 'bg-red-500' },
    { name: 'المستخدمين', value: '0', icon: Users, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-600 mt-2">مرحباً بك في لوحة التحكم الخاصة بتطبيق Azhar Breast Awareness</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
          <CardDescription>
            ابدأ بإدارة محتوى التطبيق من القائمة الجانبية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <FileText className="h-8 w-8 text-pink-600 mb-2" />
              <h3 className="font-semibold mb-1">إدارة المقالات</h3>
              <p className="text-sm text-gray-600">إضافة وتعديل المقالات التوعوية</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Bell className="h-8 w-8 text-pink-600 mb-2" />
              <h3 className="font-semibold mb-1">قوالب التذكير</h3>
              <p className="text-sm text-gray-600">إنشاء وتعديل قوالب التذكير</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
