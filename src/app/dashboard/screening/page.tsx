'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ScreeningSchedule } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ScreeningPage() {
  const [schedules, setSchedules] = useState<ScreeningSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScreeningSchedule | null>(null);

  const [formData, setFormData] = useState({
    gender: 'female' as 'female' | 'male',
    exam_type: 'self' as 'self' | 'clinical' | 'mammogram',
    start_age: 20,
    frequency_text_ar: '',
    notes_ar: '',
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'screening_schedules'));
      const schedulesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScreeningSchedule[];
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('فشل تحميل مواعيد الكشف');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        notes_ar: formData.notes_ar || undefined,
      };

      if (editingSchedule) {
        await updateDoc(doc(db, 'screening_schedules', editingSchedule.id), data);
        toast.success('تم تحديث الموعد بنجاح');
      } else {
        await addDoc(collection(db, 'screening_schedules'), data);
        toast.success('تم إضافة الموعد بنجاح');
      }

      setDialogOpen(false);
      resetForm();
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('فشل حفظ الموعد');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموعد؟')) return;

    try {
      await deleteDoc(doc(db, 'screening_schedules', id));
      toast.success('تم حذف الموعد بنجاح');
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('فشل حذف الموعد');
    }
  };

  const openEditDialog = (schedule: ScreeningSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      gender: schedule.gender,
      exam_type: schedule.exam_type,
      start_age: schedule.start_age,
      frequency_text_ar: schedule.frequency_text_ar,
      notes_ar: schedule.notes_ar || '',
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingSchedule(null);
    setFormData({
      gender: 'female',
      exam_type: 'self',
      start_age: 20,
      frequency_text_ar: '',
      notes_ar: '',
    });
  };

  const getExamTypeLabel = (type: string) => {
    switch (type) {
      case 'self': return 'فحص ذاتي';
      case 'clinical': return 'فحص سريري';
      case 'mammogram': return 'تصوير الثدي';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">مواعيد الكشف المبكر</h1>
          <p className="text-gray-600 mt-1">إدارة جداول الكشف المبكر حسب العمر والجنس</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="ml-2 h-4 w-4" />
              إضافة موعد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSchedule ? 'تعديل موعد' : 'إضافة موعد جديد'}</DialogTitle>
              <DialogDescription>
                {editingSchedule ? 'قم بتعديل بيانات الموعد' : 'أدخل بيانات الموعد الجديد'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gender">الجنس</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: 'female' | 'male') => 
                    setFormData(prev => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">إناث</SelectItem>
                    <SelectItem value="male">ذكور</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exam_type">نوع الفحص</Label>
                <Select
                  value={formData.exam_type}
                  onValueChange={(value: 'self' | 'clinical' | 'mammogram') => 
                    setFormData(prev => ({ ...prev, exam_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="self">فحص ذاتي</SelectItem>
                    <SelectItem value="clinical">فحص سريري</SelectItem>
                    <SelectItem value="mammogram">تصوير الثدي (ماموجرام)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_age">العمر المبدئي</Label>
                <Input
                  id="start_age"
                  type="number"
                  min="1"
                  value={formData.start_age}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_age: parseInt(e.target.value) }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">نص التكرار (مثال: مرة كل سنة)</Label>
                <Input
                  id="frequency"
                  value={formData.frequency_text_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency_text_ar: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes_ar}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes_ar: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  إلغاء
                </Button>
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  {editingSchedule ? 'حفظ التعديلات' : 'إضافة'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-600">لا توجد مواعيد كشف بعد</p>
          <Button 
            className="mt-4 bg-pink-600 hover:bg-pink-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="ml-2 h-4 w-4" />
            إضافة أول موعد
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الجنس</TableHead>
                <TableHead className="text-right">نوع الفحص</TableHead>
                <TableHead className="text-right">العمر المبدئي</TableHead>
                <TableHead className="text-right">التكرار</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    <Badge variant={schedule.gender === 'female' ? 'default' : 'secondary'}>
                      {schedule.gender === 'female' ? 'إناث' : 'ذكور'}
                    </Badge>
                  </TableCell>
                  <TableCell>{getExamTypeLabel(schedule.exam_type)}</TableCell>
                  <TableCell>من سن {schedule.start_age}</TableCell>
                  <TableCell>{schedule.frequency_text_ar}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(schedule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
