import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScreeningSchedule } from '@/types';
import { Metadata } from 'next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'مواعيد الكشف المبكر | Azhar Breast Awareness',
  description: 'جداول وتوصيات الكشف المبكر حسب العمر والجنس للوقاية من سرطان الثدي.',
};

async function getSchedules() {
  try {
    const snapshot = await getDocs(collection(db, 'screening_schedules'));
    // Client-side sorting because we might not have a composite index on generic fields yet
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ScreeningSchedule[];
    return data.sort((a, b) => a.start_age - b.start_age);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return [];
  }
}

export default async function ScreeningPage() {
  const schedules = await getSchedules();
  const females = schedules.filter(s => s.gender === 'female');
  const males = schedules.filter(s => s.gender === 'male'); // Although rare, sometimes info is provided

  const getExamBadge = (type: string) => {
    switch (type) {
      case 'self': return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">فحص ذاتي</Badge>;
      case 'clinical': return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">فحص سريري</Badge>;
      case 'mammogram': return <Badge variant="outline" className="bg-pink-50 text-pink-700 hover:bg-pink-100">ماموجرام</Badge>;
      default: return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 min-h-screen max-w-5xl">
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-3 sm:mb-4">مواعيد الكشف المبكر</h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
          التوصيات الطبية للكشف المبكر هي خط الدفاع الأول. فيما يلي الجداول الموصى بها حسب العمر.
        </p>
      </div>

      <div className="space-y-8 sm:space-y-12">
        {/* Females Section */}
        <Card className="border-pink-200 shadow-md">
          <CardHeader className="bg-pink-50 border-b border-pink-100 p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl text-pink-700">توصيات السيدات</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-right w-1/4 p-3 sm:p-4 md:p-6 text-sm sm:text-base">العمر</TableHead>
                    <TableHead className="text-right w-1/4 p-3 sm:p-4 md:p-6 text-sm sm:text-base">نوع الفحص</TableHead>
                    <TableHead className="text-right w-1/4 p-3 sm:p-4 md:p-6 text-sm sm:text-base">التكرار</TableHead>
                    <TableHead className="text-right w-1/4 p-3 sm:p-4 md:p-6 text-sm sm:text-base">ملاحظات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {females.map((item) => (
                    <TableRow key={item.id} className="text-sm sm:text-base md:text-lg">
                      <TableCell className="p-3 sm:p-4 md:p-6 font-medium">من سن {item.start_age}</TableCell>
                      <TableCell className="p-3 sm:p-4 md:p-6">{getExamBadge(item.exam_type)}</TableCell>
                      <TableCell className="p-3 sm:p-4 md:p-6">{item.frequency_text_ar}</TableCell>
                      <TableCell className="p-3 sm:p-4 md:p-6 text-gray-600">{item.notes_ar || '-'}</TableCell>
                    </TableRow>
                  ))}
                  {females.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center p-6 sm:p-8 text-gray-500 text-sm sm:text-base">لا توجد بيانات متاحة حالياً.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Males Section if exists */}
        {males.length > 0 && (
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-blue-50 border-b border-blue-100 p-4 sm:p-6">
              <CardTitle className="text-xl sm:text-2xl text-blue-700">توصيات الرجال</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-right w-1/4 p-3 sm:p-4 md:p-6 text-sm sm:text-base">العمر</TableHead>
                      <TableHead className="text-right w-1/4 p-3 sm:p-4 md:p-6 text-sm sm:text-base">نوع الفحص</TableHead>
                      <TableHead className="text-right w-1/4 p-3 sm:p-4 md:p-6 text-sm sm:text-base">التكرار</TableHead>
                      <TableHead className="text-right w-1/4 p-3 sm:p-4 md:p-6 text-sm sm:text-base">ملاحظات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {males.map((item) => (
                      <TableRow key={item.id} className="text-sm sm:text-base md:text-lg">
                        <TableCell className="p-3 sm:p-4 md:p-6 font-medium">من سن {item.start_age}</TableCell>
                        <TableCell className="p-3 sm:p-4 md:p-6">{getExamBadge(item.exam_type)}</TableCell>
                        <TableCell className="p-3 sm:p-4 md:p-6">{item.frequency_text_ar}</TableCell>
                        <TableCell className="p-3 sm:p-4 md:p-6 text-gray-600">{item.notes_ar || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
